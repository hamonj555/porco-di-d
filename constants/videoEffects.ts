export const VIDEO_EFFECTS = {
  SELFIE: [
    { id: 'heart-eyes', name: 'Heart Eyes', icon: '😍' },
    { id: 'sparkle-stars', name: 'Sparkle Stars', icon: '✨' },
    { id: 'glow-up', name: 'Glow Up', icon: '💫' },
    { id: 'beauty-filter', name: 'Beauty Filter', icon: '🌟' }
  ],
  TRAVEL: [
    { id: 'airplane-fly', name: 'Airplane Fly', icon: '✈️' },
    { id: 'panorama-scroll', name: 'Panorama Scroll', icon: '🏔️' },
    { id: 'passport-stamp', name: 'Passport Stamp', icon: '📮' },
    { id: 'wind-effect', name: 'Wind Effect', icon: '💨' }
  ],
  PARTY: [
    { id: 'disco-ball', name: 'Disco Ball', icon: '🪩' },
    { id: 'confetti-rain', name: 'Confetti Rain', icon: '🎊' },
    { id: 'neon-lights', name: 'Neon Lights', icon: '💡' },
    { id: 'dance-floor', name: 'Dance Floor', icon: '🕺' }
  ],
  PETS: [
    { id: 'cute-ears', name: 'Cute Ears', icon: '🐰' },
    { id: 'food-rain', name: 'Food Rain', icon: '🍖' },
    { id: 'paw-prints', name: 'Paw Prints', icon: '🐾' },
    { id: 'animal-talk', name: 'Animal Talk', icon: '💬' }
  ],
  SPORT: [
    { id: 'goal-celebration', name: 'Goal Celebration', icon: '🎉' },
    { id: 'instant-replay', name: 'Instant Replay', icon: '⏪' },
    { id: 'victory-medal', name: 'Victory Medal', icon: '🏅' },
    { id: 'swoosh-effect', name: 'Swoosh Effect', icon: '⚡' }
  ],
  FAIL: [
    { id: 'facepalm', name: 'Facepalm', icon: '🤦' },
    { id: 'epic-fail', name: 'Epic Fail', icon: '💥' },
    { id: 'bruh-moment', name: 'Bruh Moment', icon: '😑' },
    { id: 'crash-sound', name: 'Crash Sound', icon: '💢' }
  ],
  ART: [
    { id: 'paint-splash', name: 'Paint Splash', icon: '🎨' },
    { id: 'creative-spark', name: 'Creative Spark', icon: '💡' },
    { id: 'brush-stroke', name: 'Brush Stroke', icon: '🖌️' },
    { id: 'art-mode', name: 'Art Mode', icon: '🖼️' }
  ],
  DAILY: [
    { id: 'morning-vibe', name: 'Morning Vibe', icon: '🌅' },
    { id: 'coffee-steam', name: 'Coffee Steam', icon: '☕' },
    { id: 'time-lapse', name: 'Time Lapse', icon: '⏰' },
    { id: 'real-life', name: 'Real Life', icon: '📱' }
  ],
  VLOG: [
    { id: 'story-frame', name: 'Story Frame', icon: '📱' },
    { id: 'vlog-intro', name: 'Vlog Intro', icon: '🎬' },
    { id: 'update-popup', name: 'Update Popup', icon: '💬' },
    { id: 'social-tag', name: 'Social Tag', icon: '🏷️' }
  ]
} as const;

export interface VideoEffect {
  id: string;
  name: string;
  icon: string;
}

export type VideoEffectId = keyof typeof VIDEO_EFFECTS;
