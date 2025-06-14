import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediaControlBar from './MediaControlBar';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { saveAndShareMedia } from '@/utils/shareUtils';
import * as FileSystem from 'expo-file-system';

interface MemeImageViewerProps {
  imageUri?: string;
  loading?: boolean;
  onToggleFullscreen?: (isFullscreen: boolean) => void;
  onChangeImage?: () => void;
}

const { width, height } = Dimensions.get('window');

const MemeImageViewer: React.FC<MemeImageViewerProps> = ({ imageUri, loading = false, onToggleFullscreen, onChangeImage }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMediaControls, setShowMediaControls] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { mode } = usePlayerStore();

  // Funzione di condivisione
  const handleSmartShare = async () => {
    if (!imageUri) {
      Alert.alert('Nessun contenuto', 'Non c\'è nessuna immagine da condividere');
      return;
    }
    
    try {
      setIsSharing(true);
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('File non trovato');
      }
      await saveAndShareMedia(imageUri, mode);
    } catch (error) {
      console.error('Errore durante la condivisione:', error);
      Alert.alert('Errore', 'Non è stato possibile condividere l\'immagine');
    } finally {
      setIsSharing(false);
    }
  };

  const toggleFullscreen = () => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    if (onToggleFullscreen) {
      onToggleFullscreen(newState);
    }
  };

  // Toggle dei controlli media
  const toggleMediaControls = () => {
    setShowMediaControls(!showMediaControls);
  };

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Seleziona un'immagine</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUri }} 
        style={styles.image}
        resizeMode="contain"
        onError={(e) => console.log('Errore caricamento immagine:', e.nativeEvent.error)}
      />

      <TouchableOpacity style={styles.maximizeButton} onPress={toggleFullscreen}>
        <Ionicons name="expand-outline" size={20} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isFullscreen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleFullscreen}
      >
        <View style={styles.fullscreenContainer}>
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity 
              style={styles.shareFullscreenButton} 
              onPress={handleSmartShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="share-outline" size={20} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={toggleFullscreen}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <Image 
            source={{ uri: imageUri }} 
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    position: 'relative',
  },
  image: {
    width: width - 40,
    height: '100%',
    maxHeight: 240,
  },
  placeholderText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  maximizeButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mediaToggleButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mediaControlsContainer: {
    position: 'absolute',
    top: 55,
    right: 15,
    zIndex: 9,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  shareFullscreenButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaControlBar: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 20,
  },
  fullscreenMediaControlBar: {
    position: 'relative',
    top: 0,
    left: 0,
    zIndex: 20,
  },
  fullscreenControlsOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(124, 77, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  changeImageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default MemeImageViewer;
