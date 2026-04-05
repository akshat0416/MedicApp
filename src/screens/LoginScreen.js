import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { validateLogin, saveUserSession } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const LoginScreen = ({ onLoginSuccess, onNavigateToSignup, theme }) => {
  const T = theme || COLORS;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = await validateLogin(email, password);
    setLoading(false);

    if (result.success) {
      const user = {
        ...result.user,
        loggedInAt: new Date().toISOString(),
      };
      await saveUserSession(user);
      onLoginSuccess(user);
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={T.gradientHeader || T.gradientPrimary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={32} color={T.primary} />
          </View>
          <Text style={styles.appName}>MedicApp</Text>
          <Text style={styles.tagline}>Your Health, Our Priority</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <Text style={[styles.welcomeText, { color: T.textPrimary }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: T.textSecondary }]}>Sign in to continue</Text>

        <View style={styles.inputGroup}>
          <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.email ? T.danger : T.border }]}>
            <Ionicons name="mail-outline" size={20} color={errors.email ? T.danger : T.textTertiary} />
            <TextInput
              style={[styles.input, { color: T.textPrimary }]}
              placeholder="Email address"
              placeholderTextColor={T.textTertiary}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: null }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email && <Text style={[styles.errorText, { color: T.danger }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.password ? T.danger : T.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={errors.password ? T.danger : T.textTertiary} />
            <TextInput
              style={[styles.input, { color: T.textPrimary }]}
              placeholder="Password"
              placeholderTextColor={T.textTertiary}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password) setErrors((e) => ({ ...e, password: null }));
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={T.textTertiary}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[styles.errorText, { color: T.danger }]}>{errors.password}</Text>}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
          <LinearGradient
            colors={loading ? ['#CBD5E1', '#94A3B8'] : T.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginGradient}
          >
            {loading ? (
              <Text style={styles.loginText}>Signing in...</Text>
            ) : (
              <Text style={styles.loginText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity style={styles.linkContainer} onPress={onNavigateToSignup}>
          <Text style={[styles.linkText, { color: T.textTertiary }]}>
            Don't have an account?{' '}
            <Text style={[styles.linkHighlight, { color: T.primary }]}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  appName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xxl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.lg,
    ...SHADOWS.colored,
  },
  loginGradient: {
    paddingVertical: SPACING.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  loginText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  linkText: {
    fontSize: FONT_SIZES.md,
  },
  linkHighlight: {
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default LoginScreen;
