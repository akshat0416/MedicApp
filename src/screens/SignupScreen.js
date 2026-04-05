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
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const SignupScreen = ({ onSignupSuccess, onNavigateToLogin, theme }) => {
  const T = theme || COLORS;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = await registerUser(name, email, password);
    setLoading(false);
    if (result.success) {
      Alert.alert('🎉 Account Created!', 'You can now sign in with your credentials.', [
        { text: 'Sign In', onPress: () => onSignupSuccess() },
      ]);
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
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
          <Text style={styles.tagline}>Create Your Account</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.welcomeText, { color: T.textPrimary }]}>Get Started</Text>
          <Text style={[styles.subtitle, { color: T.textSecondary }]}>Sign up to book appointments</Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.name ? T.danger : T.border }]}>
              <Ionicons name="person-outline" size={20} color={errors.name ? T.danger : T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                placeholder="Full Name"
                placeholderTextColor={T.textTertiary}
                value={name}
                onChangeText={(t) => { setName(t); clearError('name'); }}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={[styles.errorText, { color: T.danger }]}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.email ? T.danger : T.border }]}>
              <Ionicons name="mail-outline" size={20} color={errors.email ? T.danger : T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                placeholder="Email address"
                placeholderTextColor={T.textTertiary}
                value={email}
                onChangeText={(t) => { setEmail(t); clearError('email'); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && <Text style={[styles.errorText, { color: T.danger }]}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.password ? T.danger : T.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={errors.password ? T.danger : T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                placeholder="Password (min 6 chars)"
                placeholderTextColor={T.textTertiary}
                value={password}
                onChangeText={(t) => { setPassword(t); clearError('password'); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={T.textTertiary} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={[styles.errorText, { color: T.danger }]}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: errors.confirmPassword ? T.danger : T.border }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={errors.confirmPassword ? T.danger : T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                placeholder="Confirm Password"
                placeholderTextColor={T.textTertiary}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={T.textTertiary} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={[styles.errorText, { color: T.danger }]}>{errors.confirmPassword}</Text>}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading} activeOpacity={0.8}>
            <LinearGradient
              colors={loading ? ['#CBD5E1', '#94A3B8'] : T.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupGradient}
            >
              <Text style={styles.signupText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity style={styles.linkContainer} onPress={onNavigateToLogin}>
            <Text style={[styles.linkText, { color: T.textTertiary }]}>
              Already have an account?{' '}
              <Text style={[styles.linkHighlight, { color: T.primary }]}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 56,
    paddingBottom: 40,
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
    paddingTop: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.md,
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
  signupButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginTop: SPACING.lg,
    ...SHADOWS.colored,
  },
  signupGradient: {
    paddingVertical: SPACING.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  signupText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  linkText: {
    fontSize: FONT_SIZES.md,
  },
  linkHighlight: {
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default SignupScreen;
