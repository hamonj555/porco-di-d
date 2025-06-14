import React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { View, Text } from 'react-native';

interface MockyLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const MockyLogo: React.FC<MockyLogoProps> = ({ 
  width = 100, 
  height = 30, 
  color = '#FF0033' 
}) => {
  // Sostituiamo l'immagine con testo semplice per evitare errori
  return (
    <View style={{ width, height, justifyContent: 'center' }}>
      <Text style={{ color, fontSize: 20, fontWeight: 'bold' }}>MOCKED</Text>
    </View>
  );
};

export default MockyLogo;