import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';

interface MediaDeleteButtonProps {
  size?: number;
  color?: string;
  style?: any;
}

const MediaDeleteButton: React.FC<MediaDeleteButtonProps> = ({ 
  size = 24, 
  color = colors.error || '#ff4d4d',
  style
}) => {
  const { 
    videoUri, 
    audioUri, 
    memeImageUri, 
    mode, 
    resetVideoUri, 
    resetAudioUri, 
    resetMemeImageUri 
  } = usePlayerStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  
  const currentMediaUri = mode === 'VIDEO' 
    ? videoUri 
    : mode === 'AUDIO' 
      ? audioUri 
      : memeImageUri;
  
  const handleDelete = async () => {
    if (!currentMediaUri) {
      Alert.alert('Nessun media', 'Non c\'è nessun media da eliminare');
      return;
    }
    
    Alert.alert(
      'Elimina media',
      `Sei sicuro di voler eliminare questo ${
        mode === 'VIDEO' ? 'video' : mode === 'AUDIO' ? 'audio' : 'meme'
      }?`,
      [
        {
          text: 'Annulla',
          style: 'cancel',
        },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              const fileInfo = await FileSystem.getInfoAsync(currentMediaUri);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(currentMediaUri);
              }

              if (mode === 'VIDEO') {
                resetVideoUri();
              } else if (mode === 'AUDIO') {
                resetAudioUri();
              } else {
                resetMemeImageUri();
              }

              Alert.alert('Eliminato', 'Il media è stato eliminato con successo');
            } catch (error) {
              console.error('Errore durante l\'eliminazione:', error);
              Alert.alert('Errore', 'Non è stato possibile eliminare il media');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };
  
  if (isDeleting) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color={color} />
      </View>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handleDelete}
      disabled={!currentMediaUri}
    >
      <Ionicons 
        name="trash-outline" 
        size={size} 
        color={currentMediaUri ? color : colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaDeleteButton;
