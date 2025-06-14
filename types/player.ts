// Definizioni di tipi per il player e gli effetti

export type EffectType = 'ALL' | 'AUDIO' | 'VIDEO' | 'MEME';

export type MediaMode = 'AUDIO' | 'VIDEO' | 'MEME' | 'IMAGE' | 'AI' | 'Audio' | 'Video' | 'Image' | 'Meme' | 'AI';

export interface MediaEffect {
  id: string;
  name: string;
  type: EffectType;
  category: string;
  description: string;
  icon?: string;
  color?: string;
}
