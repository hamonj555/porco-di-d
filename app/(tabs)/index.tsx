import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Platform, Alert, ActivityIndicator, ScrollView, Image } from "react-native";
import { pingServer } from '../../src/apiClient';
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons"; // ✅ sostituisce lucide-react-native
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { 
  CinematicZoomIcon, 
  GlitchTransitionIcon, 
  VhsEffectIcon, 
  NoirFilterIcon, 
  ColorBoostIcon, 
  SepiaFilterIcon, 
  AnimatedTitlesIcon, 
  StickersEmojisIcon, 
  LightEffectsIcon, 
  InvertColorsIcon 
} from '@/components/icons/EffectIcons';
import { colors } from "@/constants/colors";
import { usePlayerStore } from "@/store/player-store";
import { saveAndShareMedia } from '@/utils/shareUtils';
import { getMemesByCategory } from '@/utils/memeAssets';
import { getAudioPath } from '@/utils/audioAssets';
import ModeSelector from "@/components/ModeSelector";
import StatusDisplay from "@/components/StatusDisplay";
import ProgressBar from "@/components/ProgressBar";
import VolumeControl from "@/components/VolumeControl";
import SpeedControl from "@/components/SpeedControl";
import RecordButton from "@/components/RecordButton";
import PlaybackControls from "@/components/PlaybackControls";
import EffectDisplay from "@/components/EffectDisplay";
import BottomTabBar from "@/components/BottomTabBar";
import EffectsGrid from "@/components/EffectsGrid";
import ApplyButton from "@/components/ApplyButton";
import AudioRecorder from "@/components/AudioRecorder";

export default function HomeScreen() {
  const { mode, audioUri, videoUri, memeImageUri, effectsFilterMode, activeEffects, toggleEffect, setMemeImageUri, setMode, setPreviewAudioUri, setPreviewPlaying, previewAudioUri, setAudioUri, isInPlayer, setIsInPlayer, pendingAudioUri, setPendingAudioUri, isPlayerLocked, setPlayerLocked, setVideoUri } = usePlayerStore();
  const [showEffectsGrid, setShowEffectsGrid] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isFXModeActive, setIsFXModeActive] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedMemeCategory, setSelectedMemeCategory] = useState('Tech Lord');
  const [selectedMemeId, setSelectedMemeId] = useState<number | null>(null);
  const [selectedAudioCategory, setSelectedAudioCategory] = useState('SOUND FX');
  const [selectedAICategory, setSelectedAICategory] = useState('AUDIO'); // NUOVO: per AI section
  const [navigationHistory, setNavigationHistory] = useState<Array<{type: string, value: any}>>([]);
  const [pingStatus, setPingStatus] = useState<string>('Connecting...');
  const insets = useSafeAreaInsets();

  // Test del ping al backend
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await pingServer();
        setPingStatus(`Backend: ${result.message}`);
        console.log('🟢 Backend connesso:', result);
      } catch (error) {
        setPingStatus('Backend: offline');
        console.error('🔴 Backend error:', error);
      }
    };
    testConnection();
  }, []);

  // Funzione per condividere il contenuto attivo
  const handleSmartShare = async () => {
    let currentMediaUri = null;
    let mediaType = '';
    
    switch(mode) {
      case 'AUDIO':
        currentMediaUri = audioUri;
        mediaType = 'audio';
        break;
      case 'VIDEO':
        currentMediaUri = videoUri;
        mediaType = 'video';
        break;
      case 'MEME':
        currentMediaUri = memeImageUri;
        mediaType = 'image';
        break;
      default:
        currentMediaUri = null;
    }
    
    if (!currentMediaUri) {
      Alert.alert(
        'Nessun contenuto',
        `Carica prima un ${mode.toLowerCase()} per condividerlo`
      );
      return;
    }
    
    try {
      setIsSharing(true);
      
      // Verifica se la condivisione è disponibile
      const isAvailable = await saveAndShareMedia(currentMediaUri, mediaType);
      
      console.log('✅ Contenuto condiviso con successo');
    } catch (error) {
      console.error('Errore durante la condivisione:', error);
      Alert.alert('Errore', 'Non è stato possibile condividere il media');
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    setIsFXModeActive(false); // Reset FX Mode quando cambia modalità
  }, [mode]);

  const toggleEffectsGrid = () => {
    setShowEffectsGrid(prev => !prev);
  };

  const toggleFXMode = () => {
    setIsFXModeActive(prev => !prev);
  };

  const handleGoBack = () => {
    // Se ci sono effetti attivi, rimuovi l'ultimo effetto
    if (activeEffects.length > 0) {
      const lastEffect = activeEffects[activeEffects.length - 1];
      toggleEffect(lastEffect);
    } 
    // Se player è locked, reset selezioni
    else if (isPlayerLocked) {
      setMemeImageUri(null);
      setSelectedMemeId(null);
      setAudioUri(null);
      setVideoUri(null);
      setPendingAudioUri(null);
      setPlayerLocked(false);
      setIsInPlayer(false);
      console.log('⬅️ Player resettato');
    }
    // Altrimenti gestisci la navigazione normale
    else if (navigationHistory.length > 0) {
      const lastAction = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      
      // Ripristina lo stato precedente
      if (lastAction.type === 'mode') {
        setMode(lastAction.value);
      } else if (lastAction.type === 'audioCategory') {
        setSelectedAudioCategory(lastAction.value);
      } else if (lastAction.type === 'memeCategory') {
        setSelectedMemeCategory(lastAction.value);
      }
    }
  };

  // Funzione per cambiare categoria meme
  const handleMemeCategory = (category: string) => {
    setSelectedMemeCategory(category);
    setSelectedMemeId(null); // Reset selezione quando cambia categoria
  };

  // Funzione per selezionare un meme
  const handleMemeSelection = (meme: any) => {
    if (meme.source) {
      // TOGGLE LOGIC: se è già selezionato, deseleziona
      if (selectedMemeId === meme.id) {
        setSelectedMemeId(null);
        setMemeImageUri(null);
        setIsInPlayer(false);
        console.log('🖼️ Meme deselezionato');
        return;
      }
      
      // AUTO-LOCK: Meme va direttamente nel player
      const asset = Image.resolveAssetSource(meme.source);
      setMemeImageUri(asset.uri);
      setSelectedMemeId(meme.id);
      // Reset dello stato APPLICA per nuovo contenuto
      setIsInPlayer(false);
      console.log('🖼️ Meme selezionato:', meme.id);
    }
  };

  // Categorie meme disponibili
  const memeCategories = [
    { id: 'Tech Lord', icon: '🤖', name: 'Tech Lord' },
    { id: 'Politicians', icon: '🏛️', name: 'Politicians' },
    { id: 'Celebrity', icon: '⭐', name: 'Celebrity' },
    { id: 'Boomer vs Z', icon: '👴', name: 'Boomer vs Z' },
    { id: 'AI vs Human', icon: '🧠', name: 'AI vs Human' }
  ];

  // Funzione per gestire click su audio
  const handleAudioClick = async (audioName: string) => {
    try {
      // TOGGLE LOGIC: se audio già selezionato, deseleziona
      if (activeEffects.includes(audioName)) {
        toggleEffect(audioName);
        
        // Se era nel player, rimuovilo
        if (audioUri) {
          setAudioUri(null);
          console.log('🎧 Audio rimosso dal player:', audioName);
        }
        // Se era pending, rimuovilo
        if (pendingAudioUri) {
          setPendingAudioUri(null);
          console.log('🎧 Audio pending rimosso:', audioName);
        }
        return;
      }
      
      // Ottieni il path reale dell'audio (ora è async)
      const audioPath = await getAudioPath(audioName);
      
      if (!audioPath) {
        console.error('Audio non trovato:', audioName);
        Alert.alert('Errore', 'Audio non trovato');
        return;
      }
      
      // Aggiungi audio alla barra effetti per feedback visivo
      toggleEffect(audioName);
      
      if (isPlayerLocked && (memeImageUri || videoUri)) {
        // Player pieno: audio pending per combinazione
        setPendingAudioUri(audioPath.uri);
        console.log('🎧 Audio aggiunto per combinazione:', audioName);
      } else {
        // Player vuoto: carica audio normalmente
        setAudioUri(audioPath.uri);
        setIsInPlayer(false);
        console.log('🎧 Audio caricato nel player:', audioName);
      }
      
    } catch (error) {
      console.error('Errore caricamento audio:', error);
      Alert.alert('Errore', 'Impossibile caricare l\'audio');
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" hidden={true} />
      
      {/* Componente AudioRecorder per gestire la registrazione audio */}
      {mode === 'AUDIO' && <AudioRecorder />}
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.shareButton, isSharing && styles.sharingButton]} 
          onPress={handleSmartShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Ionicons name="share-outline" size={20} color={colors.text} />
          )}
        </TouchableOpacity>
        
        {(activeEffects.length > 0 || navigationHistory.length > 0) ? (
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerTitleContainer}>
            <Image 
              source={require('../../assets/images/logo.png')}
              style={{ 
                height: 36,
                width: 115
              }}
              resizeMode="contain"
            />
          </View>
        )}
        
        <View style={styles.infoContainer}>
          <Text style={styles.pingStatus}>{pingStatus}</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.modeSelectorContainer}>
        <View style={{width: '100%', paddingHorizontal: 8}}>
          <ModeSelector isFXModeActive={isFXModeActive} />
        </View>
      </View>

      <View style={styles.content}>
        <StatusDisplay 
          onToggleFullscreen={(isFullscreen) => setCanGoBack(isFullscreen)}
          activeVideoEffects={activeEffects}
        />
        <ProgressBar />

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <VolumeControl />
            <View style={{width: 60}} />
            <SpeedControl />
          </View>
          
          <View style={styles.recordButtonContainer}>
            <RecordButton />
          </View>
          
          <View style={styles.applyButtonContainer}>
            <ApplyButton />
          </View>

          <View style={styles.playbackControlsContainer}>
            <PlaybackControls />
          </View>

          {/* Barra effetti universale per tutte le modalità */}
          <View style={styles.effectDisplayContainer}>
            <EffectDisplay 
              selectedEffects={activeEffects.map(name => {
                // Lista completa di tutti gli effetti con i loro colori
                const allEffects = [
                  // AI Audio Effects
                  { name: 'Voice Cloning', color: '#34D399' },
                  { name: 'Cartoon Voice', color: '#34D399' },
                  { name: 'Gender Swap', color: '#34D399' },
                  { name: 'Age Changer', color: '#34D399' },
                  { name: 'Vocal Isolation', color: '#34D399' },
                  { name: 'Autotune', color: '#34D399' },
                  // AI Video Effects
                  { name: 'Face Swap', color: '#3B82F6' },
                  { name: 'Beauty/Ugly', color: '#3B82F6' },
                  { name: 'Caption Meme', color: '#3B82F6' },
                  { name: 'Lip Sync', color: '#3B82F6' },
                  { name: 'Face Reenact', color: '#3B82F6' },
                  { name: 'Style Transfer', color: '#3B82F6' },
                  { name: 'BG Removal', color: '#3B82F6' },
                  { name: 'Sky Replace', color: '#3B82F6' },
                  // Video Effects
                  { name: 'Cinematic Zoom', color: '#FF3030' },
                  { name: 'Glitch Transition', color: '#00FFFF' },
                  { name: 'VHS Effect', color: '#FF6600' },
                  { name: 'Noir Filter', color: '#FFFFFF' },
                  { name: 'Color Boost', color: '#FF0080' },
                  { name: 'Sepia Filter', color: '#FFAA00' },
                  { name: 'Animated Titles', color: '#00FF00' },
                  { name: 'Stickers/Emojis', color: '#FFFF00' },
                  { name: 'Light Effects', color: '#8000FF' },
                  { name: 'Invert Colors', color: '#0080FF' },
                  // Sound FX
                  { name: 'Big Applause', color: '#FF6B6B' },
                  { name: 'Huge Laughter', color: '#4ECDC4' },
                  { name: 'Sad Trombone', color: '#45B7D1' },
                  { name: 'Cartoon Slip', color: '#FFA07A' },
                  { name: 'Digital Glitch', color: '#98D8C8' },
                  { name: 'Explosion', color: '#F7DC6F' },
                  { name: 'Dramatic Zoom', color: '#BB8FCE' },
                  { name: 'Burp', color: '#FFB6C1' },
                  { name: 'Fart', color: '#F8C471' },
                  { name: 'Siren', color: '#EC7063' },
                  { name: 'Door Open', color: '#82E0AA' },
                  { name: 'Glass Breaking', color: '#AED6F1' },
                  { name: 'Pop Bubble', color: '#F9E79F' },
                  { name: 'Whistle', color: '#AED6F1' },
                  { name: 'Slurp', color: '#A9DFBF' },
                  { name: 'Swoosh', color: '#F6DDCC' },
                  { name: 'Boing', color: '#D5A6BD' },
                  { name: 'Drum Roll', color: '#AED6F1' },
                  { name: 'Fail Buzzer', color: '#FF6B6B' },
                  { name: 'Animal Scream', color: '#4ECDC4' },
                  { name: 'Record Scratch', color: '#45B7D1' },
                  { name: 'Horn Honk', color: '#FFA07A' },
                  { name: 'Cartoon Blink', color: '#98D8C8' },
                  { name: 'Magic Sparkle', color: '#F7DC6F' },
                  { name: 'Emoji Pop', color: '#BB8FCE' },
                  { name: 'Cough Sneeze', color: '#85C1E9' },
                  { name: 'Scream', color: '#F8C471' },
                  { name: 'Punch', color: '#EC7063' },
                  { name: 'Evil Laugh', color: '#82E0AA' },
                  { name: 'Fire Crackle', color: '#AED6F1' },
                  { name: 'Bubble Burst', color: '#F9E79F' },
                  { name: 'Phone Vibration', color: '#D7BDE2' },
                  { name: 'Camera Click', color: '#A9DFBF' },
                  { name: 'Bell Ding', color: '#F6DDCC' },
                  { name: 'Crowd Boo', color: '#D5A6BD' },
                  // Soundtracks
                  { name: 'Epic Cinematic', color: '#FF6B6B' },
                  { name: 'Horror Suspense', color: '#4ECDC4' },
                  { name: 'Comedy Cartoon', color: '#45B7D1' },
                  { name: 'Trap Meme Beat', color: '#FFA07A' },
                  { name: 'Drama Reality', color: '#98D8C8' },
                  { name: 'Synthwave Retro', color: '#F7DC6F' },
                  { name: 'Pop Happy', color: '#BB8FCE' },
                  { name: 'Jazz Comedy', color: '#85C1E9' },
                  { name: 'Chill Lo-fi', color: '#F8C471' },
                  { name: 'Action Movie', color: '#EC7063' },
                  { name: 'Techno Matrix', color: '#82E0AA' },
                  { name: 'Kids Fun Loop', color: '#AED6F1' },
                  { name: 'Victory Anthem', color: '#F9E79F' },
                  { name: 'Cringe Anthem', color: '#D7BDE2' },
                  { name: 'News Satire', color: '#A9DFBF' }
                ];
                const effect = allEffects.find(e => e.name === name);
                return { name, color: effect?.color || '#7C4DFF' };
              })}
            />
          </View>

          {/* MEME Categories */}
          {mode === 'MEME' && (
            <View style={styles.memeCategoriesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.memeCategoriesContent}
              >
                {memeCategories.map((category) => {
                  const isSelected = selectedMemeCategory === category.id;
                  return (
                    <TouchableOpacity 
                      key={category.id}
                      style={[
                        styles.memeCategoryPill,
                        isSelected && styles.memeCategoryPillActive
                      ]}
                      onPress={() => handleMemeCategory(category.id)}
                    >
                      <Text style={styles.memeCategoryIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.memeCategoryText,
                        isSelected && styles.memeCategoryTextActive
                      ]}>{category.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* MEME Gallery */}
          {mode === 'MEME' && (
            <View style={styles.memeGalleryContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.memeGalleryContent}
              >
                {getMemesByCategory(selectedMemeCategory).map((meme, index) => {
                  const isSelected = selectedMemeId === meme.id;
                  return (
                    <TouchableOpacity 
                      key={meme.id} 
                      style={[
                        styles.memeImageContainer,
                        isSelected && styles.memeImageSelected
                      ]}
                      onPress={() => handleMemeSelection(meme)}
                    >
                      {meme.source ? (
                        <Image 
                          source={meme.source} 
                          style={styles.memeImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.memeImagePlaceholder}>
                          <Text style={styles.memeImageNumber}>{meme.id}</Text>
                        </View>
                      )}
                      {isSelected && (
                        <View style={styles.memeImageOverlay}>
                          <Text style={styles.memeSelectedText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Mostra gli effetti in base alla modalità corrente o al filtro quando MODIFICA è attivo */}
          {((isFXModeActive ? effectsFilterMode : mode) === 'VIDEO') && (
            <View style={styles.videoEffectsContainer}>
              <ScrollView 
                style={styles.effectsList}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.effectsGrid}>
                  {[
                    { name: 'Cinematic Zoom', icon: CinematicZoomIcon, color: '#FF3030' },
                    { name: 'Glitch Transition', icon: GlitchTransitionIcon, color: '#00FFFF' },
                    { name: 'VHS Effect', icon: VhsEffectIcon, color: '#FF6600' },
                    { name: 'Noir Filter', icon: NoirFilterIcon, color: '#FFFFFF' },
                    { name: 'Color Boost', icon: ColorBoostIcon, color: '#FF0080' },
                    { name: 'Sepia Filter', icon: SepiaFilterIcon, color: '#FFAA00' },
                    { name: 'Animated Titles', icon: AnimatedTitlesIcon, color: '#00FF00' },
                    { name: 'Stickers/Emojis', icon: StickersEmojisIcon, color: '#FFFF00' },
                    { name: 'Light Effects', icon: LightEffectsIcon, color: '#8000FF' },
                    { name: 'Invert Colors', icon: InvertColorsIcon, color: '#0080FF' }
                  ].reduce((rows, effect, index) => {
                    const rowIndex = Math.floor(index / 2);
                    if (!rows[rowIndex]) rows[rowIndex] = [];
                    rows[rowIndex].push(effect);
                    return rows;
                  }, [] as any[]).map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.effectsRow}>
                      {row.map((effect: any, colIndex: number) => {
                        const isSelected = activeEffects.includes(effect.name);
                        return (
                          <TouchableOpacity 
                            key={colIndex}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 8,
                              width: '48%',
                            }}
                            onPress={() => toggleEffect(effect.name)}
                          >
                            <effect.icon size={35} color={effect.color} />
                            {isSelected ? (
                              <Text style={{
                                fontSize: 10,
                                color: effect.color,
                                fontWeight: 'bold',
                                marginTop: 4
                              }}>✓ ATTIVO</Text>
                            ) : (
                              <Text style={{
                                fontSize: 10,
                                color: '#FFFFFF',
                                marginTop: 4,
                                textAlign: 'center'
                              }}>{effect.name}</Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}



          {/* AUDIO Effects */}
          {((isFXModeActive ? effectsFilterMode : mode) === 'AUDIO') && (
            <View style={styles.audioEffectsContainer}>
              {/* Audio Category Pills */}
              <View style={styles.audioCategoryContainer}>
                <TouchableOpacity 
                  style={[
                    styles.audioCategoryPill,
                    selectedAudioCategory === 'SOUND FX' && styles.audioCategoryPillActive
                  ]}
                  onPress={() => setSelectedAudioCategory('SOUND FX')}
                >
                  <Text style={[
                    styles.audioCategoryText,
                    selectedAudioCategory === 'SOUND FX' && styles.audioCategoryTextActive
                  ]}>🔊 SOUND FX</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.audioCategoryPill,
                    selectedAudioCategory === 'SOUNDTRACK' && styles.audioCategoryPillActive
                  ]}
                  onPress={() => setSelectedAudioCategory('SOUNDTRACK')}
                >
                  <Text style={[
                    styles.audioCategoryText,
                    selectedAudioCategory === 'SOUNDTRACK' && styles.audioCategoryTextActive
                  ]}>🎵 SOUNDTRACK</Text>
                </TouchableOpacity>
              </View>

              {/* Selected Category Effects */}
              <View style={styles.audioSelectedCategoryContainer}>
                <ScrollView 
                  style={styles.audioEffectsList}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.audioEffectsGrid}>
                    {(() => {
                      const soundFXEffects = [
                        { name: 'Big Applause', icon: '👏', color: '#FF6B6B' },
                        { name: 'Huge Laughter', icon: '😂', color: '#4ECDC4' },
                        { name: 'Sad Trombone', icon: '🎺', color: '#45B7D1' },
                        { name: 'Cartoon Slip', icon: '🤸', color: '#FFA07A' },
                        { name: 'Digital Glitch', icon: '⚡', color: '#98D8C8' },
                        { name: 'Explosion', icon: '💥', color: '#F7DC6F' },
                        { name: 'Dramatic Zoom', icon: '🔍', color: '#BB8FCE' },
                        { name: 'Burp', icon: '🤤', color: '#85C1E9' },
                        { name: 'Fart', icon: '💨', color: '#F8C471' },
                        { name: 'Siren', icon: '🚨', color: '#EC7063' },
                        { name: 'Door Open', icon: '🚪', color: '#82E0AA' },
                        { name: 'Glass Breaking', icon: '🔨', color: '#AED6F1' },
                        { name: 'Pop Bubble', icon: '🫧', color: '#F9E79F' },
                        { name: 'Whistle', icon: '🥅', color: '#D7BDE2' },
                        { name: 'Slurp', icon: '🥤', color: '#A9DFBF' },
                        { name: 'Swoosh', icon: '💨', color: '#F6DDCC' },
                        { name: 'Boing', icon: '🎪', color: '#D5A6BD' },
                        { name: 'Drum Roll', icon: '🥁', color: '#AED6F1' },
                        { name: 'Fail Buzzer', icon: '❌', color: '#FF6B6B' },
                        { name: 'Animal Scream', icon: '🐑', color: '#4ECDC4' },
                        { name: 'Record Scratch', icon: '💿', color: '#45B7D1' },
                        { name: 'Horn Honk', icon: '📯', color: '#FFA07A' },
                        { name: 'Cartoon Blink', icon: '👁️', color: '#98D8C8' },
                        { name: 'Magic Sparkle', icon: '✨', color: '#F7DC6F' },
                        { name: 'Emoji Pop', icon: '🎭', color: '#BB8FCE' },
                        { name: 'Cough Sneeze', icon: '🤧', color: '#85C1E9' },
                        { name: 'Scream', icon: '😱', color: '#F8C471' },
                        { name: 'Punch', icon: '👊', color: '#EC7063' },
                        { name: 'Evil Laugh', icon: '😈', color: '#82E0AA' },
                        { name: 'Fire Crackle', icon: '🔥', color: '#AED6F1' },
                        { name: 'Bubble Burst', icon: '💨', color: '#F9E79F' },
                        { name: 'Phone Vibration', icon: '📱', color: '#D7BDE2' },
                        { name: 'Camera Click', icon: '📸', color: '#A9DFBF' },
                        { name: 'Bell Ding', icon: '🔔', color: '#F6DDCC' },
                        { name: 'Crowd Boo', icon: '👥', color: '#D5A6BD' },
                        { name: 'Burp', icon: '🍺', color: '#FFB6C1' }
                      ];

                      const soundtrackEffects = [
                        { name: 'Epic Cinematic', icon: '🎬', color: '#FF6B6B' },
                        { name: 'Horror Suspense', icon: '👻', color: '#4ECDC4' },
                        { name: 'Comedy Cartoon', icon: '🎭', color: '#45B7D1' },
                        { name: 'Trap Meme Beat', icon: '🎤', color: '#FFA07A' },
                        { name: 'Drama Reality', icon: '📺', color: '#98D8C8' },
                        { name: 'Synthwave Retro', icon: '🌊', color: '#F7DC6F' },
                        { name: 'Pop Happy', icon: '🎉', color: '#BB8FCE' },
                        { name: 'Jazz Comedy', icon: '🎷', color: '#85C1E9' },
                        { name: 'Chill Lo-fi', icon: '☁️', color: '#F8C471' },
                        { name: 'Action Movie', icon: '🚀', color: '#EC7063' },
                        { name: 'Techno Matrix', icon: '🤖', color: '#82E0AA' },
                        { name: 'Kids Fun Loop', icon: '🎈', color: '#AED6F1' },
                        { name: 'Victory Anthem', icon: '🏆', color: '#F9E79F' },
                        { name: 'Cringe Anthem', icon: '😬', color: '#D7BDE2' },
                        { name: 'News Satire', icon: '📰', color: '#A9DFBF' }
                      ];

                      const currentEffects = selectedAudioCategory === 'SOUND FX' ? soundFXEffects : soundtrackEffects;
                      
                      return currentEffects.reduce((rows, effect, index) => {
                        const rowIndex = Math.floor(index / 3);
                        if (!rows[rowIndex]) rows[rowIndex] = [];
                        rows[rowIndex].push(effect);
                        return rows;
                      }, [] as any[]).map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.audioEffectsRow}>
                          {row.map((effect: any, colIndex: number) => {
                            const isSelected = activeEffects.includes(effect.name);
                            const isPending = pendingAudioUri !== null && effect.name === 'audio_pending'; // TODO: match con nome reale
                            const isInPreview = false; // TODO: Fix async comparison
                            return (
                              <TouchableOpacity 
                                key={colIndex}
                                style={[
                                  styles.audioEffectItem,
                                  isSelected && { 
                                    backgroundColor: effect.color + '30',
                                    borderWidth: 2,
                                    borderColor: effect.color,
                                    transform: [{ scale: 1.05 }]
                                  },
                                  isInPreview && {
                                    backgroundColor: '#7C4DFF20',
                                    borderWidth: 2,
                                    borderColor: '#7C4DFF',
                                    transform: [{ scale: 1.1 }]
                                  }
                                ]}
                                onPress={() => handleAudioClick(effect.name)}
                                activeOpacity={0.7}
                              >
                                <Text style={[
                                  styles.audioEffectIcon,
                                  isSelected && { 
                                    fontSize: 28,
                                    textShadowColor: effect.color,
                                    textShadowOffset: { width: 0, height: 0 },
                                    textShadowRadius: 10
                                  },
                                  isInPreview && {
                                    fontSize: 30,
                                    textShadowColor: '#7C4DFF',
                                    textShadowOffset: { width: 0, height: 0 },
                                    textShadowRadius: 15
                                  }
                                ]}>{effect.icon}</Text>
                                <Text style={[
                                  styles.audioEffectName,
                                  isSelected && { 
                                    color: effect.color, 
                                    fontWeight: 'bold',
                                    fontSize: 9
                                  },
                                  isInPreview && {
                                    color: '#7C4DFF',
                                    fontWeight: 'bold',
                                    fontSize: 9
                                  }
                                ]}>
                                  {isInPreview ? '▶ PREVIEW' : effect.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      ));
                    })()}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {((isFXModeActive ? effectsFilterMode : mode) === 'AI') && (
            <View style={styles.aiEffectsContainer}>
              <View style={styles.aiColumnsContainer}>
                {/* Pillole categoria AI - ORA CLICCABILI */}
                <View style={styles.aiCategoryContainer}>
                  <TouchableOpacity 
                    style={[styles.aiCategoryPill, selectedAICategory === 'AUDIO' && styles.aiCategoryPillActiveAudio]}
                    onPress={() => setSelectedAICategory('AUDIO')}
                  >
                    <Text style={[styles.aiCategoryText, selectedAICategory === 'AUDIO' && styles.aiCategoryTextActive]}>🎵 AI AUDIO</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.aiCategoryPill, selectedAICategory === 'VIDEO' && styles.aiCategoryPillActiveVideo]}
                    onPress={() => setSelectedAICategory('VIDEO')}
                  >
                    <Text style={[styles.aiCategoryText, selectedAICategory === 'VIDEO' && styles.aiCategoryTextActive]}>📹 AI VIDEO</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Effetti della categoria selezionata - STESSA STRUTTURA AUDIO */}
                <View style={styles.aiSelectedCategoryContainer}>
                  <ScrollView 
                  style={[styles.aiEffectsList, { maxHeight: 250 }]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  nestedScrollEnabled={true}
                >
                    <View style={styles.aiEffectsGrid}>
                      {(() => {
                        const audioEffects = [
                          { name: 'Voice Cloning', emoji: '🎤', description: 'Clona voce' },
                          { name: 'Cartoon Voice', emoji: '🎭', description: 'Voce cartoon' },
                          { name: 'Gender Swap', emoji: '🔄', description: 'Cambia genere' },
                          { name: 'Age Changer', emoji: '👶', description: 'Cambia età' },
                          { name: 'Vocal Isolation', emoji: '🎵', description: 'Isola voce' },
                          { name: 'Autotune', emoji: '🤖', description: 'Autotune' }
                        ];
                        
                        const videoEffects = [
                          { name: 'Face Swap', emoji: '😎', description: 'Scambia volti' },
                          { name: 'Beauty/Ugly', emoji: '✨', description: 'Filtro bellezza' },
                          { name: 'Caption Meme', emoji: '💬', description: 'Sottotitoli meme' },
                          { name: 'Lip Sync', emoji: '👄', description: 'Sincro labiale' },
                          { name: 'Face Reenact', emoji: '🎭', description: 'Ricrea volto' },
                          { name: 'Style Transfer', emoji: '🎨', description: 'Stile cartoon' },
                          { name: 'BG Removal', emoji: '🌈', description: 'Rimuovi sfondo' },
                          { name: 'Sky Replace', emoji: '☁️', description: 'Cambia cielo' }
                        ];
                        
                        const currentEffects = selectedAICategory === 'AUDIO' ? audioEffects : videoEffects;
                        const categoryColor = selectedAICategory === 'AUDIO' ? '#34D399' : '#3B82F6';
                        
                        return currentEffects.reduce((rows, effect, index) => {
                          const rowIndex = Math.floor(index / 2);
                          if (!rows[rowIndex]) rows[rowIndex] = [];
                          rows[rowIndex].push(effect);
                          return rows;
                        }, [] as any[]).map((row, rowIndex) => (
                          <View key={rowIndex} style={styles.aiEffectsRow}>
                            {row.map((effect: any, colIndex: number) => {
                              const isActive = activeEffects.includes(effect.name);
                              return (
                                <TouchableOpacity 
                                  key={colIndex}
                                  style={[
                                    styles.aiEffectItem,
                                    isActive && { 
                                      backgroundColor: categoryColor + '30',
                                      borderWidth: 2,
                                      borderColor: categoryColor,
                                      transform: [{ scale: 1.05 }]
                                    }
                                  ]}
                                  onPress={() => toggleEffect(effect.name)}
                                  activeOpacity={0.7}
                                >
                                  <View style={styles.aiEffectContent}>
                                    <Text style={[
                                      styles.aiEffectIcon,
                                      isActive && { 
                                        fontSize: 32,
                                        textShadowColor: categoryColor,
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: 10
                                      }
                                    ]}>{effect.emoji}</Text>
                                    <Text style={[
                                      styles.aiEffectName,
                                      isActive && { 
                                        color: categoryColor, 
                                        fontWeight: 'bold',
                                        fontSize: 14
                                      }
                                    ]}>{effect.name}</Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ));
                      })()} 
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomTabContainer}>
        <BottomTabBar 
          onToggleEffectsGrid={toggleEffectsGrid} 
          showEffectsGrid={showEffectsGrid}
          isFXModeActive={isFXModeActive}
          onToggleFXMode={toggleFXMode}
        />
      </View>
      
      {/* Banner pubblicitario fittizio */}
      <View style={[styles.bannerContainer, { bottom: insets.bottom + 10 }]}>
        <Text style={styles.bannerText}>🎯 BANNER ADS 320x50</Text>
      </View>
    </SafeAreaView>
  );
}

// 👇 styles rimangono invariati (li hai già ottimizzati bene)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 6 : 12,
    height: 46,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
  headerLogo: {
    height: 45,
    width: 160,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginRight: 8,
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  sharingButton: {
    opacity: 0.6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pingStatus: {
    fontSize: 10,
    color: '#00FF00',
    fontWeight: '600',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
  modeSelectorContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 4 : 0,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 85 : 80,
  },
  controlsSection: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  recordButtonContainer: {
    position: 'absolute',
    left: '30%',
    top: 10,
    zIndex: 10,
  },
  applyButtonContainer: {
    position: 'absolute',
    right: '30%',
    top: 10,
    zIndex: 10,
  },
  playbackControlsContainer: {
    width: '100%',
    marginTop: -45,
    alignItems: 'center',
    marginBottom: 0,
  },
  effectDisplayContainer: {
    width: '100%',
    marginTop: 4,
  },
  effectsGridContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 4,
  },
  // AI Category Styles (copiati da audio)
  aiCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: -8,
    paddingHorizontal: 16,
    gap: 8,
  },
  aiCategoryPill: {
    backgroundColor: '#333333',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#555555',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  aiCategoryPillActive: {
    borderColor: 'transparent',
  },
  aiCategoryPillActiveAudio: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  aiCategoryPillActiveVideo: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  aiCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  aiCategoryTextActive: {
    color: '#FFFFFF',
  },
  aiEffectsContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 2,
  },
  aiColumnsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  aiSelectedCategoryContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 10,
    paddingTop: 4,
  },
  aiEffectsList: {
    flex: 1,
  },
  aiEffectsGrid: {
    paddingBottom: 10,
  },
  aiEffectsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 8,
    gap: 6,
  },
  aiEffectItem: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  aiEffectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  aiEffectIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  aiEffectName: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  aiColumnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
    marginTop: -10,
  },
  aiScrollView: {
    flex: 1,
    paddingBottom: 30,
  },
  aiEffectButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  aiEffectEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  aiEffectText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  bottomTabContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 100, // Alzato da 50 a 100 per banner ads
    height: Platform.OS === 'android' ? 48 : 52,
    zIndex: 100,
    backgroundColor: '#121212',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bannerContainer: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 50,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoEffectsContainer: {
    height: 200,
    paddingTop: 10,
  },
  effectsList: {
    paddingHorizontal: 20,
  },
  effectsGrid: {
    flex: 1,
  },
  effectsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  effectSquareItem: {
    width: '48%',
    height: 80,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  effectSquareIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  effectSquareEmoji: {
    fontSize: 28,
  },
  effectSquareName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  squareSelectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareCheckmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memeCategoriesContainer: {
    width: '100%',
    height: 36,
    marginVertical: 0,
  },
  memeCategoriesContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  memeCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 55,
    height: 26,
  },
  memeCategoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  memeCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
  },
  memeCategoryPillActive: {
    backgroundColor: '#FFA500',
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  memeCategoryTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  memeGalleryContainer: {
    width: '100%',
    marginTop: 8,
    paddingBottom: 12,
  },
  memeGalleryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  memeGalleryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  memeImageContainer: {
    width: 120,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  memeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  memeImageNumber: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  memeImageSelected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  memeImageOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memeSelectedText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Audio Effects Styles
  audioEffectsContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
  },
  audioCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
    paddingHorizontal: 16,
    gap: 8,
  },
  audioCategoryPill: {
    backgroundColor: '#333333',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#555555',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  audioCategoryPillActive: {
    backgroundColor: '#7C4DFF',
    borderColor: '#7C4DFF',
  },
  audioCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  audioCategoryTextActive: {
    color: '#FFFFFF',
  },
  audioSelectedCategoryContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  audioSectionsRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 8,
  },
  audioSection: {
    flex: 1,
    marginHorizontal: 4,
  },
  audioSectionHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  audioSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  audioEffectsList: {
    flex: 1,
  },
  audioEffectsGrid: {
    paddingBottom: 20,
  },
  audioEffectsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  audioEffectItem: {
    width: '30%',
    borderRadius: 6,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  audioEffectIcon: {
    fontSize: 24,
    marginBottom: 1,
  },
  audioEffectName: {
    fontSize: 8,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
