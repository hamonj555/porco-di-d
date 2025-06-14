import React from 'react';
import { View, StyleSheet } from 'react-native';
import MediaShareButton from './MediaShareButton';

import MediaDeleteButton from './MediaDeleteButton';
import MediaSaveButton from './MediaSaveButton';
import { colors } from '@/constants/colors';

interface MediaControlBarProps {
  style?: any;
}

/**
 * Barra di controllo per i media che contiene i pulsanti per condividere, modificare ed eliminare
 */
const MediaControlBar: React.FC<MediaControlBarProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>

      <MediaShareButton size={20} />
      <MediaSaveButton size={20} />
      <MediaDeleteButton size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    padding: 4,
    width: 210,
    height: 52,
  },
});

export default MediaControlBar;