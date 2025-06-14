import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FACE_EFFECTS, FaceEffectId } from '@/constants/faceEffects';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface FaceEffectsGridProps {
  onEffectPress: (effectId: FaceEffectId) => void;
  activeEffects: string[];
}

const FaceEffectsGrid: React.FC<FaceEffectsGridProps> = ({
  onEffectPress,
  activeEffects = [],
}) => {
  // Dividi gli effetti in gruppi di 8 (2 righe da 4)
  const effectsPages = [];
  for (let i = 0; i < FACE_EFFECTS.length; i += 8) {
    effectsPages.push(FACE_EFFECTS.slice(i, i + 8));
  }

  const renderEffectPage = (effects: typeof FACE_EFFECTS[number][], pageIndex: number) => {
    // Dividi in 2 righe da 4
    const topRow = effects.slice(0, 4);
    const bottomRow = effects.slice(4, 8);

    return (
      <View key={pageIndex} style={styles.page}>
        {/* Prima riga */}
        <View style={styles.row}>
          {topRow.map((effect) => {
            const isActive = activeEffects.includes(effect.id);
            return (
              <TouchableOpacity
                key={effect.id}
                style={[
                  styles.effectButton,
                  isActive && styles.activeEffect
                ]}
                onPress={() => onEffectPress(effect.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.effectIcon}>{effect.icon}</Text>
                <Text style={[
                  styles.effectName,
                  isActive && styles.activeText
                ]} numberOfLines={2}>
                  {effect.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Seconda riga */}
        <View style={styles.row}>
          {bottomRow.map((effect) => {
            const isActive = activeEffects.includes(effect.id);
            return (
              <TouchableOpacity
                key={effect.id}
                style={[
                  styles.effectButton,
                  isActive && styles.activeEffect
                ]}
                onPress={() => onEffectPress(effect.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.effectIcon}>{effect.icon}</Text>
                <Text style={[
                  styles.effectName,
                  isActive && styles.activeText
                ]} numberOfLines={2}>
                  {effect.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
      >
        {effectsPages.map((effects, pageIndex) => 
          renderEffectPage(effects, pageIndex)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  page: {
    width: width - 40,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  effectButton: {
    width: (width - 100) / 4,
    height: 80,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeEffect: {
    backgroundColor: '#7C4DFF',
    borderColor: '#FFFFFF',
  },
  effectIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  effectName: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FaceEffectsGrid;
