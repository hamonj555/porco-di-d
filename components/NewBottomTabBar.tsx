import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BottomTabBarProps = {
  onTabChange?: (tabName: string) => void;
  activeTab?: string;
};

const NewBottomTabBar = ({ onTabChange, activeTab = 'effects' }: BottomTabBarProps) => {
  
  const handleTabPress = (tabKey: string) => {
    if (onTabChange) {
      onTabChange(tabKey);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'effects' && styles.activeTabButton]}
        onPress={() => handleTabPress('effects')}
      >
        <Ionicons name="flash-outline" size={20} color={activeTab === 'effects' ? '#FFFFFF' : '#999999'} />
        <Text style={[styles.tabLabel, activeTab === 'effects' && styles.activeTabLabel]}>FX</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'library' && styles.activeTabButton]}
        onPress={() => handleTabPress('library')}
      >
        <Ionicons name="book-outline" size={20} color={activeTab === 'library' ? '#FFFFFF' : '#999999'} />
        <Text style={[styles.tabLabel, activeTab === 'library' && styles.activeTabLabel]}>Libreria</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'profile' && styles.activeTabButton]}
        onPress={() => handleTabPress('profile')}
      >
        <Ionicons name="person-outline" size={20} color={activeTab === 'profile' ? '#FFFFFF' : '#999999'} />
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>Profilo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'recent' && styles.activeTabButton]}
        onPress={() => handleTabPress('recent')}
      >
        <Ionicons name="time-outline" size={20} color={activeTab === 'recent' ? '#FFFFFF' : '#999999'} />
        <Text style={[styles.tabLabel, activeTab === 'recent' && styles.activeTabLabel]}>Recenti</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#121212',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingVertical: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  activeTabButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tabLabel: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default NewBottomTabBar;