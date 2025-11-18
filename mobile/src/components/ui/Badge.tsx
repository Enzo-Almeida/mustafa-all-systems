import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, theme } from '../../styles/theme';

interface BadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Badge({
  variant = 'primary',
  size = 'md',
  children,
  style,
}: BadgeProps) {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: { 
            backgroundColor: 'rgba(124, 58, 237, 0.2)', // primary[600] com 20% opacity
            borderWidth: 1,
            borderColor: colors.primary[600],
          },
          text: { color: colors.primary[400] },
        };
      case 'accent':
        return {
          container: { 
            backgroundColor: 'rgba(245, 158, 11, 0.2)', // accent[500] com 20% opacity
            borderWidth: 1,
            borderColor: colors.accent[500],
          },
          text: { color: colors.accent[400] },
        };
      case 'success':
        return {
          container: { 
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderWidth: 1,
            borderColor: colors.success,
          },
          text: { color: colors.success },
        };
      case 'warning':
        return {
          container: { 
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderWidth: 1,
            borderColor: colors.warning,
          },
          text: { color: colors.warning },
        };
      case 'error':
        return {
          container: { 
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderWidth: 1,
            borderColor: colors.error,
          },
          text: { color: colors.error },
        };
      case 'gray':
        return {
          container: { 
            backgroundColor: 'rgba(55, 65, 81, 0.4)', // gray[700] com 40% opacity
            borderWidth: 1,
            borderColor: colors.gray[600],
          },
          text: { color: colors.text.secondary },
        };
      default:
        return {
          container: { 
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            borderWidth: 1,
            borderColor: colors.primary[600],
          },
          text: { color: colors.primary[400] },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
          },
          text: { fontSize: theme.typography.fontSize.xs },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
          },
          text: { fontSize: theme.typography.fontSize.base },
        };
      default:
        return {
          container: {
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
          },
          text: { fontSize: theme.typography.fontSize.sm },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          { fontWeight: theme.typography.fontWeight.medium },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});

