import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useSavedContentsStore, SavedContent } from '@/store/saved-contents-store';
import { saveMediaToGallery } from '@/utils/saveMediaToGallery';
import { effects } from '@/mocks/effects';

interface MediaSaveButtonProps {
  size?: number;
  color?: string;
  style?: any;
}

const MediaSaveButton: React.FC<MediaSaveButtonProps> = ({ 
  size = 24, 
  color = colors.primary,
  style
}) => {
  const { videoUri, audioUri, memeImageUri, mode, activeEffects } = usePlayerStore();
  const { addContent } = useSavedContentsStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const currentMediaUri = mode === 'VIDEO' 
    ? videoUri 
    : mode === 'AUDIO' 
      ? audioUri 
      : memeImageUri;
  
  const handleSave = async () => {
    console.log('🔄 Inizio salvataggio:', { currentMediaUri, mode, activeEffects });
    
    if (!currentMediaUri) {
      Alert.alert('Nessun media', 'Non c\'è nessun media da salvare');
      return;
    }
    
    try {
      setIsSaving(true);
      const fileInfo = await FileSystem.getInfoAsync(currentMediaUri);
      console.log('📁 Info file:', fileInfo);
      
      if (!fileInfo.exists) {
        throw new Error('File non trovato');
      }
      
      // Salva nella galleria
      console.log('💾 Salvataggio in galleria...');
      await saveMediaToGallery(currentMediaUri);
      
      // Converti gli ID degli effetti in nomi
      const effectNames = activeEffects.map(id => {
        const effect = effects.find(e => e.id === id);
        return effect ? effect.name : id;
      });
      
      // Aggiungi al store dei contenuti salvati
      const newContent: SavedContent = {
        id: Date.now().toString(),
        name: `${mode} ${new Date().toLocaleDateString()}`,
        type: mode as any,
        path: currentMediaUri,
        effects: effectNames.length > 0 ? effectNames : ['Nessun effetto'],
        dateCreated: Date.now(),
        size: fileInfo.size
      };
      
      console.log('📝 Aggiunta al profilo:', newContent);
      addContent(newContent);
      Alert.alert('Salvato!', 'Contenuto salvato in galleria e profilo');
      
    } catch (error) {
      console.error('❌ Errore durante il salvataggio:', error);
      Alert.alert('Errore', 'Non è stato possibile salvare il media');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isSaving) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color={color} />
      </View>
    );
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handleSave}
      disabled={!currentMediaUri}
    >
      <Ionicons 
        name="download-outline" 
        size={size} 
        color={currentMediaUri ? color : colors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaSaveButton;
