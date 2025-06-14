export const VIDEO_CATEGORIES = [
  {
    id: 'SELFIE',
    name: 'SELFIE',
    emoji: '🤳',
    color: '#FF4757', // Rosa vibrante
    gradientColors: ['#FF4757', '#FF3742'] as const,
    shadowColor: '#FF4757',
    effects: ['Pop Cartoon', 'Risata Acuta', 'Camera Flash', 'Wow Awww']
  },
  {
    id: 'TRAVEL',
    name: 'TRAVEL', 
    emoji: '✈️',
    color: '#3498DB', // Blu cielo
    gradientColors: ['#3498DB', '#2980B9'] as const,
    shadowColor: '#3498DB',
    effects: ['Brezza Leggera', 'Jingle Esotico', 'Take-off Aereo', 'Click Fotocamera']
  },
  {
    id: 'PARTY',
    name: 'PARTY',
    emoji: '🎉', 
    color: '#9B59B6', // Viola festa
    gradientColors: ['#9B59B6', '#8E44AD'] as const,
    shadowColor: '#9B59B6',
    effects: ['Crowd Cheer', 'Bass Drop', 'Coriandoli Pop', 'Countdown Airhorn']
  },
  {
    id: 'PETS',
    name: 'PETS',
    emoji: '🐾',
    color: '#F39C12', // Arancione caldo
    gradientColors: ['#F39C12', '#E67E22'] as const,
    shadowColor: '#F39C12',
    effects: ['Bau Miao', 'Slurp Crunch', 'Pet Jump Woosh', 'Animal Voice']
  },
  {
    id: 'SPORT',
    name: 'SPORT',
    emoji: '💪',
    color: '#2ECC71', // Verde sport
    gradientColors: ['#2ECC71', '#27AE60'] as const,
    shadowColor: '#2ECC71',
    effects: ['Fischietto Arbitro', 'Swoosh Palla', 'Ding Ring', 'Go Go Cheer']
  },
  {
    id: 'FAIL',
    name: 'FAIL',
    emoji: '🤦',
    color: '#E74C3C', // Rosso fail
    gradientColors: ['#E74C3C', '#C0392B'] as const,
    shadowColor: '#E74C3C',
    effects: ['Sad Trombone', 'Crash Cartoon', 'Bruh Viral', 'Risata Sarcastica']
  },
  {
    id: 'ART',
    name: 'ART',
    emoji: '🎨',
    color: '#8E44AD', // Viola artistico
    gradientColors: ['#8E44AD', '#7D3C98'] as const,
    shadowColor: '#8E44AD',
    effects: ['Pennello Tela', 'Twinkle Scintilla', 'Mic Acceso', 'Slow Clap']
  },
  {
    id: 'DAILY',
    name: 'DAILY',
    emoji: '☕',
    color: '#95A5A6', // Grigio quotidiano
    gradientColors: ['#95A5A6', '#7F8C8D'] as const,
    shadowColor: '#95A5A6',
    effects: ['Allarme Sveglia', 'Caffettiera', 'Sbadiglio', 'Ding Messaggio']
  },
  {
    id: 'VLOG',
    name: 'VLOG',
    emoji: '📱',
    color: '#34495E', // Grigio scuro vlog
    gradientColors: ['#34495E', '#2C3E50'] as const,
    shadowColor: '#34495E',
    effects: ['Tasto Rec', 'Jingle Intro', 'Whoosh Transition', 'Hey Guys']
  }
];

export type VideoCategoryId = typeof VIDEO_CATEGORIES[number]['id'];
