import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ sostituisce lucide-react-native
import { SkullRecordIcon } from '@/components/icons/PlayerIcons';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const RecordButton = () => {
  const { mode, isRecording, toggleRecording } = usePlayerStore();

  const saveVideoToGallery = async (uri: string) => {
    try {
      const fileName = `mocked_video_${new Date().getTime()}.mp4`;
      let destinationUri = `${FileSystem.documentDirectory}${fileName}`;

      if (Platform.OS === 'android') {
        try {
          const dcimPath = `${FileSystem.documentDirectory}/../DCIM/Camera/`;
          const dirInfo = await FileSystem.getInfoAsync(dcimPath);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dcimPath, { intermediates: true });
          }
          destinationUri = `${dcimPath}${fileName}`;
        } catch (error) {
          console.warn('Impossibile accedere a DCIM/Camera, si salva nella directory dell\'app', error);
          destinationUri = `${FileSystem.documentDirectory}${fileName}`;
        }
      }

      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri
      });

      console.log(`Video salvato con successo in: ${destinationUri}`);

      Alert.alert(
        'Video salvato',
        Platform.OS === 'android'
          ? 'Il video è stato salvato nella cartella DCIM/Camera del tuo dispositivo'
          : 'Il video è stato salvato nella galleria'
      );

      return true;
    } catch (error) {
      console.error('Errore durante il salvataggio del video:', error);
      Alert.alert('Errore', 'Si è verificato un errore durante il salvataggio del video nella galleria');
      return false;
    }
  };

  const handlePress = async () => {
    if (mode === 'VIDEO') {
      try {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permesso negato', 'È necessario concedere i permessi della fotocamera per registrare video.');
          return;
        }

        if (Platform.OS === 'android') {
          const { status: mediaPermission } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (mediaPermission !== 'granted') {
            Alert.alert('Permesso negato', 'È necessario concedere i permessi alla galleria per salvare i video.');
          }
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: false,
          aspect: [16, 9],
          quality: 1,
          videoMaxDuration: 20,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const videoUri = result.assets[0].uri;
          usePlayerStore.getState().setVideoUri(videoUri);

          if (mode !== 'VIDEO') {
            usePlayerStore.getState().setMode('VIDEO');
          }
          
          usePlayerStore.getState().setLastCreation({
            id: Date.now().toString(),
            name: `Video ${new Date().toLocaleTimeString()}`,
            type: 'VIDEO',
            uri: videoUri,
            timestamp: Date.now(),
            effects: usePlayerStore.getState().activeEffects.length > 0 
              ? [...usePlayerStore.getState().activeEffects] 
              : undefined
          });
        }
      } catch (error) {
        console.error('Errore durante la registrazione video:', error);
        Alert.alert('Errore', 'Si è verificato un errore durante la registrazione del video.');
      }
    } else if (mode === 'MEME') {
      // NUOVA FUNZIONALITÀ: Scatta foto per MEME
      try {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert('Permesso negato', 'È necessario concedere i permessi della fotocamera per scattare foto.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          usePlayerStore.getState().setMemeImageUri(imageUri);
          
          usePlayerStore.getState().setLastCreation({
            id: Date.now().toString(),
            name: `Meme ${new Date().toLocaleTimeString()}`,
            type: 'MEME',
            uri: imageUri,
            timestamp: Date.now(),
            effects: usePlayerStore.getState().activeEffects.length > 0 
              ? [...usePlayerStore.getState().activeEffects] 
              : undefined
          });
        }
      } catch (error) {
        console.error('Errore durante lo scatto foto:', error);
        Alert.alert('Errore', 'Si è verificato un errore durante lo scatto della foto.');
      }
    } else {
      toggleRecording();
    }
  };

  const renderIcon = () => {
    const size = 35;

    switch (mode) {
      case 'AUDIO':
        return (
          <SkullRecordIcon 
            size={size} 
            skullColor="#121212" 
            eyeColor="#00FFFF" 
            outlineColor="#00FFFF" 
            centerColor="#FF0000"
          />
        );
      case 'VIDEO':
        return (
          <SkullRecordIcon 
            size={size} 
            skullColor="#000000" 
            eyeColor="#FF3030" 
            outlineColor="#FF3030" 
            centerColor="#FF0000"
          />
        );
      case 'MEME':
        return (
          <SkullRecordIcon 
            size={size} 
            skullColor="#1a1a1a" 
            eyeColor="#FFFF00" 
            outlineColor="#FFAA00" 
            centerColor="#FF0080"
          />
        );
      case 'AI':
        return (
          <SkullRecordIcon 
            size={size} 
            skullColor="#2a2a2a" 
            eyeColor="#8000FF" 
            outlineColor="#7C4DFF" 
            centerColor="#00FF00"
          />
        );
      default:
        return (
          <SkullRecordIcon 
            size={size} 
            skullColor="#000000" 
            eyeColor="#FF0000" 
            outlineColor="#FF0000" 
            centerColor="#FF0000"
          />
        );
    }
  };

  const isDisabled = mode === 'AI'; // Solo AI è disabilitato, MEME ora funziona

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isRecording && styles.recording,
        isDisabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    marginHorizontal: 10,
    zIndex: 10,
    marginTop: -10,
    borderWidth: 2,
    borderColor: '#FF3030',
  },
  recording: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordButton;
