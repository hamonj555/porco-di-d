import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VIDEO_EFFECTS, VideoEffectId, VideoEffect } from '@/constants/videoEffects';
import { VIDEO_CATEGORIES, VideoCategoryId } from '@/constants/videoCategories';
import { colors } from '@/constants/colors';

interface EffectsForCategoryProps {
  selectedCategory: VideoCategoryId;
  onEffectPress: (effectId: string) => void;
  activeEffects: string[];
}

const EffectsForCategory: React.FC<EffectsForCategoryProps> = ({
  selectedCategory,
  onEffectPress,
  activeEffects = [],
}) => {
  const effects = VIDEO_EFFECTS[selectedCategory as keyof typeof VIDEO_EFFECTS];
  const categoryData = VIDEO_CATEGORIES.find(cat => cat.id === selectedCategory);
  
  if (!effects || !categoryData) return null;

  // Calcola dimensioni adattive
  const effectCount = effects.length;
  const isLargeCategory = effectCount <= 3;
  const effectHeight = isLargeCategory ? 50 : 40;
  
  return (
    <View style={styles.container}>
      {effects.map((effect: VideoEffect, index: number) => {
        const isActive = activeEffects.includes(effect.id);
        
        return (
          <TouchableOpacity
            key={effect.id}
            style={[
              styles.effectButton,
              { height: effectHeight },
              isActive && {
                backgroundColor: categoryData.color,
                borderColor: categoryData.color,
              }
            ]}
            onPress={() => onEffectPress(effect.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.effectIcon}>{effect.icon}</Text>
            <Text
              style={[
                styles.effectName,
                isActive && { color: '#FFFFFF', fontWeight: '600' }
              ]}
              numberOfLines={1}
            >
              {effect.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 145, // Più largo per icone più grandi
    alignItems: 'center',
    paddingTop: 8,
  },
  effectButton: {
    width: 115,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  effectIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  effectName: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default EffectsForCategory;
