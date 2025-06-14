import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; // ✅ sostituito lucide-react-native
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { MediaSaveService } from '@/utils/mediaServices';

interface CameraRecorderProps {
  onClose: () => void;
}

const CameraRecorder: React.FC<CameraRecorderProps> = ({ onClose }) => {
  const { setVideoUri, mode } = usePlayerStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
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
    if (cameraRef.current && !isRecording && !recordedUri) {
      try {
        setIsRecording(true);
        
        const options = {
          maxDuration: 20,
          videoQuality: '480p'
        };
        
        // Utilizziamo la funzione wrapper
        const { uri } = await recordVideo(options);
        
        setIsRecording(false);
        setRecordedUri(uri);
      } catch (error) {
        console.error("Errore nella registrazione:", error);
        Alert.alert("Errore", "Si è verificato un errore durante la registrazione.");
        setIsRecording(false);
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

  const saveVideo = async () => {
    if (!recordedUri) return;
    
    setIsSaving(true);
    
    try {
      const result = await MediaSaveService.saveMediaToGallery(recordedUri, 'video');
      
      if (result.success) {
        Alert.alert('Successo', result.message);
        setVideoUri(result.uri);
        onClose();
      } else {
        Alert.alert('Attenzione', result.message);
        setVideoUri(recordedUri);
        onClose();
      }
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      Alert.alert("Errore", "Si è verificato un errore durante il salvataggio del video.");
      setVideoUri(recordedUri);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const discardVideo = () => {
    if (recordedUri) {
      FileSystem.deleteAsync(recordedUri, { idempotent: true }).catch(err => 
        console.error("Errore nell'eliminazione del file temporaneo:", err)
      );
      setRecordedUri(null);
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

  if (recordedUri) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Video registrato</Text>
          
          {isSaving ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.savingText}>Salvataggio in corso...</Text>
            </View>
          ) : (
            <View style={styles.previewControls}>
              <TouchableOpacity 
                style={[styles.previewButton, styles.discardButton]}
                onPress={discardVideo}
              >
                <Ionicons name="close" size={24} color="white" />
                <Text style={styles.previewButtonText}>Scarta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.previewButton, styles.saveButton]}
                onPress={saveVideo}
              >
                <Ionicons name="share-social" size={24} color="white" />
                <Text style={styles.previewButtonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    marginTop: 40, 
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
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  previewButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: 120,
  },
  discardButton: {
    backgroundColor: 'rgba(180, 0, 0, 0.7)',
  },
  saveButton: {
    backgroundColor: 'rgba(0, 150, 0, 0.7)',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  savingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  savingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
  },
});

export default CameraRecorder;
