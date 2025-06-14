import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MemeImageViewer from './MemeImageViewer';
import VideoPlayer from '@/types/VideoPlayer';
import AudioPlayer from './AudioPlayer';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';

interface StatusDisplayProps {
  onToggleFullscreen?: (isFullscreen: boolean) => void;
  activeVideoEffects?: string[];
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ onToggleFullscreen, activeVideoEffects = [] }) => {
  const [placeholderImages, setPlaceholderImages] = useState<{ [key: string]: string }>({});

  const { mode, isPlaying, isRecording, recordingTime, memeImageUri, videoUri, audioUri, isPlayerLocked } = usePlayerStore();

    // Simulazione di placeholder per le diverse modalità
  useEffect(() => {
    // In un'implementazione reale, questi sarebbero caricati dalle risorse dell'app
    setPlaceholderImages({
      'AUDIO': 'waveform_placeholder.png',
      'VIDEO': 'video_placeholder.png',
      'MEME': 'meme_placeholder.png',
      'AI': 'ai_placeholder.png',
    });
  }, []);

  const getStatusText = () => {
    const upperMode = mode.toUpperCase();
    
    if (isRecording) {
      return upperMode === 'AUDIO' 
        ? "Audio in registrazione" 
        : upperMode === 'VIDEO'
          ? "Video in registrazione"
          : upperMode === 'AI'
            ? "AI in elaborazione"
            : "Meme in creazione";
    }
    
    if (isPlaying) {
      return upperMode === 'AUDIO' 
        ? "Audio in riproduzione" 
        : upperMode === 'VIDEO' 
          ? "Video in riproduzione" 
          : upperMode === 'AI'
            ? "AI in esecuzione"
            : "Meme visualizzato";
    }
    
    return upperMode === 'AUDIO' 
      ? "Audio pronto" 
      : upperMode === 'VIDEO' 
        ? "Video pronto" 
        : upperMode === 'AI'
          ? "AI pronto"
          : "Meme pronto";
  };

  // Funzione per formattare il tempo di registrazione
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Otteniamo la funzione loadMediaFromLibrary dallo store - NON PIÙ USATA
  // const { loadMediaFromLibrary } = usePlayerStore();

  // Stile condizionale per il container in base alla modalità
  const containerStyle = () => {
    switch(mode.toUpperCase()) {
      case 'AUDIO':
        return styles.audioContainer;
      case 'VIDEO':
        return styles.videoContainer;
      case 'IMAGE':
      case 'MEME':
        return styles.memeContainer;
      case 'AI':
        return styles.aiContainer;
      default:
        return {};
    }
  };

  return (
    <View style={[styles.container, containerStyle()]}>
      {/* PRIORITÀ: Se player è locked, mostra il contenuto principale indipendentemente dalla modalità */}
      {isPlayerLocked && memeImageUri ? (
        <View style={styles.memePreview}>
          <MemeImageViewer 
            imageUri={memeImageUri} 
            onToggleFullscreen={onToggleFullscreen}
          />
        </View>
      ) : isPlayerLocked && videoUri ? (
        <View style={styles.videoPreview}>
          <VideoPlayer 
            onToggleFullscreen={onToggleFullscreen}
            activeEffects={activeVideoEffects}
          />
        </View>
      ) : isPlayerLocked && audioUri ? (
        <View style={styles.audioPreview}>
          <AudioPlayer />
        </View>
      ) : mode.toUpperCase() === 'AI' ? (
        <View style={styles.staticPlaceholder}>
        </View>
      ) : mode.toUpperCase() === 'MEME' || mode.toUpperCase() === 'IMAGE' ? (
        <View style={styles.memePreview}>
          {memeImageUri ? (
            // Se c'è un'immagine selezionata, visualizziamo il MemeImageViewer
            <MemeImageViewer 
              imageUri={memeImageUri} 
              onToggleFullscreen={onToggleFullscreen}
            />
          ) : (
            // Placeholder statico senza interazione
            <View style={styles.staticPlaceholder}>
            </View>
          )}
        </View>
      ) : mode.toUpperCase() === 'VIDEO' ? (
        <View style={styles.videoPreview}>
          {videoUri ? (
            // Se c'è un video selezionato, visualizziamo il VideoPlayer
            <VideoPlayer 
              onToggleFullscreen={onToggleFullscreen}
              activeEffects={activeVideoEffects}
            />
          ) : (
            // Placeholder statico senza interazione
            <View style={styles.staticPlaceholder}>
            </View>
          )}
        </View>
      ) : (
        // Modalità AUDIO
        <View style={styles.audioPreview}>
          {audioUri ? (
            // Utilizziamo il componente AudioPlayer
            <AudioPlayer />
          ) : isRecording ? (
            // Durante la registrazione mostra il tempo
            <View style={styles.recordingDisplay}>
              <Text style={styles.recordingTimeText}>{formatRecordingTime(recordingTime)}</Text>
              <Text style={styles.recordingStatusText}>Audio in registrazione</Text>
            </View>
          ) : (
            <View style={styles.staticPlaceholder}>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
  },
  staticPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  memePreview: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Cambiato da 'hidden' per assicurarci che il pulsante di ingrandimento sia visibile
    position: 'relative',
  },
  audioPreview: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImageButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  audioContainer: {},
  videoContainer: {
    backgroundColor: '#121212', // Un po' più scuro del container principale
  },
  memeContainer: {},
  aiContainer: {},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    height: Platform.OS === 'android' ? 200 : 220, // Ulteriormente aumentata per allineare al nuovo design
    backgroundColor: '#222222',
    borderRadius: 0, // Rimuovere bordi arrotondati per aspetto pulito
    marginHorizontal: 0, // Rimuovere margini laterali
    position: 'relative', // Aggiunto per garantire il posizionamento assoluto corretto
  },
  statusText: {
    fontSize: Platform.OS === 'android' ? 28 : 32,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  recordingDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingTimeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34D399', // Verde audio
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recordingStatusText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default StatusDisplay;