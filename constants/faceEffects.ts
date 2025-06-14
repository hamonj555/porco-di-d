export const FACE_EFFECTS = [
  {
    id: 'deal-with-it',
    name: 'Deal With It',
    icon: 'DEAL',
    description: 'Pixel sunglasses drop onto face',
    category: 'Classic Meme'
  },
  {
    id: 'animated-mustache',
    name: 'Mustache',
    icon: 'MUST',
    description: 'Cartoon mustache appears, twitches/rattles',
    category: 'Classic Meme'
  },
  {
    id: 'party-hat',
    name: 'Party Hat',
    icon: 'HAT',
    description: 'Meme hat drops on head',
    category: 'Classic Meme'
  },
  {
    id: 'clown-face',
    name: 'Clown Face',
    icon: 'CLOWN',
    description: 'Red clown nose and giant silly glasses',
    category: 'Classic Meme'
  },
  {
    id: 'royal-crown',
    name: 'Crown',
    icon: 'CROWN',
    description: 'Golden crown on top of the head',
    category: 'Classic Meme'
  },
  {
    id: 'comic-balloon',
    name: 'Comic',
    icon: 'COMIC',
    description: 'Comic-style speech balloon',
    category: 'Classic Meme'
  },
  {
    id: 'heart-eyes',
    name: 'Heart Eyes',
    icon: 'HEART',
    description: 'Eyes turn into big beating hearts',
    category: 'Cartoon'
  },
  {
    id: 'spring-eyes',
    name: 'Spring Eyes',
    icon: 'SPRING',
    description: 'Cartoon eyes pop out on springs',
    category: 'Cartoon'
  },
  {
    id: 'spinning-stars',
    name: 'Stars',
    icon: 'STARS',
    description: 'Animated stars spin around head',
    category: 'Cartoon'
  },
  {
    id: 'giant-mouth',
    name: 'Giant Mouth',
    icon: 'MOUTH',
    description: 'Mouth enlarges dramatically',
    category: 'Cartoon'
  },
  {
    id: 'tongue-out',
    name: 'Tongue Out',
    icon: 'TONGUE',
    description: 'Cartoon tongue pops out',
    category: 'Cartoon'
  },
  {
    id: 'zombie-face',
    name: 'Zombie',
    icon: 'ZOMBIE',
    description: 'Face turns green, dark eyes',
    category: 'Transform'
  },
  {
    id: 'demon-smile',
    name: 'Demon',
    icon: 'DEMON',
    description: 'Creepy extra-wide smile',
    category: 'Transform'
  },
  {
    id: 'cybernetic-face',
    name: 'Cyborg',
    icon: 'CYBER',
    description: 'Futuristic circuits and red eye',
    category: 'Transform'
  },
  {
    id: 'mocky-mask',
    name: 'Mocky Mask',
    icon: 'MOCKY',
    description: 'MOCKY mascot mask overlay',
    category: 'Transform'
  },
  {
    id: 'terminator-vision',
    name: 'Terminator',
    icon: 'TERM',
    description: 'Red scanner HUD overlay',
    category: 'Transform'
  }
] as const;

export type FaceEffectId = typeof FACE_EFFECTS[number]['id'];
