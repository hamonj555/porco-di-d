import { create } from 'zustand';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { Alert } from 'react-native';
import * as apiClient from '../src/apiClient';

type ModeType = 'Audio' | 'Video' | 'Image' | 'Meme' | 'AI' | 'AUDIO' | 'VIDEO' | 'IMAGE' | 'MEME' | 'AI';

// Tipo per l'ultima creazione
type LastCreation = {
  id: string;
  name: string;
  type: ModeType;
  uri: string;
  timestamp: number;
  effects?: string[];
} | null;

// Tipo per le azioni undo
type UndoAction = {
  type: 'LOAD_MEDIA' | 'ADD_EFFECT' | 'REMOVE_EFFECT' | 'VOLUME_CHANGE' | 'SPEED_CHANGE' | 'COMBINE_MEDIA' | 'APPLY_CHANGES';
  timestamp: number;
  data: {
    videoUri?: string | null;
    audioUri?: string | null;
    memeImageUri?: string | null;
    pendingAudioUri?: string | null;
    activeEffects?: string[];
    volume?: number;
    speed?: number;
    mode?: ModeType;
  };
};

type PlayerStore = {
  mode: ModeType;
  setMode: (newMode: ModeType) => void;
  
  // Proprietà Video
  videoUri: string | null;
  originalVideoUri: string | null; // Video originale prima degli effetti
  setVideoUri: (uri: string | null) => void;
  setOriginalVideoUri: (uri: string | null) => void;
  resetVideoUri: () => void;
  
  // Proprietà Audio
  audioUri: string | null;
  setAudioUri: (uri: string | null) => void;
  resetAudioUri: () => void;
  
  // Preview Audio
  previewAudioUri: string | null;
  setPreviewAudioUri: (uri: string | null) => void;
  isPreviewPlaying: boolean;
  setPreviewPlaying: (playing: boolean) => void;
  
  // Audio pending (da applicare)
  pendingAudioUri: string | null;
  setPendingAudioUri: (uri: string | null) => void;
  
  // Proprietà Meme/Image
  memeImageUri: string | null;
  setMemeImageUri: (uri: string | null) => void;
  resetMemeImageUri: () => void;
  
  // Playback
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  goBack: () => void;
  mediaLoaded: boolean;
  setMediaLoaded: (loaded: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  increaseVolume: (amount: number) => void;
  decreaseVolume: (amount: number) => void;
  speed: number;
  setSpeed: (spd: number) => void;
  increaseSpeed: (amount: number) => void;
  decreaseSpeed: (amount: number) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  
  // Editing
  isEditing: boolean;
  setEditing: (isEditing: boolean) => void;
  
  // Camera
  isCameraVisible: boolean;
  setCameraVisible: (isVisible: boolean) => void;
  
  // Registrazione
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  toggleRecording: () => void;
  setRecordingTime: (time: number) => void;
  
  // FX Mode e filtro effetti
  effectsFilterMode: ModeType;
  setEffectsFilterMode: (mode: ModeType) => void;
  originMode: ModeType | null; // Modalità di origine quando MODIFICA è attivo
  setOriginMode: (mode: ModeType | null) => void;
  
  // Media Library
  loadMediaFromLibrary: (forcedMode?: string) => Promise<void>;
  
  // Effetti
  activeEffects: string[];
  toggleEffect: (effectId: string) => void;
  addEffect: (effectId: string) => void;
  removeEffect: (effectId: string) => void;
  clearEffects: () => void;
  getActiveEffectsNames: () => string[];
  
  // Tracking modifiche applicate
  hasAppliedChanges: boolean;
  setHasAppliedChanges: (hasChanges: boolean) => void;
  appliedVolume: number;
  appliedSpeed: number;
  setAppliedSettings: (volume: number, speed: number) => void;
  
  // Doppio-tap APPLICA
  isInPlayer: boolean;
  setIsInPlayer: (inPlayer: boolean) => void;
  
  // Combinazione media
  hasCombination: boolean;
  setHasCombination: (hasCombination: boolean) => void;
  
  // Auto-lock player
  isPlayerLocked: boolean;
  setPlayerLocked: (locked: boolean) => void;
  
  // Ultima creazione
  lastCreation: LastCreation;
  recentCreations: LastCreation[];
  setLastCreation: (creation: LastCreation) => void;
  getLastCreation: () => LastCreation;
  getRecentCreations: () => LastCreation[];
  
  // Fusione Meme + Audio
  fuseMemeWithAudio: () => Promise<string | null>;
  
  // RunPod Effects
  applyRunPodEffect: (effectType: string, mediaUri: string) => Promise<string | null>;
  
  // Sistema Undo
  undoStack: UndoAction[];
  addUndoAction: (action: UndoAction) => void;
  undo: () => void;
  canUndo: () => boolean;
  clearUndoStack: () => void;
  saveCurrentState: (actionType: UndoAction['type']) => void;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  mode: 'MEME', // Default modalità sempre attiva

  setMode: (newMode) => {
    // Garantisce che ci sia sempre una modalità attiva
    if (newMode && newMode.trim() !== '') {
      set(() => ({
        mode: newMode,
      }));
    }
  },
  
  // RunPod Effects - Applica effetto tramite API
  applyRunPodEffect: async (effectType: string, mediaUri: string) => {
    try {
      console.log('🎬 Applicando effetto RunPod:', effectType);
      
      let result: string | null = null;
      
      // Mappa effetti a funzioni API
      switch (effectType) {
        // Video Effects
        case 'cinematic_zoom':
          result = await apiClient.cinematicZoom(mediaUri);
          break;
        case 'glitch_transition':
          result = await apiClient.glitchTransition(mediaUri);
          break;
        case 'vhs_effect':
          result = await apiClient.vhsEffect(mediaUri);
          break;
        case 'meme_fusion':
          result = await apiClient.memeFusion(mediaUri);
          break;
        case 'face_swap':
          result = await apiClient.faceSwap(mediaUri);
          break;
        case 'beauty_filter':
          result = await apiClient.beautyFilter(mediaUri);
          break;
        case 'lip_sync':
          result = await apiClient.lipSync(mediaUri);
          break;
        case 'style_transfer':
          result = await apiClient.styleTransfer(mediaUri);
          break;
        case 'bg_remove':
          result = await apiClient.backgroundRemove(mediaUri);
          break;
        case 'sky_replace':
          result = await apiClient.skyReplace(mediaUri);
          break;
          
        // Audio Effects
        case 'voice_cloning':
          result = await apiClient.voiceCloning(mediaUri);
          break;
        case 'cartoon_voice':
          result = await apiClient.cartoonVoice(mediaUri);
          break;
        case 'gender_swap':
          result = await apiClient.genderSwap(mediaUri);
          break;
        case 'age_changer':
          result = await apiClient.ageChanger(mediaUri);
          break;
        case 'vocal_isolation':
          result = await apiClient.vocalIsolation(mediaUri);
          break;
        case 'autotune':
          result = await apiClient.autoTune(mediaUri);
          break;
          
        // Video Standard (10 nuovi)
        case 'noir_filter':
        case 'color_boost':
        case 'sepia_filter':
        case 'animated_titles':
        case 'stickers_emojis':
        case 'light_effects':
        case 'invert_colors':
          // Per ora usa cinematic_zoom come placeholder
          result = await apiClient.cinematicZoom(mediaUri);
          break;
          
        default:
          console.warn('🚫 Effetto non riconosciuto:', effectType);
          Alert.alert('Effetto non disponibile', `Effetto ${effectType} non ancora implementato`);
          return null;
      }
      
      if (result) {
        console.log('✅ Effetto RunPod applicato:', result);
        
        // Aggiorna il media nel player con il risultato
        if (effectType.includes('voice') || effectType.includes('audio') || effectType.includes('vocal') || effectType.includes('autotune')) {
          // Effetti audio → aggiorna audioUri
          set({ audioUri: result });
        } else {
          // Effetti video → aggiorna videoUri
          set({ videoUri: result });
        }
        
        return result;
      } else {
        Alert.alert('Errore', 'Effetto non applicato correttamente');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Errore effetto RunPod:', error);
      Alert.alert('Errore', 'Si è verificato un errore durante l\'applicazione dell\'effetto');
      return null;
    }
  },
    
  // Proprietà Video
  videoUri: null,
  originalVideoUri: null,
  setVideoUri: (uri) => {
    get().saveCurrentState('LOAD_MEDIA');
    set({ 
      videoUri: uri,
      hasAppliedChanges: false,
      appliedVolume: 80,
      appliedSpeed: 100,
      isPlayerLocked: uri !== null // Auto-lock quando caricato
    });
  },
  setOriginalVideoUri: (uri) => set({ originalVideoUri: uri }),
  resetVideoUri: () => set({ videoUri: null, originalVideoUri: null }),
  
  // Proprietà Audio
  audioUri: null,
  setAudioUri: (uri) => {
    get().saveCurrentState('LOAD_MEDIA');
    set({ 
      audioUri: uri,
      hasAppliedChanges: false,
      appliedVolume: 80,
      appliedSpeed: 100,
      isPlayerLocked: uri !== null // Auto-lock quando caricato
    });
  },
  resetAudioUri: () => set({ audioUri: null }),
  
  // Preview Audio
  previewAudioUri: null,
  setPreviewAudioUri: (uri) => set({ previewAudioUri: uri }),
  isPreviewPlaying: false,
  setPreviewPlaying: (playing) => set({ isPreviewPlaying: playing }),
  
  // Audio pending (da applicare)
  pendingAudioUri: null,
  setPendingAudioUri: (uri) => set({ pendingAudioUri: uri }),
  
  // Proprietà Meme/Image
  memeImageUri: null,
  setMemeImageUri: (uri) => {
    get().saveCurrentState('LOAD_MEDIA');
    set({ 
      memeImageUri: uri,
      hasAppliedChanges: false,
      appliedVolume: 80,
      appliedSpeed: 100,
      isPlayerLocked: uri !== null // Auto-lock quando caricato
    });
  },
  resetMemeImageUri: () => set({ memeImageUri: null }),
  
  // Playback
  isPlaying: false,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, currentTime: 0 }),
  // Torna indietro (usa il sistema undo)
  goBack: () => {
    get().undo();
  },
  mediaLoaded: false,
  setMediaLoaded: (loaded) => set({ mediaLoaded: loaded }),
  volume: 80, // 0-100
  setVolume: (vol) => {
    get().saveCurrentState('VOLUME_CHANGE');
    set({ volume: Math.max(0, Math.min(100, vol)) });
  },
  increaseVolume: (amount) => set((state) => ({ 
    volume: Math.min(100, state.volume + amount) 
  })),
  decreaseVolume: (amount) => set((state) => ({ 
    volume: Math.max(0, state.volume - amount) 
  })),
  speed: 100, // percentuale (100 = 1x)
  setSpeed: (spd) => {
    get().saveCurrentState('SPEED_CHANGE');
    set({ speed: Math.max(25, Math.min(200, spd)) });
  },
  increaseSpeed: (amount) => set((state) => ({ 
    speed: Math.min(200, state.speed + amount) 
  })),
  decreaseSpeed: (amount) => set((state) => ({ 
    speed: Math.max(25, state.speed - amount) 
  })),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  duration: 0,
  setDuration: (dur) => set({ duration: dur }),
  
  // Editing
  isEditing: false,
  setEditing: (isEditing) => set({ isEditing }),
  
  // Camera
  isCameraVisible: false,
  setCameraVisible: (isVisible) => set({ isCameraVisible: isVisible }),
  
  // Registrazione
  isRecording: false,
  recordingTime: 0,
  startRecording: () => set({ isRecording: true, recordingTime: 0 }),
  stopRecording: () => set({ isRecording: false, recordingTime: 0 }),
  toggleRecording: () => set((state) => ({ 
    isRecording: !state.isRecording,
    recordingTime: !state.isRecording ? 0 : state.recordingTime 
  })),
  setRecordingTime: (time) => set({ recordingTime: time }),
  
  // FX Mode e filtro effetti
  effectsFilterMode: 'MEME',
  setEffectsFilterMode: (mode) => set({ effectsFilterMode: mode }),
  originMode: null,
  setOriginMode: (mode) => set({ originMode: mode }),
  
  // Media Library
  loadMediaFromLibrary: async (forcedMode?: string) => {
    const currentMode = forcedMode || get().mode;
    try {
      
      // Per AUDIO usa DocumentPicker per accedere alla cartella Music
      if (currentMode.toUpperCase() === 'AUDIO') {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'audio/*',
          copyToCacheDirectory: true,
        });
        
        if (!result.canceled && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          get().setAudioUri(selectedAsset.uri);
          
          // Registra l'ultima creazione
          get().setLastCreation({
            id: Date.now().toString(),
            name: selectedAsset.name || `Audio ${new Date().toLocaleTimeString()}`,
            type: 'AUDIO',
            uri: selectedAsset.uri,
            timestamp: Date.now(),
            effects: get().activeEffects.length > 0 ? [...get().activeEffects] : undefined
          });
        }
        return;
      }
      
      // Per VIDEO, IMAGE, MEME usa ImagePicker
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permesso negato', 'Consenti l\'accesso alla libreria per selezionare i media');
        return;
      }
      
      let mediaType = ImagePicker.MediaTypeOptions.All;
      if (currentMode.toUpperCase() === 'VIDEO') {
        mediaType = ImagePicker.MediaTypeOptions.Videos;
      } else if (currentMode.toUpperCase() === 'IMAGE' || currentMode.toUpperCase() === 'MEME') {
        mediaType = ImagePicker.MediaTypeOptions.Images;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: false,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      
      if (currentMode.toUpperCase() === 'VIDEO') {
      // Salva sia il video corrente che quello originale
            get().setVideoUri(selectedAsset.uri);
            get().setOriginalVideoUri(selectedAsset.uri);
          
          // Registra l'ultima creazione
          get().setLastCreation({
            id: Date.now().toString(),
            name: `Video ${new Date().toLocaleTimeString()}`,
            type: 'VIDEO',
            uri: selectedAsset.uri,
            timestamp: Date.now(),
            effects: get().activeEffects.length > 0 ? [...get().activeEffects] : undefined
          });
        } else if (currentMode.toUpperCase() === 'IMAGE' || currentMode.toUpperCase() === 'MEME') {
          get().setMemeImageUri(selectedAsset.uri);
          
          // Registra l'ultima creazione
          get().setLastCreation({
            id: Date.now().toString(),
            name: `Meme ${new Date().toLocaleTimeString()}`,
            type: 'MEME',
            uri: selectedAsset.uri,
            timestamp: Date.now(),
            effects: get().activeEffects.length > 0 ? [...get().activeEffects] : undefined
          });
        }
      }
    } catch (error) {
      console.error('Errore nella selezione media:', error);
      Alert.alert('Errore', 'Si è verificato un errore durante la selezione del media');
    }
  },
  
  // Effetti
  activeEffects: [],
  toggleEffect: (effectId) => {
    // Salva stato prima di modificare
    get().saveCurrentState(get().activeEffects.includes(effectId) ? 'REMOVE_EFFECT' : 'ADD_EFFECT');
    
    const wasActive = get().activeEffects.includes(effectId);
    
    set((state) => ({
      activeEffects: state.activeEffects.includes(effectId)
        ? state.activeEffects.filter(id => id !== effectId)
        : [...state.activeEffects, effectId]
    }));
    
    // Se l'effetto è stato aggiunto (non era attivo prima), applica RunPod
    if (!wasActive) {
      const { videoUri, audioUri, memeImageUri } = get();
      const mediaUri = videoUri || audioUri || memeImageUri;
      
      if (mediaUri) {
        // Tutti gli effetti ora usano direttamente i loro ID RunPod
        const runPodEffects = [
          // Audio AI
          'voice_cloning', 'cartoon_voice', 'gender_swap', 'age_changer', 'vocal_isolation', 'autotune',
          // Video AI  
          'face_swap', 'beauty_filter', 'caption_meme', 'lip_sync', 'face_reenact', 'style_transfer', 'bg_remove', 'sky_replace',
          // Video Standard
          'cinematic_zoom', 'glitch_transition', 'vhs_effect', 'noir_filter', 'color_boost', 'sepia_filter', 'animated_titles', 'stickers_emojis', 'light_effects', 'invert_colors'
        ];
        
        if (runPodEffects.includes(effectId)) {
          console.log('🚀 Applicando effetto RunPod:', effectId);
          get().applyRunPodEffect(effectId, mediaUri);
        }
      }
    }
  },
  addEffect: (effectId) => set((state) => ({
    activeEffects: state.activeEffects.includes(effectId)
      ? state.activeEffects
      : [...state.activeEffects, effectId]
  })),
  removeEffect: (effectId) => set((state) => ({
    activeEffects: state.activeEffects.filter(id => id !== effectId)
  })),
  clearEffects: () => set({ activeEffects: [] }),
  
  // Funzione per ottenere i nomi degli effetti attivi
  getActiveEffectsNames: () => {
    return get().activeEffects;
  },
  
  // Tracking modifiche applicate
  hasAppliedChanges: false,
  setHasAppliedChanges: (hasChanges) => set({ hasAppliedChanges: hasChanges }),
  appliedVolume: 80,
  appliedSpeed: 100,
  setAppliedSettings: (volume, speed) => set({ 
    appliedVolume: volume, 
    appliedSpeed: speed,
    hasAppliedChanges: true 
  }),
  
  // Doppio-tap APPLICA
  isInPlayer: false,
  setIsInPlayer: (inPlayer) => set({ isInPlayer: inPlayer }),
  
  // Combinazione media
  hasCombination: false,
  setHasCombination: (hasCombination) => set({ hasCombination: hasCombination }),
  
  // Auto-lock player
  isPlayerLocked: false,
  setPlayerLocked: (locked) => set({ isPlayerLocked: locked }),
  
  // Ultima creazione
  lastCreation: null,
  recentCreations: [],
  
  setLastCreation: (creation) => {
    // Aggiorna l'ultima creazione
    set({ lastCreation: creation });
    
    // Aggiorna l'array delle creazioni recenti (massimo 3)
    set((state) => {
      // Crea un nuovo array con la nuova creazione all'inizio
      const newRecentCreations = [creation];
      
      // Aggiungi le creazioni precedenti (fino a un massimo di 2 aggiuntive)
      if (state.recentCreations.length > 0) {
        // Filtra per evitare duplicati (stessa URI)
        const existingCreations = state.recentCreations.filter(
          item => item && creation && item.uri !== creation.uri
        );
        
        // Aggiungi fino a 2 delle creazioni precedenti
        newRecentCreations.push(...existingCreations.slice(0, 2));
      }
      
      return { recentCreations: newRecentCreations };
    });
  },
  
  getLastCreation: () => {
    return get().lastCreation;
  },
  
  getRecentCreations: () => {
    return get().recentCreations;
  },
  
  // Fusione Meme + Audio → Video MP4
  fuseMemeWithAudio: async () => {
    const { memeImageUri, pendingAudioUri } = get();
    
    if (!memeImageUri) {
      console.log('❌ Nessun meme caricato');
      return null;
    }
    
    try {
      // Path audio asset (1.mp3)
      const audioPath = pendingAudioUri || 'assets/audio/1.mp3';
      
      // Output path per video
      const outputPath = `${FileSystem.documentDirectory}meme_video_${Date.now()}.mp4`;
      
      console.log('🎬 Iniziando fusione:', { memeImageUri, audioPath, outputPath });
      
      // Comando FFmpeg ottimizzato per velocità
      const ffmpegCommand = `-loop 1 -i "${memeImageUri}" -i "${audioPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a copy -shortest -t 30 "${outputPath}"`;
      
      // Esegui FFmpeg
      const session = await FFmpegKit.execute(ffmpegCommand);
      const returnCode = await session.getReturnCode();
      
      if (returnCode.isValueSuccess()) {
        console.log('✅ Fusione completata:', outputPath);
        
        // Salva in galleria VIDEO
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          try {
            await MediaLibrary.createAssetAsync(outputPath);
            console.log('📱 Video salvato in galleria');
          } catch (saveError) {
            console.warn('⚠️ Errore salvataggio galleria:', saveError);
            // Continua comunque, il video è creato correttamente
          }
        }
        
        // Aggiorna store: sostituisce nel player
        set({
          videoUri: outputPath,
          memeImageUri: null, // Rimuove meme (ora è video)
          pendingAudioUri: null, // Rimuove audio pending
          hasCombination: false,
          mode: 'VIDEO' // Switcha a modalità video
        });
        
        // Registra come ultima creazione VIDEO
        const newCreation = {
          id: Date.now().toString(),
          name: `Meme Video ${new Date().toLocaleTimeString()}`,
          type: 'VIDEO' as ModeType,
          uri: outputPath,
          timestamp: Date.now()
        };
        
        get().setLastCreation(newCreation);
        
        return outputPath;
      } else {
        console.error('❌ Errore FFmpeg:', returnCode);
        Alert.alert('Errore', 'Errore durante la creazione del video');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Errore fusione:', error);
      Alert.alert('Errore', 'Errore durante la fusione');
      return null;
    }
  },
  
  // Sistema Undo
  undoStack: [],
  
  addUndoAction: (action) => {
    set((state) => ({
      undoStack: [...state.undoStack, action].slice(-10) // Mantieni solo le ultime 10 azioni
    }));
  },
  
  saveCurrentState: (actionType) => {
    const currentState = get();
    const undoAction: UndoAction = {
      type: actionType,
      timestamp: Date.now(),
      data: {
        videoUri: currentState.videoUri,
        audioUri: currentState.audioUri,
        memeImageUri: currentState.memeImageUri,
        pendingAudioUri: currentState.pendingAudioUri,
        activeEffects: [...currentState.activeEffects],
        volume: currentState.volume,
        speed: currentState.speed,
        mode: currentState.mode
      }
    };
    get().addUndoAction(undoAction);
  },
  
  undo: () => {
    const { undoStack } = get();
    if (undoStack.length === 0) {
      console.log('🔄 Nessuna azione da annullare');
      return;
    }
    
    // Prendi l'ultima azione
    const lastAction = undoStack[undoStack.length - 1];
    console.log('🔄 Undo:', lastAction.type);
    
    // Ripristina lo stato precedente
    set({
      videoUri: lastAction.data.videoUri ?? get().videoUri,
      audioUri: lastAction.data.audioUri ?? get().audioUri,
      memeImageUri: lastAction.data.memeImageUri ?? get().memeImageUri,
      pendingAudioUri: lastAction.data.pendingAudioUri ?? get().pendingAudioUri,
      activeEffects: lastAction.data.activeEffects ?? get().activeEffects,
      volume: lastAction.data.volume ?? get().volume,
      speed: lastAction.data.speed ?? get().speed,
      mode: lastAction.data.mode ?? get().mode,
      isPlaying: false,
      currentTime: 0,
      // Rimuovi l'azione dallo stack
      undoStack: undoStack.slice(0, -1)
    });
  },
  
  canUndo: () => {
    return get().undoStack.length > 0;
  },
  
  clearUndoStack: () => {
    set({ undoStack: [] });
  },
}));
