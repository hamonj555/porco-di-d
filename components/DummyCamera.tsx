import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

// Questo componente è un sostituto temporaneo del componente Camera
// che non richiede expo-camera

interface DummyCameraProps {
  onClose: () => void;
}

const DummyCamera: React.FC<DummyCameraProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.text}>Fotocamera temporaneamente non disponibile</Text>
        <Text style={styles.subText}>Stiamo lavorando per risolvere il problema</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Torna indietro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: '80%',
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary || '#7C4DFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DummyCamera;