import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  FlatList,
} from 'react-native';
import { 
  Ionicons 
} from '@expo/vector-icons'; // ✅ sostituisce lucide-react-native
import { usePlayerStore } from '@/store/player-store';
import { useRouter } from 'expo-router';

const RecentScreen: React.FC = () => {
  const { recentCreations } = usePlayerStore();
  const router = useRouter();
  
  // Renderizza l'icona del tipo in base al tipo del media
  const renderTypeIcon = (type: 'AUDIO' | 'VIDEO' | 'MEME' | 'IMAGE' | any) => {
    switch (type) {
      case 'AUDIO':
        return <Ionicons name="musical-note" size={16} color="#00BCD4" />;
      case 'VIDEO':
        return <Ionicons name="videocam" size={16} color="#FF5722" />;
      case 'MEME':
      case 'IMAGE':
        return <Ionicons name="image" size={16} color="#9C27B0" />;
      default:
        return <Ionicons name="document" size={16} color="#BBBBBB" />;
    }
  };
  
  // Interfaccia per l'elemento nella lista
  interface CreationItem {
    id: string;
    name: string;
    type: 'AUDIO' | 'VIDEO' | 'MEME' | 'IMAGE' | string;
    uri: string;
    timestamp: number;
    effects?: string[];
  }

  // Funzione per renderizzare un singolo elemento nella lista
  const renderCreationItem = ({ item }: { item: CreationItem | null }) => {
    if (!item) return null;
    
    // Gestisce il tap sulla card
    const handleCardPress = () => {
      // Carica il contenuto nel player principale in base al tipo
      if (item.type === 'AUDIO') {
        usePlayerStore.getState().setAudioUri(item.uri);
        usePlayerStore.getState().setMode('AUDIO');
      } else if (item.type === 'VIDEO') {
        usePlayerStore.getState().setVideoUri(item.uri);
        usePlayerStore.getState().setMode('VIDEO');
      } else if (item.type === 'MEME' || item.type === 'IMAGE') {
        usePlayerStore.getState().setMemeImageUri(item.uri);
        usePlayerStore.getState().setMode('MEME');
      }
      
      // Naviga alla home
      router.push('/');
    };
    
    return (
      <TouchableOpacity style={styles.itemCard} onPress={handleCardPress} activeOpacity={0.7}>
        <View style={styles.itemHeader}>
          <View style={styles.typeIconContainer}>
            {renderTypeIcon(item.type)}
          </View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDuration}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        
        <View style={styles.thumbnailContainer}>
          {item.uri ? (
            <Image 
              source={{ uri: item.uri }} 
              style={styles.thumbnail}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.placeholderText}>{item.type}</Text>
            </View>
          )}
        </View>
        
        {item.effects && item.effects.length > 0 && (
          <View style={styles.effectsContainer}>
            <Text style={styles.effectsLabel}>Effetti:</Text>
            <Text style={styles.effectsList}>
              {item.effects.join(', ')}
            </Text>
          </View>
        )}
        
        <View style={styles.itemFooter}>
          <Text style={styles.dateText}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with MOCKED logo and info icon */}
      <View style={styles.topHeader}>
        <View style={{ width: 32 }} />
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={{ height: 36, width: 115 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <Ionicons name="time" size={24} color="#FF5722" />
        <Text style={styles.headerTitle}>Creazioni Recenti</Text>
      </View>
      
      <FlatList
        data={recentCreations}
        renderItem={renderCreationItem}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <Ionicons name="information-circle-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>
              Nessuna creazione recente
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Le tue creazioni appariranno qui
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  mockedLogo: {
    color: '#FF4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    minHeight: '100%',
  },
  itemCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,  // Ombra per Android
    shadowColor: '#000',  // Ombra per iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIconContainer: {
    marginRight: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  itemDuration: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  thumbnailContainer: {
    marginVertical: 8,
    borderRadius: 4,
    overflow: 'hidden',
    height: 160,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  effectsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  effectsLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 4,
  },
  effectsList: {
    fontSize: 14,
    color: 'white',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  emptyState: {
    flex: 1,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
  }
});

export default RecentScreen;
