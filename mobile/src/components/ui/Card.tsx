import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'primary' | 'accent';
  shadow?: boolean;
}

export default function Card({
  children,
  style,
  variant = 'default',
  shadow = true,
}: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { 
          backgroundColor: colors.dark.card,
          borderColor: colors.primary[600],
        };
      case 'accent':
        return { 
          backgroundColor: colors.dark.card,
          borderColor: colors.accent[500],
        };
      default:
        return { 
          backgroundColor: colors.dark.card,
          borderColor: colors.dark.border,
        };
    }
  };

  const shadowStyle = shadow 
    ? (variant === 'primary' ? theme.shadows.primary : theme.shadows.card)
    : {};

  return (
    <View
      style={[
        styles.base,
        getVariantStyle(),
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
  },
});

