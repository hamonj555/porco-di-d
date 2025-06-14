import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert, Platform } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; // ✅ sostituito lucide-react-native
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface CameraRecorderProps {
  onClose: () => void;
}

const CameraRecorder: React.FC<CameraRecorderProps> = ({ onClose }) => {
  const { setVideoUri, mode } = usePlayerStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      
      setHasPermission(
        status === 'granted' && 
        audioStatus.status === 'granted' && 
        mediaLibraryStatus.status === 'granted'
      );
      
      if (status !== 'granted' || audioStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
        Alert.alert(
          "Permessi mancanti",
          "Per registrare video è necessario concedere i permessi per fotocamera, microfono e accesso alla galleria.",
          [{ text: "OK", onPress: onClose }]
        );
      }
    })();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording) {
      setCountdown(20);
      
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            stopRecording();
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const recordVideo = async (options: any) => {
    // Questa è una funzione wrapper per lavorare con vari metodi di registrazione
    // a seconda della versione di expo-camera
    if (cameraRef.current) {
      try {
        // @ts-ignore - Ignoriamo l'errore di tipo qui
        return await cameraRef.current.record(options);
      } catch (error) {
        console.error('Errore nel metodo record:', error);
        throw error;
      }
    }
    throw new Error('Camera reference is null');
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        
        const options = {
          maxDuration: 20,
          videoQuality: '480p'
        };
        
        // Utilizziamo la funzione wrapper
        const { uri } = await recordVideo(options);
        
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          try {
            const asset = await MediaLibrary.createAssetAsync(uri);
            
            try {
              await MediaLibrary.createAlbumAsync('MOCKED', asset, false);
              console.log('Video salvato nella galleria nell\'album MOCKED');
            } catch (albumError) {
              console.log('Album non creato, ma video salvato nella galleria', albumError);
            }
            
            Alert.alert('Successo', 'Video salvato nella galleria');
            setVideoUri(uri);
          } catch (error) {
            console.error('Errore nel salvare il video nella galleria:', error);
            
            try {
              const filename = uri.split('/').pop() || 'video.mp4';
              const timestamp = new Date().getTime();
              const newFilename = `mocked_video_${timestamp}.mp4`;
              
              const destinationUri = `${FileSystem.documentDirectory}../DCIM/Camera/${newFilename}`;
              
              try {
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}../DCIM/Camera`, { 
                  intermediates: true 
                });
              } catch (dirError) {
                console.log('Errore nella creazione della directory DCIM:', dirError);
              }
              
              await FileSystem.copyAsync({
                from: uri,
                to: destinationUri
              });
              
              console.log('Video salvato con metodo alternativo in:', destinationUri);
              Alert.alert(
                'Video salvato con successo',
                'Video registrato e salvato con metodo alternativo. Potrebbe non apparire subito nella galleria.'
              );
              setVideoUri(destinationUri);
            } catch (fallbackError) {
              console.error('Anche il metodo alternativo è fallito:', fallbackError);
              Alert.alert(
                'Attenzione', 
                'Video registrato ma non salvato nella galleria. Sarà disponibile solo nell\'app.'
              );
              setVideoUri(uri);
            }
          }
        } else {
          Alert.alert("Errore", "File video non trovato dopo la registrazione.");
        }
      } catch (error) {
        console.error("Errore nella registrazione:", error);
        Alert.alert("Errore", "Si è verificato un errore durante la registrazione.");
      } finally {
        setIsRecording(false);
        onClose();
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        console.error("Errore nell'interruzione della registrazione:", error);
      }
    }
  };

  const toggleCameraType = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Caricamento fotocamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Accesso alla fotocamera negato.</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Chiudi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={isFrontCamera ? 'front' : 'back'}
        ratio="16:9"
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {isRecording && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}s</Text>
              <View style={styles.recordingIndicator} />
            </View>
          )}

          <View style={styles.controls}>
            <View style={styles.controlPlaceholder} />
            
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name="radio-button-on"
                size={isRecording ? 20 : 40}
                color={isRecording ? colors.error : "white"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraType}
              disabled={isRecording}
            >
              <Ionicons
                name="camera-reverse"
                size={24}
                color={isRecording ? "gray" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40, // Per evitare la status bar
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlPlaceholder: {
    width: 44,
    height: 44,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: colors.error,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countdownText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  recordingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
  },
});

export default CameraRecorder;
