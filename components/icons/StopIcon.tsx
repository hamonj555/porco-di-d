import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

interface StopIconProps {
  size?: number;
  color?: string;
}

const StopIcon: React.FC<StopIconProps> = ({ size = 24, color = '#FF6B35' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      {/* Cerchio arancio SEMPRE */}
      <Circle cx="30" cy="30" r="28" fill="#FF6B35" />
      {/* Quadrato bianco al centro */}
      <Rect x="20" y="20" width="20" height="20" rx="2" fill="white" />
    </Svg>
  );
};

export default StopIcon;