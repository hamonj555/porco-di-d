import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AudioLibrary from '@/components/AudioLibrary';

export default function AudioLibraryScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Libreria Audio',
        headerStyle: {
          backgroundColor: '#1a1a1a'
        },
        headerTintColor: '#fff'
      }} />
      <AudioLibrary />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a'
  }
});