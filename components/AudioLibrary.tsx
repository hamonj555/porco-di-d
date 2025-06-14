import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '@/store/player-store';
import { listAppAudios } from '@/utils/listAppAudios';
import * as FileSystem from 'expo-file-system';

export default function AudioLibrary() {
  const [audios, setAudios] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const { setAudioUri } = usePlayerStore();
  
  // Carica gli audio dalla sandbox dell'app
  const loadAudios = async () => {
    setRefreshing(true);
    try {
      const audioFiles = await listAppAudios();
      setAudios(audioFiles);
    } catch (error) {
      console.error('Errore nel caricamento degli audio:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Carica gli audio all'avvio del componente
  useEffect(() => {
    loadAudios();
  }, []);
  
  // Carica un audio nel player principale
  const loadAudioInPlayer = (uri: string) => {
    setAudioUri(uri);
    Alert.alert('Audio caricato', 'L\'audio è stato caricato nel player');
  };
  
  // Anteprima di un audio
  const previewAudio = async (uri: string) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });
      await sound.playAsync();
      
      // Evidenzia l'audio selezionato
      setSelectedAudio(uri);
      
      // Imposta un listener per quando l'audio finisce
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setSelectedAudio(null);
        }
      });
    } catch (error) {
      console.error('Errore nella riproduzione dell\'audio:', error);
      Alert.alert('Errore', 'Impossibile riprodurre questo audio');
    }
  };
  
  // Elimina un audio
  const deleteAudio = async (uri: string) => {
    try {
      await FileSystem.deleteAsync(uri);
      // Aggiorna la lista dopo l'eliminazione
      loadAudios();
      Alert.alert('Audio eliminato', 'L\'audio è stato eliminato con successo');
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'audio:', error);
      Alert.alert('Errore', 'Impossibile eliminare questo audio');
    }
  };
  
  // Estrae il nome del file dall'URI
  const getFileName = (uri: string) => {
    const parts = uri.split('/');
    return parts[parts.length - 1];
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Importati</Text>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadAudios}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshText}>Aggiorna</Text>
      </TouchableOpacity>
      
      <FlatList 
        data={audios}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[
            styles.audioItem,
            selectedAudio === item && styles.selectedAudio
          ]}>
            <Text style={styles.audioName}>{getFileName(item)}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => previewAudio(item)}
              >
                <Ionicons name="play" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.button}
                onPress={() => loadAudioInPlayer(item)}
              >
                <Ionicons name="arrow-up-circle" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteAudio(item)}
              >
                <Ionicons name="trash" size={24} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nessun audio importato.
            </Text>
            <Text style={styles.importText}>
              Tocca l'icona AUDIO in alto per importare un file audio.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  refreshText: {
    color: '#fff',
    marginLeft: 8,
  },
  audioItem: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedAudio: {
    backgroundColor: '#444',
    borderColor: '#7C4DFF',
    borderWidth: 1,
  },
  audioName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 8,
  },
  importText: {
    color: '#7C4DFF',
    fontSize: 14,
  }
});