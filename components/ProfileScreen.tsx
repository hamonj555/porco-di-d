import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  Switch,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavoritesStore, FavoriteItem, FavoriteItemType } from '@/store/favorites-store';
import { useSavedContentsStore } from '@/store/saved-contents-store';
import { useUserStore } from '@/store/user-store';
import { usePlayerStore } from '@/store/player-store';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

// Colori per modalità MOCKED - stessi del player
const MODE_COLORS = {
  AUDIO: '#34D399',   // Verde brillante
  VIDEO: '#3B82F6',   // Blu intenso  
  MEME: '#FACC15',    // Giallo satira
  AI: '#A78BFA',      // Viola AI
} as const;

const ACCENT_COLOR = '#F97316'; // Arancione moderno per altri elementi

type TabType = 'ALL' | 'AUDIO' | 'VIDEO' | 'MEME' | 'AI';
type SectionType = 'FAVORITES' | 'CREATIONS' | 'SETTINGS';

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [activeSection, setActiveSection] = useState<SectionType>('FAVORITES');
  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [isPickingAvatar, setIsPickingAvatar] = useState<boolean>(false);
  
  const router = useRouter();
  const favorites = useFavoritesStore();
  const savedContents = useSavedContentsStore();
  const userStore = useUserStore();
  const { settings, setNickname, setAvatar, setTheme, toggleNotifications, toggleSoundEffects, resetSettings } = userStore;



  const saveNickname = (newName: string) => {
    userStore.setNickname(newName);
    setIsEditingNickname(false);
  };

  const pickAvatar = async () => {
    setIsPickingAvatar(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permesso Negato', 'Concedi il permesso per selezionare un avatar.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        userStore.setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Errore', 'Selezione avatar non riuscita.');
    } finally {
      setIsPickingAvatar(false);
    }
  };

  const resetUserData = () => {
    Alert.alert('Reset Dati', 'Vuoi davvero cancellare i dati utente?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Reset', onPress: () => { resetSettings(); Alert.alert('Fatto', 'Dati utente cancellati'); }, style: 'destructive' },
    ]);
  };

  // Funzioni per le tre iconcine
  const shareContent = async (item: any) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(item.path, {
          mimeType: item.type === 'AUDIO' ? 'audio/mp3' : item.type === 'VIDEO' ? 'video/mp4' : 'image/png',
          dialogTitle: `Condividi ${item.name}`
        });
      } else {
        Alert.alert('Errore', 'Condivisione non disponibile su questo dispositivo');
      }
    } catch (error) {
      Alert.alert('Errore', 'Impossibile condividere il contenuto');
    }
  };

  const editContent = (item: any) => {
    // Carica il contenuto nel player per modifiche
    Alert.alert('Modifica', `Apertura di ${item.name} nel player`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Apri', onPress: () => router.push('/') },
    ]);
  };

  const deleteContent = (item: any) => {
    Alert.alert('Elimina', `Vuoi eliminare ${item.name}?`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: () => {
        savedContents.removeContent(item.id);
        Alert.alert('Fatto', 'Contenuto eliminato');
      }}
    ]);
  };

  // Funzione per riaprire contenuto nel player
  const loadContentInPlayer = (item: any) => {
    const playerStore = usePlayerStore.getState();
    
    if (item.type === 'AUDIO') {
      playerStore.setAudioUri(item.path);
      playerStore.setMode('AUDIO');
    } else if (item.type === 'VIDEO') {
      playerStore.setVideoUri(item.path);
      playerStore.setMode('VIDEO');
    } else if (item.type === 'MEME') {
      playerStore.setMemeImageUri(item.path);
      playerStore.setMode('MEME');
    }
    
    // Naviga alla home
    router.push('/');
  };

  const getFilteredItems = (): FavoriteItem[] =>
    activeTab === 'ALL' ? favorites.items : favorites.getFavoritesByType(activeTab);

  const getFilteredContents = () =>
    activeTab === 'ALL' ? savedContents.contents : savedContents.getContentsByType(activeTab);

  const renderTypeIcon = (type: FavoriteItemType) => {
    const iconColor = MODE_COLORS[type as keyof typeof MODE_COLORS] || MODE_COLORS.AUDIO;
    switch (type) {
      case 'AUDIO':
        return <Ionicons name="musical-notes-outline" size={16} color={iconColor} />;
      case 'VIDEO':
        return <Ionicons name="videocam-outline" size={16} color={iconColor} />;
      case 'MEME':
        return <Ionicons name="image-outline" size={16} color={iconColor} />;
      case 'AI':
        return <Ionicons name="hardware-chip-outline" size={16} color={iconColor} />;
      default:
        return <Ionicons name="sparkles-outline" size={16} color={MODE_COLORS.AUDIO} />;
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity style={styles.favoriteCard}>
      <View style={styles.favoriteHeader}>
        <View style={styles.favoriteTypeIcon}>{renderTypeIcon(item.type)}</View>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => favorites.removeFavorite(item.id)}>
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderText}>{item.type}</Text>
          </View>
        )}
      </View>
      {item.effectsApplied && item.effectsApplied.length > 0 && (
        <View style={styles.effectsContainer}>
          <Text style={styles.effectsTitle}>Effetti: </Text>
          <Text style={styles.effectsList}>{item.effectsApplied.join(', ')}</Text>
        </View>
      )}
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  const renderSavedContent = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => loadContentInPlayer(item)}
      activeOpacity={0.7}
    >
      <View style={styles.favoriteHeader}>
        <View style={styles.favoriteTypeIcon}>{renderTypeIcon(item.type)}</View>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: ACCENT_COLOR }]}
          onPress={(e) => { e.stopPropagation(); shareContent(item); }}
        >
        <Ionicons name="share-social-outline" size={14} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: ACCENT_COLOR }]}
          onPress={(e) => { e.stopPropagation(); editContent(item); }}
        >
        <Ionicons name="create-outline" size={14} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={(e) => { e.stopPropagation(); deleteContent(item); }}
        >
        <Ionicons name="trash-outline" size={14} color="white" />
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.thumbnailContainer}>
        {item.path ? (
          <Image source={{ uri: item.path }} style={styles.thumbnail} resizeMode="contain" />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderText}>{item.type}</Text>
          </View>
        )}
      </View>
      {item.effects?.length > 0 && (
        <View style={styles.effectsContainer}>
          <Text style={styles.effectsTitle}>Effetti: </Text>
          <Text style={styles.effectsList}>{item.effects.join(', ')}</Text>
        </View>
      )}
      <Text style={styles.dateText}>{new Date(item.dateCreated).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with MOCKED logo and profile icon */}
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
        <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar} disabled={isPickingAvatar}>
          {isPickingAvatar ? (
            <View style={styles.avatar}><ActivityIndicator color="white" /></View>
          ) : settings.avatar ? (
            <Image source={{ uri: settings.avatar }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{settings.nickname.charAt(0).toUpperCase()}</Text>
              <Ionicons name="camera-outline" size={16} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {isEditingNickname ? (
          <View style={styles.nicknameEditContainer}>
            <TextInput
              style={styles.nicknameInput}
              value={settings.nickname}
              onChangeText={(text) => userStore.setNickname(text)}
              autoFocus
              onBlur={() => setIsEditingNickname(false)}
              onSubmitEditing={() => saveNickname(settings.nickname)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => saveNickname(settings.nickname)}>
              <Text style={styles.saveButtonText}>Salva</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{settings.nickname}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingNickname(true)}>
              <Ionicons name="create-outline" size={16} color={ACCENT_COLOR} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.sectionsSelector}>
        {(['FAVORITES', 'CREATIONS', 'SETTINGS'] as SectionType[]).map(section => (
          <TouchableOpacity
            key={section}
            style={[styles.sectionTab, activeSection === section && styles.activeSectionTab]}
            onPress={() => setActiveSection(section)}
          >
            <Text style={[styles.sectionTabText, activeSection === section && styles.activeSectionTabText]}>
              {section === 'FAVORITES' ? 'EFFETTI PREFERITI' : section === 'CREATIONS' ? 'CREAZIONI' : 'IMPOSTAZIONI'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeSection !== 'SETTINGS' && (
        <View style={styles.contentContainer}>
          <View style={styles.tabsContainer}>
            {(['ALL', 'AUDIO', 'VIDEO', 'MEME', 'AI'] as TabType[]).map(tab => {
              const isActive = activeTab === tab;
              const tabColor = tab === 'ALL' ? ACCENT_COLOR : MODE_COLORS[tab as keyof typeof MODE_COLORS] || ACCENT_COLOR;
              
              return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, isActive && { backgroundColor: tabColor }]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[
                  styles.tabText, 
                  isActive ? { color: 'white' } : { color: tabColor }
                ]}>
                  {tab === 'ALL' ? 'TUTTI' : tab}
                </Text>
              </TouchableOpacity>
              );
            })}
          </View>

          {activeSection === 'FAVORITES' ? (
            getFilteredItems().length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nessun contenuto preferito</Text>
              </View>
            ) : (
              <FlatList
                data={getFilteredItems()}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.favoritesList}
              />
            )
          ) : (
            getFilteredContents().length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nessun contenuto creato</Text>
              </View>
            ) : (
              <FlatList
                data={getFilteredContents()}
                renderItem={renderSavedContent}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.favoritesList}
              />
            )
          )}
        </View>
      )}

      {activeSection === 'SETTINGS' && (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>IMPOSTAZIONI</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Tema Scuro</Text>
              <Switch
                value={settings.theme === 'DARK'}
                onValueChange={(value) => setTheme(value ? 'DARK' : 'LIGHT')}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notifiche</Text>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={toggleNotifications}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Effetti Sonori</Text>
              <Switch
                value={settings.soundEffectsEnabled}
                onValueChange={toggleSoundEffects}
              />
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={resetUserData}>
              <Text style={styles.resetButtonText}>Reset Dati Utente</Text>
            </TouchableOpacity>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Versione App: 1.0.0</Text>
              <Text style={styles.copyrightText}>© 2025 MOCKED App</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
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
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#202020',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editButton: {
    padding: 5,
  },
  nicknameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nicknameInput: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: ACCENT_COLOR,
    padding: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionsSelector: {
    flexDirection: 'row',
    backgroundColor: '#202020',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  sectionTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sectionTabText: {
    color: '#888888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeSectionTab: {
    borderBottomColor: ACCENT_COLOR,
  },
  activeSectionTabText: {
    color: ACCENT_COLOR,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 15,
    padding: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  tabText: {
    color: '#888888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#BBBBBB',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  favoritesList: {
    paddingBottom: 20,
  },
  favoriteCard: {
    backgroundColor: '#222222',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  favoriteTypeIcon: {
    marginRight: 8,
  },
  favoriteName: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    height: 120,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666666',
    fontWeight: 'bold',
  },
  effectsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  effectsTitle: {
    color: '#888888',
    fontSize: 14,
  },
  effectsList: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  dateText: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 16,
  },
  settingsContainer: {
    backgroundColor: '#222222',
    borderRadius: 10,
    padding: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  versionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  versionText: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 5,
  },
  copyrightText: {
    color: '#666666',
    fontSize: 12,
  },
});

export default ProfileScreen;
