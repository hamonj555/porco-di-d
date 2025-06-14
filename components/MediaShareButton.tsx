import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { saveAndShareMedia } from '@/utils/shareUtils';
import { SharingModule } from '@/utils/ExpoModules';

interface MediaShareButtonProps {
  size?: number;
  color?: string;
  style?: any;
}

const MediaShareButton: React.FC<MediaShareButtonProps> = ({ 
  size = 24, 
  color = colors.primary,
  style
}) => {
  const { videoUri, audioUri, memeImageUri, mode } = usePlayerStore();
  const [isSharing, setIsSharing] = useState(false);
  
  const currentMediaUri = mode === 'VIDEO' 
    ? videoUri 
    : mode === 'AUDIO' 
      ? audioUri 
      : memeImageUri;
  
  const handleShare = async () => {
    if (!currentMediaUri) {
      Alert.alert('Nessun media', 'Non c\'è nessun media da condividere');
      return;
    }
    
    try {
      setIsSharing(true);
      const fileInfo = await FileSystem.getInfoAsync(currentMediaUri);
      if (!fileInfo.exists) {
        throw new Error('File non trovato');
      }
      await saveAndShareMedia(currentMediaUri, mode);
    } catch (error) {
      console.error('Errore durante la condivisione:', error);
      Alert.alert('Errore', 'Non è stato possibile condividere il media');
    } finally {
      setIsSharing(false);
    }
  };
  
  if (isSharing) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color={color} />
      </View>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handleShare}
      disabled={!currentMediaUri}
    >
      <Ionicons 
        name="share-social-outline" 
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

export default MediaShareButton;
