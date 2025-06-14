import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { usePlayerStore } from '@/store/player-store';
import { saveMediaToGallery } from '@/utils/saveMediaToGallery';

/**
 * Componente per gestire la registrazione audio
 */
const AudioRecorder = () => {
  // Riferimenti allo stato dello store
  const { isRecording, setAudioUri, setRecordingTime } = usePlayerStore();
  
  // Riferimento alla registrazione
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Gestisci l'inizio/fine della registrazione quando cambia isRecording nello store
  useEffect(() => {
    const startRecording = async () => {
      try {
        console.log('Avvio registrazione...');
        
        // Richiedi permessi
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        if (audioStatus !== 'granted') {
          Alert.alert('Permesso negato', 'È necessario concedere i permessi al microfono per registrare audio.');
          usePlayerStore.getState().stopRecording();
          return;
        }
        
        console.log('Inizializzazione registrazione audio...');
        
        // Configura la modalità audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('Configurazione modalità audio...');

        // Crea una nuova registrazione
        const recording = new Audio.Recording();
        console.log('Creazione nuovo oggetto registrazione...');
        
        // Prepara e avvia la registrazione
        await recording.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.IOSAudioQuality.MEDIUM,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });
        console.log('Preparazione registrazione...');
        
        await recording.startAsync();
        console.log('Avvio registrazione...');
        
        recordingRef.current = recording;
        console.log('Registrazione audio avviata con successo!');
        
        // Timer per la durata massima (30 secondi)
        let duration = 0;
        recordingTimerRef.current = setInterval(() => {
          duration += 1;
          setRecordingDuration(duration);
          setRecordingTime(duration); // Aggiorna anche il player-store
          
          if (duration >= 30) {
            // Stop automatico dopo 30 secondi
            if (usePlayerStore.getState().isRecording) {
              usePlayerStore.getState().stopRecording();
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Errore nell\'avvio della registrazione:', error);
        Alert.alert('Errore', 'Si è verificato un errore durante l\'avvio della registrazione.');
        usePlayerStore.getState().stopRecording();
      }
    };

    const stopRecording = async () => {
      try {
        // Ferma il timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
          setRecordingDuration(0);
        }
        
        // Verifiche di sicurezza
        if (!recordingRef.current) {
          console.warn('Nessuna registrazione attiva da fermare');
          return;
        }
        
        console.log('Arresto registrazione...');
        
        try {
          // Ferma la registrazione con gestione degli errori
          const status = await recordingRef.current.getStatusAsync();
          if (status.canRecord) {
            await recordingRef.current.stopAndUnloadAsync();
          }
        } catch (err) {
          console.warn('Errore nel controllo stato registrazione:', err);
        }
        
        console.log('Arresto registrazione audio...');
        
        try {
          // Ripristina la modalità audio
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
        } catch (err) {
          console.warn('Errore nel ripristino modalità audio:', err);
        }
        
        console.log('Ripristino modalità audio...');
        
        // Ottieni l'URI della registrazione (con gestione errori)
        let uri = null;
        try {
          uri = recordingRef.current.getURI();
          console.log(`Registrazione audio completata, URI: ${uri}`);
          
          if (uri) {
            // Salviamo direttamente con la nuova funzione unificata
            const savedUri = await saveMediaToGallery(uri);
            console.log(`Audio salvato in: ${savedUri}`);
            
            // Usa l'URI salvato se disponibile, altrimenti l'URI originale
            const finalUri = savedUri || uri;
            
            // Imposta l'URI nello store
            setAudioUri(finalUri);
            
            // Registra l'ultima creazione
            usePlayerStore.getState().setLastCreation({
              id: Date.now().toString(),
              name: `Audio ${new Date().toLocaleTimeString()}`,
              type: 'AUDIO',
              uri: finalUri,
              timestamp: Date.now(),
              effects: usePlayerStore.getState().activeEffects.length > 0 
                ? [...usePlayerStore.getState().activeEffects] 
                : undefined
            });
          }
        } catch (err) {
          console.warn('Errore nel recupero URI della registrazione:', err);
        }
        
        // Resetta il riferimento
        recordingRef.current = null;
      } catch (error) {
        console.error('Errore nell\'arresto della registrazione:', error);
        Alert.alert('Errore', 'Si è verificato un errore durante l\'arresto della registrazione.');
        recordingRef.current = null;
      }
    };

    if (isRecording) {
      startRecording();
    } else if (recordingRef.current !== null) {
      stopRecording();
    }

    // Cleanup nel caso il componente venga smontato durante la registrazione
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      if (recordingRef.current && isRecording) {
        console.log('Cleanup registrazione nel useEffect');
        recordingRef.current.stopAndUnloadAsync().catch(error => {
          console.error('Errore nel cleanup della registrazione:', error);
        });
      }
    };
  }, [isRecording]);

  // Il componente non ha UI, è solo logica
  return null;
};

export default AudioRecorder;
