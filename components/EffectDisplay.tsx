import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';

// Colori per modalità MOCKED
const MODE_COLORS = {
  AUDIO: '#34D399',   // Verde brillante
  VIDEO: '#3B82F6',   // Blu intenso  
  MEME: '#FACC15',    // Giallo satira
  AI: '#A78BFA',      // Viola AI
};

// Icone per modalità
const MODE_ICONS = {
  AUDIO: 'mic-outline' as keyof typeof Ionicons.glyphMap,
  VIDEO: 'videocam-outline' as keyof typeof Ionicons.glyphMap,
  MEME: 'happy-outline' as keyof typeof Ionicons.glyphMap,
  AI: 'hardware-chip-outline' as keyof typeof Ionicons.glyphMap,
};

interface EffectDisplayProps {
  selectedEffects?: Array<{ name: string; color: string }>;
}

const EffectDisplay = ({ selectedEffects = [] }: EffectDisplayProps) => {
  const { activeEffects, getActiveEffectsNames, removeEffect, mode } = usePlayerStore();
  
  const effectNames = getActiveEffectsNames();
  
  // Funzione per determinare il tipo di effetto e il colore
  const getEffectType = (effectName: string) => {
    // Per ora assegniamo in base alla modalità corrente
    // In futuro si può migliorare con logica più sofisticata
    const currentMode = mode.toUpperCase();
    if (currentMode === 'AUDIO') return 'AUDIO';
    if (currentMode === 'VIDEO') return 'VIDEO';
    if (currentMode === 'MEME' || currentMode === 'IMAGE') return 'MEME';
    if (currentMode === 'AI') return 'AI';
    return 'AUDIO'; // default
  };
  
  // Renderizza un singolo chip effetto
  const renderEffectChip = (effectName: string, index: number) => {
    const effectType = getEffectType(effectName);
    const color = MODE_COLORS[effectType as keyof typeof MODE_COLORS];
    const icon = MODE_ICONS[effectType as keyof typeof MODE_ICONS];
    
    return (
      <View key={index} style={[styles.effectChip, { borderColor: color }]}>
        <Ionicons name={icon} size={12} color={color} />
        <Text style={[styles.effectChipText, { color }]}>{effectName}</Text>
        <TouchableOpacity 
          style={[styles.removeButton, { backgroundColor: color }]}
          onPress={() => removeEffect(effectName)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.effectsContainer}>
        {selectedEffects.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.effectsScrollContainer}
          >
            {selectedEffects.map((effect, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.effectChip, { borderColor: effect.color }]}
                onPress={() => {
                  const { toggleEffect } = usePlayerStore.getState();
                  toggleEffect(effect.name);
                }}
              >
                <Text style={[styles.effectChipText, { color: 'white' }]}>{effect.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noEffectsText}>Nessun effetto applicato</Text>
        )}
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
    width: '100%',
    marginTop: 15,
  },
  effectsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  effectsScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  effectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
  },
  effectChipText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
  removeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  noEffectsText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  addButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EffectDisplay;
