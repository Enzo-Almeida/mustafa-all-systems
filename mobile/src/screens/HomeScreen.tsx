import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { visitService } from '../services/visitService';
import { colors, theme } from '../styles/theme';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type HomeNavigation = NavigationProp<Record<string, object | undefined>>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigation>();
  const [hasActiveVisit, setHasActiveVisit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveVisit();
  }, []);

  async function checkActiveVisit() {
    try {
      setLoading(true);
      const response = await visitService.getCurrentVisit();
      setHasActiveVisit(!!response.visit);
    } catch (error: any) {
      // Erros de rede são esperados quando o servidor não está disponível
      // Não logar como erro crítico, apenas como aviso
      if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
        console.log('ℹ️ Servidor não disponível, assumindo nenhuma visita ativa');
      } else {
        console.warn('⚠️ Erro ao verificar visita ativa:', error?.message || error);
      }
      setHasActiveVisit(false);
    } finally {
      setLoading(false);
    }
  }

  function handleStartVisit() {
    navigation.navigate('Stores');
  }

  function handleContinueVisit() {
    navigation.navigate('ActiveVisit');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.title}>Bem-vindo ao Promo Gestão</Text>
      </View>

      {/* Status Card */}
      <Card style={styles.statusCard} variant={hasActiveVisit ? 'primary' : 'default'} shadow>
        <View style={styles.statusContent}>
          <View
            style={[
              styles.statusIcon,
              hasActiveVisit ? styles.statusIconActive : undefined,
            ]}
          >
            <Text style={styles.statusIconText}>
              {hasActiveVisit ? '📍' : '✨'}
            </Text>
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              {hasActiveVisit ? 'Visita em Andamento' : 'Nenhuma Visita Ativa'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {hasActiveVisit
                ? 'Continue sua visita atual ou finalize para iniciar uma nova'
                : 'Inicie uma nova visita para começar a trabalhar'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {hasActiveVisit ? (
          <Button
            variant="accent"
            size="lg"
            onPress={handleContinueVisit}
            style={styles.actionButton}
          >
            Continuar Visita
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onPress={handleStartVisit}
            style={styles.actionButton}
          >
            Iniciar Nova Visita
          </Button>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Resumo do Dia</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard} variant="default" shadow>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Visitas</Text>
          </Card>
          <Card style={styles.statCard} variant="default" shadow>
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Horas</Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.normal,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statusCard: {
    marginBottom: theme.spacing.xl,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.dark.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  statusIconActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderColor: colors.primary[600],
    ...theme.shadows.primary,
  },
  statusIconText: {
    fontSize: 28,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statusSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionContainer: {
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    width: '100%',
  },
  statsContainer: {
    marginTop: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  statValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.primary[400],
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: colors.text.secondary,
  },
});

