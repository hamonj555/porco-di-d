import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';
import { effects } from '@/mocks/effects';

type EffectsGridProps = {
  isFXModeActive?: boolean;
  effectsFilterMode?: string;
};

const EffectsGrid = ({ isFXModeActive = false }: { isFXModeActive?: boolean }) => {
  const { toggleEffect, activeEffects, mode, effectsFilterMode } = usePlayerStore();
  
  // Determina quale categoria di effetti mostrare
  const currentFilterMode = isFXModeActive ? effectsFilterMode : mode;
  
  // Filtra gli effetti in base alla categoria
  const getFilteredEffects = () => {
    const filterMode = currentFilterMode.toUpperCase();
    
    // Filtra gli effetti in base al tipo
    return effects.filter(effect => {
      if (filterMode === 'AUDIO') return effect.category === 'audio';
      if (filterMode === 'VIDEO') return effect.category === 'video';
      if (filterMode === 'MEME' || filterMode === 'IMAGE') return effect.category === 'meme';
      if (filterMode === 'AI') return effect.category === 'ai';
      return true; // Mostra tutti se non specificato
    });
  };

  const getIconForEffect = (iconName: string, color: string) => {
    const size = 14;

    const iconsMap: Record<string, string> = {
      Zap: 'flash',
      Sparkles: 'sparkles-outline',
      Clapperboard: 'videocam-outline',
      Sun: 'sunny-outline',
      ZoomIn: 'expand-outline',
      Sparkle: 'sparkles-outline',
      Flame: 'flame-outline',
      Stars: 'star-outline',
      Waves: 'water-outline',
      Eye: 'eye-outline',
      ScanLine: 'scan-outline',
    };

    const iconNameMapped = iconsMap[iconName] || 'sparkles-outline';

    return <Ionicons name={iconNameMapped as any} size={size} color={color} />;
  };

  const displayEffects = getFilteredEffects().slice(0, 15);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {displayEffects.map((effect) => {
          const isActive = activeEffects.includes(effect.id);
          return (
            <TouchableOpacity
              key={effect.id}
              style={[
                styles.effectItem,
                isActive && { borderColor: effect.color || colors.primary }
              ]}
              onPress={() => toggleEffect(effect.id)}
              activeOpacity={0.7}
            >
              {getIconForEffect(effect.icon || 'Sparkles', effect.color || colors.primary)}
              {!isActive && (
                <Text style={styles.effectNameInactive}>{effect.name}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 6,
  },
  effectItem: {
    width: '18%',
    aspectRatio: 0.9,
    backgroundColor: '#222222',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    margin: 2,
  },
  effectName: {
    fontSize: 8,
    color: colors.text,
    marginTop: 2,
    textAlign: 'center',
  },
  effectNameInactive: {
    fontSize: 8,
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default EffectsGrid;
