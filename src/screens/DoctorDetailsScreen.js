import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import { getBookedSlots } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const DoctorDetailsScreen = ({ doctor, onBack, onBookAppointment, theme }) => {
  const T = theme || COLORS;
  const [imgError, setImgError] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const getTomorrowDate = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  };

  const bookingDate = getTomorrowDate();

  useEffect(() => {
    const loadBookedSlots = async () => {
      const allBooked = await getBookedSlots();
      if (doctor && allBooked[doctor.id]) {
        if (Array.isArray(allBooked[doctor.id])) {
          setBookedSlots(allBooked[doctor.id]);
        } else if (allBooked[doctor.id][bookingDate]) {
          setBookedSlots(allBooked[doctor.id][bookingDate]);
        } else {
          setBookedSlots([]); // explicitly clear
        }
      } else {
        setBookedSlots([]);
      }
    };
    loadBookedSlots();
  }, [doctor]);

  const showFallback = !doctor?.profileImage || imgError;
  const currentAvailableSlots = doctor ? doctor.availableSlots.filter(s => !bookedSlots.includes(s)) : [];

  if (!doctor) return null;

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero */}
        <LinearGradient
          colors={T.gradientHeader || T.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          {showFallback ? (
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }}
              style={[styles.heroImage, { backgroundColor: T.borderLight }]}
            />
          ) : (
            <Image
              source={{ uri: doctor.profileImage }}
              style={styles.heroImage}
              onError={() => setImgError(true)}
            />
          )}
          <Text style={styles.heroName}>{doctor.name}</Text>
          <View style={styles.heroSpecRow}>
            <Ionicons name="medical" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroSpec}>{doctor.specialization}</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: T.surface }]}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: T.textPrimary }]}>{doctor.patients}</Text>
            <Text style={[styles.statLabel, { color: T.textTertiary }]}>Patients</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle, { borderColor: T.borderLight }]}>
            <Text style={[styles.statValue, { color: T.textPrimary }]}>{doctor.experience}</Text>
            <Text style={[styles.statLabel, { color: T.textTertiary }]}>Experience</Text>
          </View>
          <View style={styles.statCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.statValue, { color: T.textPrimary }]}>{doctor.rating}</Text>
            </View>
            <Text style={[styles.statLabel, { color: T.textTertiary }]}>Rating</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>About Doctor</Text>
          <Text style={[styles.descriptionText, { color: T.textSecondary }]}>{doctor.description}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Information</Text>
          <View style={styles.infoGrid}>
            <View style={[styles.infoCard, { backgroundColor: T.surface }]}>
              <View style={[styles.infoIcon, { backgroundColor: T.primaryGhost }]}>
                <Ionicons name="cash-outline" size={20} color={T.primary} />
              </View>
              <Text style={[styles.infoLabel, { color: T.textTertiary }]}>Consultation Fee</Text>
              <Text style={[styles.infoValue, { color: T.textPrimary }]}>{doctor.fee}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: T.surface }]}>
              <View style={[styles.infoIcon, { backgroundColor: T.successLight }]}>
                <Ionicons name="time-outline" size={20} color={T.success} />
              </View>
              <Text style={[styles.infoLabel, { color: T.textTertiary }]}>Available Slots</Text>
              <Text style={[styles.infoValue, { color: T.textPrimary }]}>{currentAvailableSlots.length} slots</Text>
            </View>
          </View>
        </View>

        {/* Available Times */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Available Times</Text>
          <View style={styles.slotsPreview}>
            {currentAvailableSlots.length === 0 ? (
               <Text style={[styles.descriptionText, { color: T.textTertiary, fontStyle: 'italic' }]}>Fully booked for {new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long' })}!</Text>
            ) : (
               <>
                {currentAvailableSlots.slice(0, 4).map((slot, i) => (
                  <View key={i} style={[styles.slotChip, { backgroundColor: T.primaryGhost, borderColor: T.primaryGhostBorder }]}>
                    <Ionicons name="time-outline" size={12} color={T.primary} />
                    <Text style={[styles.slotChipText, { color: T.primary }]}>{slot}</Text>
                  </View>
                ))}
                {currentAvailableSlots.length > 4 && (
                  <View style={[styles.slotChipMore, { backgroundColor: T.primary }]}>
                    <Text style={styles.slotChipMoreText}>+{currentAvailableSlots.length - 4}</Text>
                  </View>
                )}
               </>
            )}
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaSection}>
          <GradientButton title="Book Appointment" onPress={() => onBookAppointment(doctor)} theme={T} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingTop: 56,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: SPACING.md,
  },
  fallbackAvatar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSpecRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.xs,
  },
  heroSpec: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    marginTop: -20,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statCardMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  infoCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
  },
  infoValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 2,
  },
  slotsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  slotChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  slotChipMore: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  slotChipMoreText: {
    fontSize: FONT_SIZES.sm,
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  ctaSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 40,
  },
});

export default DoctorDetailsScreen;
