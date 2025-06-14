import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

const audioEffects = [
  { name: 'Voice Cloning', emoji: '🎭' },
  { name: 'Cartoon Voice', emoji: '🤖' },
  { name: 'Gender Swap', emoji: '⚡' },
  { name: 'Age Changer', emoji: '👶' },
  { name: 'Vocal Isolation', emoji: '🎤' },
  { name: 'Autotune', emoji: '🎵' }
];

const videoEffects = [
  { name: 'Face Swap', emoji: '🔄' },
  { name: 'Beauty Filter', emoji: '✨' },
  { name: 'Caption Meme', emoji: '💬' },
  { name: 'Lip Sync', emoji: '👄' },
  { name: 'Face Reenact', emoji: '🎪' },
  { name: 'Style Transfer', emoji: '🎨' },
  { name: 'BG Remove', emoji: '🖼️' },
  { name: 'Sky Replace', emoji: '🌤️' }
];

interface AIButtonProps {
  onClose?: () => void;
  visible?: boolean;
}

const AIButton: React.FC<AIButtonProps> = ({ onClose, visible }) => {
  const [showAIZone, setShowAIZone] = useState(false);

  const handlePress = () => {
    setShowAIZone(true);
  };

  const handleClose = () => {
    setShowAIZone(false);
    onClose?.();
  };

  const handleEffectPress = (effect: { name: string; emoji: string }) => {
    console.log('Effect selected:', effect.name);
    // TODO: Implementare logica effetto
  };

  const renderEffectButton = (effect: { name: string; emoji: string }) => (
    <TouchableOpacity
      key={effect.name}
      style={styles.effectButton}
      onPress={() => handleEffectPress(effect)}
    >
      <Text style={styles.effectEmoji}>{effect.emoji}</Text>
      <Text style={styles.effectText}>{effect.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="sparkles-outline" size={28} color={colors.iconActive} />
      </TouchableOpacity>

      <Modal
        visible={visible || showAIZone}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>AI ZONE</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.columnsContainer}>
            <View style={styles.column}>
              <Text style={styles.columnTitle}>🎵 AUDIO</Text>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {audioEffects.map(renderEffectButton)}
              </ScrollView>
            </View>

            <View style={styles.column}>
              <Text style={styles.columnTitle}>📹 VIDEO</Text>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {videoEffects.map(renderEffectButton)}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 5,
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  effectButton: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  effectEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  effectText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});

export default AIButton;
