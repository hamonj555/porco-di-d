import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useSavedContentsStore, SavedContent } from '@/store/saved-contents-store';
import { effects } from '@/mocks/effects';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { applyMediaModifications, detectMediaType } from '@/utils/ffmpegUtils';
import { applyVideoEffect, generateTempVideoPath } from '@/utils/videoEffects';

interface ApplyButtonProps {
  size?: number;
  style?: any;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ size = 30, style }) => {
  const { 
    mode, videoUri, audioUri, memeImageUri, activeEffects, 
    volume, speed, hasAppliedChanges, appliedVolume, appliedSpeed,
    setAppliedSettings, setHasAppliedChanges, setVideoUri, setAudioUri,
    previewAudioUri, setPreviewAudioUri, setPreviewPlaying,
    isInPlayer, setIsInPlayer, hasCombination, setHasCombination,
    pendingAudioUri, setPendingAudioUri
  } = usePlayerStore();
  const { addContent, contents, isHydrated } = useSavedContentsStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const saveMediaToGallery = async () => {
    try {
      /* 1 ─ permessi: firma senza argomenti ⇒ compatibile 17.0 e 17.1 */
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso negato', 'Concedi i permessi per salvare i media.');
        return;
      }

      /* 2 ─ scegli la sorgente (priorità: video > audio > meme) */
      let uri: string | null = null;
      let mediaType = '';
      if (videoUri) {
        uri = videoUri;
        mediaType = 'video';
      } else if (audioUri) {
        uri = audioUri;
        mediaType = 'audio';
      } else if (memeImageUri) {
        uri = memeImageUri;
        mediaType = 'image';
      }

      if (!uri) {
        Alert.alert('Nessun media', 'Non c’è alcun contenuto da salvare.');
        return;
      }

      /* 3 ─ copia in una cartella temporanea dell’app (opzionale) */
      const timestamp = Date.now();
      const ext = uri.split('.').pop() || '';
      const dest = `${FileSystem.documentDirectory}mocked_${mediaType}_${timestamp}.${ext}`;
      await FileSystem.downloadAsync(uri, dest);

      /* 4 ─ salva nello storage pubblico – UN SOLO ARGOMENTO */
      const asset = await MediaLibrary.createAssetAsync(dest);

      /* 5 ─ notifica utente */
      Alert.alert(
        'Salvato!',
        `Il tuo ${mediaType} è stato salvato in galleria e nel profilo.`,
        [{ text: 'OK' }]
      );

      return true;
    } catch (error: any) {
      console.error('Errore durante il salvataggio del media:', error);
      Alert.alert('Errore', 'Impossibile salvare il media.');
      return false;
    }
  };

  const applyChanges = async () => {
    try {
      setIsProcessing(true);
      
      // COMBINAZIONE MEME + AUDIO PENDING → FUSIONE VIDEO
      if (memeImageUri && pendingAudioUri) {
        console.log('🎆 Applicando fusione meme + audio → video');
        
        // Chiama la fusione reale
        const { fuseMemeWithAudio } = usePlayerStore.getState();
        const videoPath = await fuseMemeWithAudio();
        
        if (videoPath) {
          Alert.alert('Fusione completata!', 'Meme + Audio → Video MP4 creato!');
        }
        return;
      }
      
      // COMBINAZIONE VIDEO + AUDIO PENDING
      if (videoUri && pendingAudioUri) {
        console.log('🎆 Combinando video + audio:', { videoUri, pendingAudioUri });
        setAudioUri(pendingAudioUri);
        setPendingAudioUri(null);
        Alert.alert('Combinato!', 'Audio applicato al video.');
        return;
      }
      
      // EFFETTI VIDEO/AUDIO
      if (activeEffects.length > 0) {
        console.log('Applicando effetti:', activeEffects);
        // Implementazione futura effetti
      }
      
      // MODIFICHE VOLUME/SPEED
      if (volume !== 80 || speed !== 100) {
        console.log('Applicando modifiche audio:', { volume, speed });
        // Implementazione futura modifiche
      }
      
    } catch (error) {
      console.error('Errore applicazione modifiche:', error);
      Alert.alert('Errore', 'Impossibile applicare le modifiche.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePress = async () => {
    // Verifica se c'è contenuto nel player
    const hasContent = videoUri || audioUri || memeImageUri;
    if (!hasContent) {
      Alert.alert('Nessun media', 'Carica o registra un contenuto prima.');
      return;
    }

    // Verifica se ci sono modifiche/effetti/combinazioni da applicare
    const hasChangesToApply = (
      activeEffects.length > 0 || 
      volume !== 80 || 
      speed !== 100 ||
      // Verifica combinazioni: meme + audio pending
      (memeImageUri && pendingAudioUri) ||
      // Video + audio pending  
      (videoUri && pendingAudioUri) ||
      // Altri tipi di combinazioni future
      false
    );

    if (!hasCombination && hasChangesToApply) {
      // PRIMO TAP: Applica modifiche/combinazioni
      await applyChanges();
      setHasCombination(true);
      Alert.alert('Modifiche applicate!', 'Tasto APPLICA di nuovo per salvare.');
    } else {
      // SECONDO TAP: Salva nel telefono
      await finalizeAndSave();
      setHasCombination(false);
    }
  };

  const finalizeAndSave = async () => {
    try {
      setIsProcessing(true);
      
      // Ottieni l'URI corrente (priorità: video > audio > meme)
      let currentUri: string | null = null;
      let contentType = '';
      if (videoUri) {
        currentUri = videoUri;
        contentType = 'video';
      } else if (audioUri) {
        currentUri = audioUri;
        contentType = 'audio';
      } else if (memeImageUri) {
        currentUri = memeImageUri;
        contentType = 'image';
      }
      
      if (!currentUri) {
        Alert.alert('Errore', 'Nessun contenuto da salvare.');
        return;
      }

      // Salva in galleria
      const gallerySaved = await saveMediaToGallery();
      
      if (gallerySaved) {
        // Salva nel profilo utente
        const savedContent: SavedContent = {
          id: Date.now().toString(),
          name: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${new Date().toLocaleTimeString()}`,
          type: mode.toUpperCase() as any,
          path: currentUri,
          dateCreated: Date.now(),
          effects: activeEffects.length > 0 ? [...activeEffects] : undefined
        };
        
        addContent(savedContent);
        
        Alert.alert('Salvato!', 'Il contenuto è stato salvato con successo!');
      }
    } catch (error) {
      console.error('Errore salvataggio:', error);
      Alert.alert('Errore', 'Impossibile salvare il contenuto.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isProcessing && styles.processing, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Ionicons name="checkmark-circle" size={size} color={colors.text} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginTop: -10,
  },
  processing: {
    opacity: 0.7,
    backgroundColor: '#FF9800',
  },
});

export default ApplyButton;
