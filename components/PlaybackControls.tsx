import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkullPlayIcon, ClassicPlayIcon } from '@/components/icons/PlayerIcons';
import StopIcon from '@/components/icons/StopIcon';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';

const PlaybackControls = () => {
  const { isPlaying, togglePlay, stop, mediaLoaded, goBack, mode, audioUri } = usePlayerStore();
  
  // Determina se i controlli devono essere abilitati
  const isAudioMode = mode.toUpperCase() === 'AUDIO';
  const hasAudioContent = audioUri !== null;
  const controlsEnabled = mediaLoaded || (isAudioMode && hasAudioContent);
  
  // Gestisce il play con controllo di contenuto
  const handlePlay = () => {
    if (isAudioMode && !hasAudioContent) {
      Alert.alert('Audio non presente', 'Carica un file audio prima di riprodurre.');
      return;
    }
    togglePlay();
  };
  
  // Gestisce lo stop con controllo di contenuto
  const handleStop = () => {
    if (isAudioMode && !hasAudioContent) {
      Alert.alert('Audio non presente', 'Nessun audio da fermare.');
      return;
    }
    stop();
  };

  return (
    <View style={styles.container}>
      <View style={{ transform: [{ translateX: 16 }] }}>
        <TouchableOpacity 
          style={[
            styles.button, 
            {
              backgroundColor: isPlaying ? '#FFFFFF' : '#00FF00',
              shadowColor: isPlaying ? '#FFFFFF' : '#00FF00',
              borderWidth: 2,
              borderColor: isPlaying ? '#000000' : '#00AA00',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 4,
            }
          ]}
          onPress={handlePlay}
          disabled={false} // Sempre cliccabile per mostrare messaggio
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Ionicons name="pause" size={24} color="#000000" />
          ) : (
            <Ionicons name="play" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={{ transform: [{ translateY: -42 }, { translateX: 2 }] }}>
        <TouchableOpacity 
          style={[
            styles.button,
            {
              backgroundColor: '#FFD700',
              shadowColor: '#FFD700',
              borderWidth: 2,
              borderColor: '#E6C200',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 4,
            }
          ]}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={{ transform: [{ translateX: -4 }] }}>
        <TouchableOpacity 
          style={[
            styles.button, 
            {
              backgroundColor: '#FF6B35',
              shadowColor: '#FF6B35',
              borderWidth: 2,
              borderColor: '#E55A2B',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 4,
            }
          ]}
          onPress={handleStop}
          disabled={false}
          activeOpacity={0.7}
        >
          <Ionicons name="square" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.controlYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: -8,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#555555',
  },
  backButton: {
    backgroundColor: colors.surfaceLight,
  },
});

export default PlaybackControls;
