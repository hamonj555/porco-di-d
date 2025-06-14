// Utilità per gestire gli asset dei meme

export interface MemeAsset {
  id: number;
  source: any;
  category: string;
}

// Import diretti per Tech Lord (per ora)
const techLordAssets = {
  1: require('../assets/memes/tech-lord/1.png'),
  2: require('../assets/memes/tech-lord/2.png'),
  3: require('../assets/memes/tech-lord/3.png'),
  4: require('../assets/memes/tech-lord/4.png'),
  5: require('../assets/memes/tech-lord/5.png'),
  6: require('../assets/memes/tech-lord/6.png'),
  7: require('../assets/memes/tech-lord/7.png'),
  8: require('../assets/memes/tech-lord/8.png'),
  9: require('../assets/memes/tech-lord/9.png'),
  10: require('../assets/memes/tech-lord/10.png'),
  11: require('../assets/memes/tech-lord/11.png'),
  12: require('../assets/memes/tech-lord/12.png'),
  13: require('../assets/memes/tech-lord/13.png'),
  14: require('../assets/memes/tech-lord/14.png'),
  15: require('../assets/memes/tech-lord/15.png'),
  16: require('../assets/memes/tech-lord/16.png'),
  17: require('../assets/memes/tech-lord/17.png'),
  18: require('../assets/memes/tech-lord/18.png'),
  19: require('../assets/memes/tech-lord/19.png'),
  20: require('../assets/memes/tech-lord/20.png'),
};

// Funzione per ottenere asset Tech Lord
const getTechLordAsset = (number: number) => {
  try {
    return techLordAssets[number as keyof typeof techLordAssets] || null;
  } catch (error) {
    console.warn(`Tech Lord asset not found: ${number}.png`);
    return null;
  }
};

// Funzione per generare array di asset per categoria
const generateMemeAssets = (category: string, count: number = 20): MemeAsset[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    let source = null;
    
    // Per ora solo Tech Lord ha assets veri
    if (category === 'Tech Lord') {
      source = getTechLordAsset(id);
    }
    
    return {
      id,
      source,
      category: category
    };
  });
};

// Export delle collezioni per categoria
export const techLordMemes = generateMemeAssets('Tech Lord');
export const politiciansMemes = generateMemeAssets('Politicians'); 
export const celebrityMemes = generateMemeAssets('Celebrity');
export const boomerVsZMemes = generateMemeAssets('Boomer vs Z');
export const aiVsHumanMemes = generateMemeAssets('AI vs Human');

// Mappa completa delle categorie
export const memeCollections = {
  'Tech Lord': techLordMemes,
  'Politicians': politiciansMemes,
  'Celebrity': celebrityMemes,
  'Boomer vs Z': boomerVsZMemes,
  'AI vs Human': aiVsHumanMemes
};

// Funzione per ottenere i meme di una categoria specifica
export const getMemesByCategory = (category: string): MemeAsset[] => {
  return memeCollections[category as keyof typeof memeCollections] || [];
};
