// app.config.js – versione unificata per Expo Dev Client e backend Heroku

module.exports = {
  name: 'Mocky',
  slug: 'mocky',
  version: '1.0.0',
  scheme: 'exp+mocky',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#7C4DFF',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mocked.app',
    infoPlist: {
      NSCameraUsageDescription: "L'app necessita dell'accesso alla fotocamera per registrare video",
      NSMicrophoneUsageDescription: "L'app necessita dell'accesso al microfono per registrare audio",
      NSPhotoLibraryUsageDescription: "L'app necessita dell'accesso alla galleria per caricare media",
      NSPhotoLibraryAddUsageDescription: "L'app necessita dell'accesso alla galleria per salvare i media creati",
    },
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#7C4DFF',
    },
    package: 'com.mocked.app',
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },

  web: {
    favicon: './assets/favicon.png',
  },

  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: "L'app richiede l'accesso alle foto per caricare media",
        cameraPermission: "L'app richiede l'accesso alla fotocamera per registrare video",
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: "L'app richiede l'accesso alle foto per salvare i media creati",
        savePhotosPermission: "L'app richiede l'accesso alla galleria per salvare i media creati",
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: "L'app richiede l'accesso alla fotocamera per registrare video e audio",
      },
    ],
    ['@config-plugins/ffmpeg-kit-react-native', { package: 'full-gpl' }],
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: "L'app richiede l'accesso alla fotocamera per registrare video",
        microphonePermissionText: "L'app richiede l'accesso al microfono per registrare audio",
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 26,
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          androidXCoreSplashScreenVersion: '1.1.0-beta02',
        },
      },
    ],
  ],

  extra: {
    eas: {
      projectId: '4eea8904-37cf-419b-b2f6-5fb202d7b40a',
    },
    // URL del backend su Heroku, sovrascrivibile con variabile di ambiente API_BASE
    apiBaseUrl: process.env.API_BASE || 'https://mocky-1-5c18b152b1ae.herokuapp.com'
  },
};
