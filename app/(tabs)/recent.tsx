import React from 'react';
import { View, StyleSheet } from 'react-native';
import RecentScreen from '@/components/RecentScreen';
import { StatusBar } from 'expo-status-bar';

export default function RecentPage() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RecentScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});