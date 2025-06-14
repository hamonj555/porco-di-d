import React from 'react';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

interface SkullRecordIconProps {
  size?: number;
  skullColor?: string;
  eyeColor?: string;
  outlineColor?: string;
  centerColor?: string;
}

export const SkullRecordIcon = ({ 
  size = 48, 
  skullColor = '#000000',
  eyeColor = '#FF0000', 
  outlineColor = '#FF0000',
  centerColor = '#FF0000'
}: SkullRecordIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    {/* Base circle (record) */}
    <Circle 
      cx="128" 
      cy="128" 
      r="100" 
      fill={skullColor} 
      stroke={outlineColor} 
      strokeWidth="4"
    />
    
    {/* Skull eyes */}
    <Circle cx="100" cy="110" r="12" fill={eyeColor} />
    <Circle cx="156" cy="110" r="12" fill={eyeColor} />
    
    {/* Skull mouth/grin */}
    <Path 
      d="M110 150 Q128 170 146 150" 
      stroke={eyeColor} 
      strokeWidth="3" 
      fill="none"
    />
    
    {/* Record center hole */}
    <Circle 
      cx="128" 
      cy="128" 
      r="20" 
      fill="#121212" 
      stroke={outlineColor} 
      strokeWidth="2"
    />
    
    {/* Center dot */}
    <Circle cx="128" cy="128" r="8" fill={centerColor} />
  </Svg>
);

interface ClassicPlayIconProps {
  size?: number;
  isPlaying?: boolean;
}

// Export alias per compatibilità
export const SkullPlayIcon = SkullRecordIcon;

export const ClassicPlayIcon = ({ 
  size = 48, 
  isPlaying = false
}: ClassicPlayIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Background circle */}
    <Circle 
      cx="50" 
      cy="50" 
      r="45" 
      fill={isPlaying ? '#FFFFFF' : '#00FF00'}
      stroke={isPlaying ? '#000000' : 'none'}
      strokeWidth={isPlaying ? '3' : '0'}
    />
    
    {/* Play/Pause symbol */}
    {isPlaying ? (
      // Pause: Black bars on white
      <>
        <Rect x="35" y="25" width="8" height="50" fill="#000000" />
        <Rect x="57" y="25" width="8" height="50" fill="#000000" />
      </>
    ) : (
      // Play: White triangle on green
      <Path d="M35 25 L35 75 L75 50 Z" fill="#FFFFFF" />
    )}
  </Svg>
);
