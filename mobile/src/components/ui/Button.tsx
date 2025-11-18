import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, theme } from '../../styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onPress,
  children,
  style,
}: ButtonProps) {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary[600],
            ...theme.shadows.primary,
          },
          text: { color: colors.text.primary },
        };
      case 'accent':
        return {
          container: {
            backgroundColor: colors.accent[500],
            ...theme.shadows.accent,
          },
          text: { color: colors.text.primary },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary[600],
          },
          text: { color: colors.primary[400] },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: colors.primary[400] },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
            ...theme.shadows.md,
          },
          text: { color: colors.text.primary },
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary[600],
            ...theme.shadows.primary,
          },
          text: { color: colors.text.primary },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
          },
          text: { fontSize: theme.typography.fontSize.sm },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: theme.spacing.lg,
            paddingHorizontal: theme.spacing.xl,
          },
          text: { fontSize: theme.typography.fontSize.lg },
        };
      default:
        return {
          container: {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
          },
          text: { fontSize: theme.typography.fontSize.base },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variantStyles.text.color}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            variantStyles.text,
            sizeStyles.text,
            { fontWeight: theme.typography.fontWeight.semibold },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

