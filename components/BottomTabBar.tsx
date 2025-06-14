import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { usePlayerStore } from '@/store/player-store';
import { useRouter, usePathname } from 'expo-router';

// Colori per modalità MOCKED - stessi del ModeSelector
const MODE_COLORS = {
  AUDIO: '#34D399',   // Verde brillante
  VIDEO: '#3B82F6',   // Blu intenso  
  MEME: '#FACC15',    // Giallo satira
  AI: '#A78BFA',      // Viola AI
};

type TabItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

type BottomTabBarProps = {
  onToggleEffectsGrid?: () => void;
  showEffectsGrid?: boolean;
  isFXModeActive?: boolean;
  onToggleFXMode?: () => void;
};

const BottomTabBar = ({ onToggleEffectsGrid, showEffectsGrid, isFXModeActive, onToggleFXMode }: BottomTabBarProps) => {
  const [activeTab, setActiveTab] = React.useState('effects');
  const { loadMediaFromLibrary, mode, effectsFilterMode } = usePlayerStore();
  const router = useRouter();
  const pathname = usePathname();
  
  // Mappatura colori fissi per ogni tasto
  const TAB_COLORS = {
    effects: MODE_COLORS.AUDIO,   // Verde
    library: MODE_COLORS.VIDEO,   // Blu
    recent: MODE_COLORS.MEME,     // Giallo
    profile: MODE_COLORS.AI,      // Viola
  };
  
  React.useEffect(() => {
    // Update active tab based on the current route
    if (pathname === '/' || pathname === '/index') {
      setActiveTab('effects');
    } else if (pathname === '/profile') {
      setActiveTab('profile');
    } else if (pathname === '/recent') {
      setActiveTab('recent');
    }
  }, [pathname]);
  
  // Handle tab press
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    
    // Navigate to profile page
    if (tabKey === 'profile') {
      router.push('/profile');
      return;
    }
    
    // Navigate to recent page
    if (tabKey === 'recent') {
      // Questo tasto mostra l'ultima creazione
      router.push('/recent');
      return;
    }
    
    // If on the profile page and pressing any other tab, return to home
    if (pathname === '/profile' || pathname === '/recent') {
      router.push('/');
    }
    
    // Toggle MODIFICA quando viene premuto il tasto
    if (tabKey === 'effects') {
      // Toggle modalità modifica
      if (onToggleFXMode) {
        onToggleFXMode();
      }
      return;
    }
    
    // Carica media dalla libreria quando viene premuto il tasto libreria
    if (tabKey === 'library') {
      const currentMode = usePlayerStore.getState().mode;
      const effectsFilter = usePlayerStore.getState().effectsFilterMode;
      
      // In FX Mode usa effectsFilterMode, altrimenti mode normale
      const libraryMode = isFXModeActive ? effectsFilter : currentMode;
      
      // Carica media usando il parametro forcedMode
      loadMediaFromLibrary(libraryMode);
    }
  };

  const tabs: TabItem[] = [
    {
      key: 'effects',
      icon: <Ionicons name={isFXModeActive ? "lock-open" : "lock-closed"} size={16} color="white" />,
      label: 'EDIT',
    },
    {
      key: 'library',
      icon: <Ionicons name="book-outline" size={16} color="white" />,
      label: 'Libreria',
    },
    {
      key: 'recent',
      icon: <Ionicons name="time-outline" size={16} color="white" />,
      label: 'Recenti',
    },
    {
      key: 'profile',
      icon: <Ionicons name="person-outline" size={16} color="white" />,
      label: 'Profilo',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = (tab.key === 'effects' && isFXModeActive) || (activeTab === tab.key && tab.key !== 'effects');
        const tabColor = tab.key === 'effects' && isFXModeActive ? '#FF6B35' : TAB_COLORS[tab.key as keyof typeof TAB_COLORS];
        const backgroundColor = TAB_COLORS[tab.key as keyof typeof TAB_COLORS]; // Sempre colorato
        
        return (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton, 
            { backgroundColor }
          ]}
          onPress={() => handleTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={styles.tabContent}>
            {tab.icon}
            <Text
              style={[
                styles.tabLabel,
                { color: 'white' }, // Sempre bianco
              ]}
            >
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 48 : 52,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'android' ? 4 : 6,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  tabButton: {
    height: 32,
    flex: 1,
    maxWidth: 85,
    marginHorizontal: 3,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#FF5722', // Arancione più brillante
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default BottomTabBar;