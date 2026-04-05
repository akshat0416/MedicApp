import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import doctors, { specializations } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const HomeScreen = ({ user, onDoctorPress, onMyAppointments, onProfile, onLogout, theme }) => {
  const T = theme || COLORS;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const filteredDoctors = useMemo(() => {
    let result = doctors;
    if (selectedSpec !== 'All') {
      result = result.filter((d) => d.specialization === selectedSpec);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedSpec]);

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => onDoctorPress(item)} theme={T} />
        )}
        ListHeaderComponent={
          <HomeHeader
            user={user}
            theme={T}
            onMyAppointments={onMyAppointments}
            onProfile={onProfile}
            onLogout={onLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSpec={selectedSpec}
            setSelectedSpec={setSelectedSpec}
            filteredDoctorsLength={filteredDoctors.length}
            onLogoutPress={() => setShowLogoutModal(true)}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={T.textTertiary} />
            <Text style={[styles.emptyText, { color: T.textSecondary }]}>No doctors found</Text>
            <Text style={[styles.emptySubtext, { color: T.textTertiary }]}>Try a different search or filter</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Custom Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: T.surface }]}>
            <View style={[styles.modalHeader, { backgroundColor: T.dangerLight }]}>
              <View style={[styles.modalIconCircle, { backgroundColor: T.danger }]}>
                <Ionicons name="log-out-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.modalTitle, { color: T.textPrimary }]}>Logout</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalMessage, { color: T.textSecondary }]}>
                Are you sure you want to logout?
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: T.border }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: T.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
              >
                <LinearGradient
                  colors={[T.danger, '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const HomeHeader = React.memo(({ 
  user, 
  theme: T, 
  onMyAppointments, 
  onProfile, 
  onLogoutPress,
  searchQuery, 
  setSearchQuery, 
  selectedSpec, 
  setSelectedSpec, 
  filteredDoctorsLength 
}) => (
  <View>
    {/* Top Section */}
    <LinearGradient
      colors={T.gradientHeader || T.gradientPrimary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.topSection}
    >
      <View style={styles.topRow}>
        <View style={styles.greetingRow}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatarCircle} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'} 👋</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onMyAppointments}>
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onProfile}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]} onPress={onLogoutPress}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: T.surface }]}>
        <Ionicons name="search" size={18} color={T.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: T.textPrimary }]}
          placeholder="Search doctors, specializations..."
          placeholderTextColor={T.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={T.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>

    {/* Quick Stats */}
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: T.surface }]}>
        <View style={[styles.statIcon, { backgroundColor: T.primaryGhost }]}>
          <Ionicons name="people" size={20} color={T.primary} />
        </View>
        <Text style={[styles.statNumber, { color: T.textPrimary }]}>{doctors.length}</Text>
        <Text style={[styles.statLabel, { color: T.textTertiary }]}>Doctors</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: T.surface }]}>
        <View style={[styles.statIcon, { backgroundColor: T.successLight }]}>
          <Ionicons name="medical" size={20} color={T.success} />
        </View>
        <Text style={[styles.statNumber, { color: T.textPrimary }]}>{specializations.length - 1}</Text>
        <Text style={[styles.statLabel, { color: T.textTertiary }]}>Specializations</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: T.surface }]}>
        <View style={[styles.statIcon, { backgroundColor: T.warningLight }]}>
          <Ionicons name="star" size={20} color={T.warning} />
        </View>
        <Text style={[styles.statNumber, { color: T.textPrimary }]}>4.8</Text>
        <Text style={[styles.statLabel, { color: T.textTertiary }]}>Avg Rating</Text>
      </View>
    </View>

    {/* Filter Chips */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsContainer}
    >
      {specializations.map((spec) => (
        <TouchableOpacity
          key={spec}
          style={[
            styles.chip,
            { backgroundColor: T.surface, borderColor: T.border },
            selectedSpec === spec && { backgroundColor: T.primary, borderColor: T.primary },
          ]}
          onPress={() => setSelectedSpec(spec)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              { color: T.textSecondary },
              selectedSpec === spec && styles.chipTextActive,
            ]}
          >
            {spec}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {/* Section Title */}
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>
        {selectedSpec === 'All' ? 'All Doctors' : selectedSpec}
      </Text>
      <Text style={[styles.sectionCount, { color: T.textTertiary }]}>{filteredDoctorsLength} found</Text>
    </View>
  </View>
));



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  topSection: {
    paddingTop: 56,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  topActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xl,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: -12,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  chipsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    marginRight: SPACING.sm,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  sectionCount: {
    fontSize: FONT_SIZES.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  // Modal styles
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
  modalCancelBtn: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
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

export default HomeScreen;
