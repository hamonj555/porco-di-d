import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ProgressBar = () => {
  const { currentTime, duration, isPlaying, isRecording, recordingTime, setCurrentTime } = usePlayerStore();
  const [progress, setProgress] = useState(0);

  // Durante la registrazione usa recordingTime, altrimenti currentTime/duration normale
  const displayTime = isRecording ? recordingTime : currentTime;
  const totalTime = isRecording ? 30 : duration; // 30 secondi max per registrazione

  // Nota: abbiamo rimosso il setInterval qui perché ora il tempo di riproduzione
  // viene aggiornato direttamente dai componenti Video e AudioPlayer
  // attraverso gli eventi onPlaybackStatusUpdate

  useEffect(() => {
    if (isRecording) {
      // Durante registrazione: progresso basato su recordingTime/30 secondi
      setProgress((recordingTime / 30) * 100);
    } else {
      // Durante riproduzione normale: progresso basato su currentTime/duration
      setProgress(totalTime > 0 ? (displayTime / totalTime) * 100 : 0);
    }
  }, [currentTime, duration, isRecording, recordingTime, displayTime, totalTime]);

  const handleProgressTouch = (event: any) => {
    // Disabilita il touch durante la registrazione
    if (isRecording) return;
    
    const { locationX, target } = event.nativeEvent;
    target.measure((_x: number, _y: number, width: number) => {
      const percentage = Math.max(0, Math.min(1, locationX / width));
      setCurrentTime(percentage * duration);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(displayTime)}</Text>
      <TouchableOpacity 
        style={styles.progressContainer}
        onPress={handleProgressTouch}
        activeOpacity={isRecording ? 1 : 0.8} // No feedback visivo durante registrazione
        disabled={isRecording}
      >
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` },
              isRecording && { backgroundColor: '#34D399' } // Verde durante registrazione
            ]} 
          />
          <View 
            style={[
              styles.progressHandle,
              { left: `${progress}%` },
              isRecording && { backgroundColor: '#34D399' } // Verde durante registrazione
            ]}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16, // Ridotto da 20
    marginBottom: 8, // Ridotto da 10
  },
  timeText: {
    color: colors.text,
    fontSize: 12, // Ridotto da 14
    fontWeight: '500',
    width: 36, // Ridotto da 40
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 6, // Ridotto da 8
    height: 18, // Ridotto da 20
    justifyContent: 'center',
  },
  progressBackground: {
    height: 3, // Ulteriormente ridotto per aspetto più sottile
    backgroundColor: '#333333',
    borderRadius: 1.5,
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  progressHandle: {
    position: 'absolute',
    width: 8, // Ulteriormente ridotto
    height: 8, // Ulteriormente ridotto
    borderRadius: 4,
    backgroundColor: colors.primary,
    top: -2.5,
    marginLeft: -4,
  },
});

export default ProgressBar;