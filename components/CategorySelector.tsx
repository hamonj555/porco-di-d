import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { VIDEO_CATEGORIES, VideoCategoryId } from '@/constants/videoCategories';
import { colors } from '@/constants/colors';
import EffectsForCategory from './EffectsForCategory';

const { width } = Dimensions.get('window');

interface CategorySelectorProps {
  selectedCategory?: VideoCategoryId;
  onCategorySelect: (categoryId: VideoCategoryId) => void;
  onEffectPress?: (effectId: string) => void;
  activeEffects?: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  onEffectPress = () => {},
  activeEffects = [],
}) => {
  const [animatedValues] = useState(
    VIDEO_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = new Animated.Value(selectedCategory === category.id ? 1 : 0.85);
      return acc;
    }, {} as Record<VideoCategoryId, Animated.Value>)
  );

  const handleCategoryPress = (categoryId: VideoCategoryId) => {
    // Animate all categories
    VIDEO_CATEGORIES.forEach(category => {
      Animated.spring(animatedValues[category.id], {
        toValue: categoryId === category.id ? 1 : 0.85,
        useNativeDriver: true,
        tension: 200,
        friction: 7,
      }).start();
    });

    onCategorySelect(categoryId);
  };

  const renderCategory = (category: typeof VIDEO_CATEGORIES[0], index: number) => {
    const isSelected = selectedCategory === category.id;
    const animatedValue = animatedValues[category.id];

    return (
      <Animated.View
        key={category.id}
        style={[
          styles.categoryContainer,
          {
            transform: [{ scale: animatedValue }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleCategoryPress(category.id)}
          activeOpacity={1}
          style={styles.categoryTouchable}
          disabled={true}
        >
          <LinearGradient
            colors={category.gradientColors}
            style={[
              styles.categoryButton,
              {
                shadowColor: category.shadowColor,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 8,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Emoji */}
            <Text style={styles.emojiSelected}>
              {category.emoji}
            </Text>

            {/* Nome categoria */}
            <Text
              style={[
                styles.categoryName,
                { color: '#FFFFFF', fontWeight: '700' },
              ]}
              numberOfLines={1}
            >
              {category.name}
            </Text>

            {/* Bordo per categoria selezionata */}
            <View
              style={[
                styles.selectedBorder,
                { borderColor: category.color },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={115}
        snapToAlignment="start"
      >
        {VIDEO_CATEGORIES.map((category, index) => (
          <View key={category.id} style={styles.categoryWithEffects}>
            {renderCategory(category, index)}
            <EffectsForCategory
              selectedCategory={category.id}
              onEffectPress={onEffectPress}
              activeEffects={activeEffects}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryContainer: {
    marginRight: 10,
  },
  categoryWithEffects: {
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTouchable: {
    position: 'relative',
  },
  categoryButton: {
    width: 140,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  emoji: {
    fontSize: 16,
    marginRight: 5,
  },
  emojiSelected: {
    fontSize: 26,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
    flex: 1,
  },
  selectedBorder: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2,
    borderRadius: 16,
    opacity: 0.8,
  },
});

export default CategorySelector;
