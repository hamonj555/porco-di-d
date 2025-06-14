import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePlayerStore } from '@/store/player-store';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from '@/types/VideoPlayer';
import MemeImageViewer from './MemeImageViewer';
import CameraRecorder from './CameraRecorder';

const PlayerContainer: React.FC = () => {
  const { mode, isCameraVisible, setCameraVisible } = usePlayerStore();

  // Chiudi la fotocamera
  const handleCloseCamera = () => {
    setCameraVisible(false);
  };

  // Se la fotocamera è visibile, mostra il componente CameraRecorder
  if (isCameraVisible) {
    return <CameraRecorder onClose={handleCloseCamera} />;
  }

  // Altrimenti, mostra il player appropriato in base alla modalità
  return (
    <View style={styles.container}>
      {mode === 'AUDIO' && <AudioPlayer />}
      {mode === 'VIDEO' && <VideoPlayer />}
      {mode === 'MEME' && <MemeImageViewer />}
      {/* La modalità AI sarà gestita in futuro */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },
});

export default PlayerContainer;