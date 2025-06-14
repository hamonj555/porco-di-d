import React from 'react';
import { Svg, Path, G, Rect, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const CinematicZoomIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M8 8l8 8M16 8l-8 8"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export const GlitchTransitionIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="3" fill={color} />
    <Rect x="2" y="11" width="20" height="3" fill={color} />
    <Rect x="2" y="16" width="20" height="3" fill={color} />
    <Rect x="18" y="6" width="4" height="3" fill="#ff0000" />
    <Rect x="0" y="11" width="4" height="3" fill="#00ff00" />
  </Svg>
);

export const VhsEffectIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="8" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="16" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <Rect x="10" y="2" width="4" height="4" fill={color} />
  </Svg>
);

export const NoirFilterIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" fill={color} />
  </Svg>
);

export const ColorBoostIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" fill="#ff0000" />
    <Circle cx="12" cy="12" r="6" stroke="#00ff00" strokeWidth="2" fill="none" />
    <Circle cx="12" cy="12" r="9" stroke="#0000ff" strokeWidth="2" fill="none" />
  </Svg>
);

export const SepiaFilterIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="9" cy="9" r="2" fill={color} />
    <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" />
  </Svg>
);

export const AnimatedTitlesIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 7h16M4 12h16M4 17h10" stroke={color} strokeWidth="2" />
    <Path d="M20 17l2-2-2-2" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const StickersEmojisIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="8" cy="10" r="1" fill={color} />
    <Circle cx="16" cy="10" r="1" fill={color} />
    <Path d="M8 16s2 2 4 2 4-2 4-2" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const LightEffectsIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill={color} />
    <Path d="M19 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill={color} />
    <Path d="M5 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill={color} />
  </Svg>
);

export const InvertColorsIcon = ({ size = 24, color = 'white' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M12 2A10 10 0 0 1 12 22" fill={color} />
    <Path d="M12 22A10 10 0 0 1 12 2" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);
