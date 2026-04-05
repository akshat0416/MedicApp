import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveUserProfile, getUserProfile, saveUserSession } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const ProfileScreen = ({ user, onBack, isDarkMode, onToggleDarkMode, theme }) => {
  const T = theme || COLORS;
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getUserProfile(email);
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.mobile) setMobile(profile.mobile);
      if (profile.gender) setGender(profile.gender);
      if (profile.profilePic) setProfilePic(profile.profilePic);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const profile = { name: name.trim(), email, mobile, gender, profilePic: profilePic.trim() };
    await saveUserProfile(email, profile);

    // Update session name and pic too
    const updatedUser = { ...user, name: name.trim(), profilePic: profilePic.trim() };
    await saveUserSession(updatedUser);

    setSaving(false);
    setSaveModalVisible(true);
  };


  const initial = name ? name[0].toUpperCase() : 'U';

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={T.gradientHeader || T.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          {profilePic ? (
             <Image source={{ uri: profilePic }} style={[styles.avatarCircle, { borderColor: T.primary }]} />
          ) : (
            <View style={[styles.avatarCircle, { backgroundColor: T.primaryGhost, borderColor: T.primary }]}>
              <Text style={[styles.avatarText, { color: T.primary }]}>{initial}</Text>
            </View>
          )}
          <Text style={[styles.avatarName, { color: T.textPrimary }]}>{name || 'User'}</Text>
          <Text style={[styles.avatarEmail, { color: T.textTertiary }]}>{email}</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Personal Information</Text>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: T.textSecondary }]}>Full Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: T.border }]}>
              <Ionicons name="person-outline" size={18} color={T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={T.textTertiary}
              />
            </View>
          </View>

          {/* Email (read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: T.textSecondary }]}>Email</Text>
            <View style={[styles.inputWrapper, styles.readOnly, { backgroundColor: T.surfaceElevated, borderColor: T.border }]}>
              <Ionicons name="mail-outline" size={18} color={T.textTertiary} />
              <Text style={[styles.readOnlyText, { color: T.textTertiary }]}>{email}</Text>
            </View>
          </View>

          {/* Mobile */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: T.textSecondary }]}>Mobile Number</Text>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: T.border }]}>
              <Ionicons name="call-outline" size={18} color={T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                placeholderTextColor={T.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Profile Picture URL */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: T.textSecondary }]}>Profile Image URL</Text>
            <View style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: T.border }]}>
              <Ionicons name="image-outline" size={18} color={T.textTertiary} />
              <TextInput
                style={[styles.input, { color: T.textPrimary }]}
                value={profilePic}
                onChangeText={setProfilePic}
                placeholder="Enter image URL"
                placeholderTextColor={T.textTertiary}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: T.textSecondary }]}>Gender</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, { backgroundColor: T.surface, borderColor: T.border }]}
              onPress={() => setShowGenderPicker(!showGenderPicker)}
            >
              <Ionicons name="transgender-outline" size={18} color={T.textTertiary} />
              <Text style={[styles.input, { color: gender ? T.textPrimary : T.textTertiary, paddingVertical: Platform.OS === 'ios' ? 0 : 4 }]}>
                {gender || 'Select gender'}
              </Text>
              <Ionicons name={showGenderPicker ? 'chevron-up' : 'chevron-down'} size={18} color={T.textTertiary} />
            </TouchableOpacity>
            {showGenderPicker && (
              <View style={[styles.genderPicker, { backgroundColor: T.surface, borderColor: T.border }]}>
                {GENDER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.genderOption, gender === opt && { backgroundColor: T.primaryGhost }]}
                    onPress={() => { setGender(opt); setShowGenderPicker(false); }}
                  >
                    <Text style={[styles.genderOptionText, { color: gender === opt ? T.primary : T.textPrimary }]}>{opt}</Text>
                    {gender === opt && <Ionicons name="checkmark" size={16} color={T.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Preferences</Text>
          <View style={[styles.settingRow, { backgroundColor: T.surface, borderColor: T.border }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: T.primaryGhost }]}>
                <Ionicons name="moon" size={18} color={T.primary} />
              </View>
              <View>
                <Text style={[styles.settingLabel, { color: T.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.settingDesc, { color: T.textTertiary }]}>Switch to dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleDarkMode}
              trackColor={{ false: '#CBD5E1', true: T.primaryLight }}
              thumbColor={isDarkMode ? T.primary : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            <LinearGradient
              colors={saving ? ['#CBD5E1', '#94A3B8'] : T.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Saved Modal */}
      <Modal
        visible={saveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: T.surface }]}>
            <View style={[styles.modalHeader, { backgroundColor: T.successLight }]}>
              <View style={[styles.modalIconCircle, { backgroundColor: T.success }]}>
                <Ionicons name="checkmark-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.modalTitle, { color: T.textPrimary }]}>Profile Updated</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalMessage, { color: T.textSecondary }]}>
                Your profile information has been saved successfully.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => setSaveModalVisible(false)}
              >
                <LinearGradient
                  colors={[T.success, '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>Okay</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 52,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
  },
  avatarName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  avatarEmail: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  formSection: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
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
  readOnly: {
    opacity: 0.7,
  },
  readOnlyText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
    paddingVertical: Platform.OS === 'ios' ? 0 : 4,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
  genderPicker: {
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  genderOptionText: {
    fontSize: FONT_SIZES.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  settingDesc: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  actionSection: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  saveButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.colored,
  },
  saveGradient: {
    paddingVertical: SPACING.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  saveText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  modalContainer: {
    width: '100%',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalBody: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.xl,
    paddingTop: 0,
    gap: SPACING.md,
  },
  modalConfirmBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  modalConfirmText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
