import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePlayerStore } from '@/store/player-store';
import { colors } from '@/constants/colors';

const SpeedControl = () => {
  const { speed, increaseSpeed, decreaseSpeed } = usePlayerStore();
  const scaleUpAnim = useRef(new Animated.Value(1)).current;
  const scaleDownAnim = useRef(new Animated.Value(1)).current;

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const animateButton = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.6,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playTapFeedback = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silentemente ignora errori haptics
    }
  };

  const handlePressIn = (increase: boolean) => {
    if (longPressTimerRef.current) {
      clearInterval(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    longPressTimerRef.current = setInterval(() => {
      if (increase) {
        increaseSpeed(10);
      } else {
        decreaseSpeed(10);
      }
    }, 300);
  };

  const handlePressOut = () => {
    if (longPressTimerRef.current) {
      clearInterval(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[{ transform: [{ scale: scaleUpAnim }] }]}>
        <Pressable 
          style={styles.button}
          onPress={() => {
            increaseSpeed(1);
            animateButton(scaleUpAnim);
            playTapFeedback();
          }}
          onPressIn={() => handlePressIn(true)}
          onPressOut={handlePressOut}
          delayLongPress={300}
        >
          <Ionicons name="chevron-up-outline" size={20} color={colors.controlGreen} />
        </Pressable>
      </Animated.View>

      <View style={styles.valueContainer}>
        <View style={styles.valueRow}>
          <Ionicons name="timer" size={16} color="white" style={styles.icon} />
          <Text style={styles.valueText}>{speed}%</Text>
        </View>
      </View>

      <Animated.View style={[{ transform: [{ scale: scaleDownAnim }] }]}>
        <Pressable 
          style={styles.button}
          onPress={() => {
            decreaseSpeed(1);
            animateButton(scaleDownAnim);
            playTapFeedback();
          }}
          onPressIn={() => handlePressIn(false)}
          onPressOut={handlePressOut}
          delayLongPress={300}
        >
          <Ionicons name="chevron-down-outline" size={20} color={colors.controlGreen} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  valueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    width: 80,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default SpeedControl;
