import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface ControlButtonProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'transparent';
}

const ControlButton: React.FC<ControlButtonProps> = ({
  onPress,
  label,
  disabled = false,
  size = 'medium',
  variant = 'transparent',
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: 16 };
      case 'large':
        return { width: 60, height: 60, fontSize: 24 };
      default:
        return { width: 50, height: 50, fontSize: 20 };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.text,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.text,
        };
      default:
        return {
          backgroundColor: 'transparent',
          textColor: colors.textSecondary,
        };
    }
  };

  const sizeStyle = getSize();
  const variantStyle = getVariantStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: sizeStyle.width,
          height: sizeStyle.height,
          backgroundColor: variantStyle.backgroundColor,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          { fontSize: sizeStyle.fontSize, color: variantStyle.textColor },
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textDisabled,
  },
});

export default ControlButton;