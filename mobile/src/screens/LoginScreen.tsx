import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, theme } from '../styles/theme';
import Button from '../components/ui/Button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Tentando fazer login...');
      console.log('📧 Email:', email);
      await login(email, password);
      console.log('✅ Login bem-sucedido!');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Erro completo:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response) {
        // Erro da API (servidor respondeu com erro)
        errorMessage = error.response.data?.message || `Erro ${error.response.status}: ${error.response.statusText}`;
        console.error('❌ Resposta da API:', error.response.data);
      } else if (error.request) {
        // Erro de rede (sem resposta do servidor)
        errorMessage = 'Não foi possível conectar ao servidor.\n\nVerifique:\n• Se o backend está rodando\n• Se a URL da API está correta no .env\n• Se o celular e computador estão na mesma rede Wi-Fi';
        console.error('❌ Sem resposta do servidor:', error.request);
      } else {
        // Outro erro
        errorMessage = error.message || 'Erro desconhecido';
        console.error('❌ Erro:', error.message);
      }
      
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo/Ícone */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Promo Gestão</Text>
        <Text style={styles.subtitle}>Sistema de Gestão de Visitas</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.text.tertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Button
          variant="primary"
          size="lg"
          isLoading={loading}
          onPress={handleLogin}
          style={styles.button}
        >
          Entrar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius['2xl'],
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary[600],
    ...theme.shadows.primaryGlow,
    padding: theme.spacing.md,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.dark.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.dark.card,
  },
  button: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
});

