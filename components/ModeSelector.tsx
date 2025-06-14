import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ sostituisce lucide-react-native
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';
import { MediaMode } from '@/types/player';

// Colori per modalità MOCKED - stessi di EffectDisplay
const MODE_COLORS = {
  AUDIO: '#34D399',   // Verde brillante
  VIDEO: '#3B82F6',   // Blu intenso  
  MEME: '#FACC15',    // Giallo satira
  AI: '#A78BFA',      // Viola AI
};

const ModeSelector = ({ isFXModeActive = false }) => {
  const { mode, setMode, effectsFilterMode, setEffectsFilterMode, memeImageUri, videoUri, audioUri, isPlayerLocked } = usePlayerStore();
  
  // Rimuovo logica EDIT non più necessaria

  const modes: { type: MediaMode; label: string; iconName: keyof typeof Ionicons.glyphMap }[] = [
    { type: 'AUDIO', label: 'AUDIO', iconName: 'mic-outline' },
    { type: 'VIDEO', label: 'VIDEO', iconName: 'videocam-outline' },
    { type: 'MEME', label: 'MEME', iconName: 'image-outline' },
    { type: 'AI', label: 'AI ZONE', iconName: 'hardware-chip-outline' },
  ];

  const handleModeChange = async (newMode: MediaMode) => {
    // TOGGLE LOGIC per icone:
    // Se player è pieno e clicco su modalità già accesa → torna a modalità principale
    if (isPlayerLocked && mode === newMode) {
      // Trova la modalità principale del player (primo media caricato)
      if (memeImageUri) {
        setMode('MEME');
        setEffectsFilterMode('MEME');
      } else if (videoUri) {
        setMode('VIDEO');
        setEffectsFilterMode('VIDEO');
      } else if (audioUri) {
        setMode('AUDIO');
        setEffectsFilterMode('AUDIO');
      }
      return;
    }
    
    // Altrimenti cambia modalità normalmente
    setMode(newMode);
    setEffectsFilterMode(newMode);
  };

  return (
    <View style={styles.container}>
      {modes.map((item) => {
        // LOGICA ICONE:
        // Player VUOTO = solo modalità corrente attiva
        // Player PIENO = icone accese per tutti i media caricati
        let isActive = false;
        
        if (isPlayerLocked) {
          // Player pieno: icone accese per media caricati + modalità corrente
          if (item.type === 'MEME' && memeImageUri) isActive = true;
          if (item.type === 'VIDEO' && videoUri) isActive = true;
          if (item.type === 'AUDIO' && audioUri) isActive = true;
          if (item.type === mode) isActive = true; // Modalità corrente sempre accesa
        } else {
          // Player vuoto: solo modalità corrente
          isActive = mode === item.type;
        }
        
        const modeColor = MODE_COLORS[item.type as keyof typeof MODE_COLORS];
        
        return (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.modeButton,
              isActive && { backgroundColor: modeColor },
            ]}
            onPress={() => handleModeChange(item.type)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.iconName}
              size={16}
              color={isActive ? 'white' : modeColor}
            />
            <Text
              style={[
                styles.modeText,
                { color: isActive ? 'white' : modeColor },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: Platform.OS === 'android' ? 5 : 10,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 30,
    gap: 6,
    minWidth: 80,
    marginHorizontal: 2,
    height: 36,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ModeSelector;
