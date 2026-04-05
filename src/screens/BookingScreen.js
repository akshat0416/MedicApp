import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import { saveAppointment, getBookedSlots } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const BookingScreen = ({ doctor, user, onBack, onBookingComplete, theme }) => {
  const T = theme || COLORS;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const getTomorrowDate = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  };

  const getTomorrowFormatted = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [bookingDate] = useState(getTomorrowDate());
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    loadBookedSlots();
  }, []);

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

  if (!doctor) return null;

  const showFallback = !doctor.profileImage || imgError;

  const handleSelectSlot = (slot) => {
    if (bookedSlots.includes(slot)) return; // Already booked
    setSelectedSlot(slot);
  };

  const handleBookPress = () => {
    if (!selectedSlot) return;
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const appointment = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      profileImage: doctor.profileImage,
      date: bookingDate,
      formattedDate: getTomorrowFormatted(),
      timeSlot: selectedSlot,
      fee: doctor.fee,
    };

    const result = await saveAppointment(appointment, user.email);
    setLoading(false);
    setShowConfirmModal(false);

    if (result) {
      onBookingComplete();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Doctor Summary */}
        <View style={[styles.doctorCard, { backgroundColor: T.surface }]}>
          {showFallback ? (
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }}
              style={[styles.doctorImage, { backgroundColor: T.borderLight }]}
            />
          ) : (
            <Image
              source={{ uri: doctor.profileImage }}
              style={[styles.doctorImage, { backgroundColor: T.borderLight }]}
              onError={() => setImgError(true)}
            />
          )}
          <View style={styles.doctorInfo}>
            <Text style={[styles.doctorName, { color: T.textPrimary }]}>{doctor.name}</Text>
    <View style={styles.specRow}>
              <Ionicons name="medical" size={13} color={T.primary} />
              <Text style={[styles.specText, { color: T.primary }]}>{doctor.specialization}</Text>
            </View>
            <Text style={[styles.feeText, { color: T.textSecondary }]}>Fee: {doctor.fee}</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Select Date</Text>
          <View style={[styles.dateCard, { backgroundColor: T.primaryGhost, borderColor: T.primaryGhostBorder }]}>
            <Ionicons name="calendar" size={24} color={T.primary} />
            <Text style={[styles.dateText, { color: T.primary }]}>{getTomorrowFormatted()}</Text>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Select Time Slot</Text>
          <Text style={[styles.sectionSubtitle, { color: T.textTertiary }]}>
            Choose your preferred time for the appointment
          </Text>

          <View style={styles.slotsGrid}>
            {doctor.availableSlots.filter((slot) => !bookedSlots.includes(slot)).length === 0 ? (
              <Text style={[styles.noSlotsText, { color: T.textTertiary }]}>No available slots for this date.</Text>
            ) : (
              doctor.availableSlots
                .filter((slot) => !bookedSlots.includes(slot))
                .map((slot, index) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.slotCard,
                        { backgroundColor: T.surface, borderColor: T.border },
                        isSelected && { backgroundColor: T.primary, borderColor: T.primary },
                      ]}
                      onPress={() => handleSelectSlot(slot)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={isSelected ? '#FFFFFF' : T.primary}
                      />
                      <Text
                        style={[
                          styles.slotText,
                          { color: T.textPrimary },
                          isSelected && { color: '#FFFFFF' },
                        ]}
                      >
                        {slot}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkCircle}>
                          <Ionicons name="checkmark" size={12} color={T.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
            )}
          </View>
        </View>

        {/* Summary */}
        {selectedSlot && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: T.textPrimary }]}>Booking Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: T.surface }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Doctor</Text>
                <Text style={[styles.summaryValue, { color: T.textPrimary }]}>{doctor.name}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: T.borderLight }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Specialization</Text>
                <Text style={[styles.summaryValue, { color: T.textPrimary }]}>{doctor.specialization}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: T.borderLight }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Date</Text>
                <Text style={[styles.summaryValue, { color: T.primary }]}>{getTomorrowFormatted()}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: T.borderLight }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Time</Text>
                <Text style={[styles.summaryValue, { color: T.primary }]}>{selectedSlot}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: T.borderLight }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Fee</Text>
                <Text style={[styles.summaryValue, { color: T.success }]}>{doctor.fee}</Text>
              </View>
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaSection}>
          <GradientButton
            title={loading ? 'Booking...' : 'Confirm Booking'}
            onPress={handleBookPress}
            loading={loading}
            disabled={!selectedSlot}
            theme={T}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: T.surface }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { backgroundColor: T.primaryGhost }]}>
              <View style={[styles.modalIconCircle, { backgroundColor: T.primary }]}>
                <Ionicons name="calendar-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.modalTitle, { color: T.textPrimary }]}>Confirm Appointment</Text>
              <Text style={[styles.modalSubtitle, { color: T.textTertiary }]}>
                Please review the details below
              </Text>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Ionicons name="person-outline" size={18} color={T.textTertiary} />
                <Text style={[styles.modalLabel, { color: T.textTertiary }]}>Doctor</Text>
                <Text style={[styles.modalValue, { color: T.textPrimary }]}>{doctor.name}</Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: T.borderLight }]} />
              <View style={styles.modalRow}>
                <Ionicons name="medical-outline" size={18} color={T.textTertiary} />
                <Text style={[styles.modalLabel, { color: T.textTertiary }]}>Specialty</Text>
                <Text style={[styles.modalValue, { color: T.textPrimary }]}>{doctor.specialization}</Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: T.borderLight }]} />
              <View style={styles.modalRow}>
                <Ionicons name="calendar-outline" size={18} color={T.textTertiary} />
                <Text style={[styles.modalLabel, { color: T.textTertiary }]}>Date</Text>
                <Text style={[styles.modalValue, { color: T.primary, fontWeight: FONT_WEIGHTS.bold }]}>{getTomorrowFormatted()}</Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: T.borderLight }]} />
              <View style={styles.modalRow}>
                <Ionicons name="time-outline" size={18} color={T.textTertiary} />
                <Text style={[styles.modalLabel, { color: T.textTertiary }]}>Time</Text>
                <Text style={[styles.modalValue, { color: T.primary, fontWeight: FONT_WEIGHTS.bold }]}>{selectedSlot}</Text>
              </View>
              <View style={[styles.modalDivider, { backgroundColor: T.borderLight }]} />
              <View style={styles.modalRow}>
                <Ionicons name="cash-outline" size={18} color={T.textTertiary} />
                <Text style={[styles.modalLabel, { color: T.textTertiary }]}>Fee</Text>
                <Text style={[styles.modalValue, { color: T.success, fontWeight: FONT_WEIGHTS.bold }]}>{doctor.fee}</Text>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: T.border }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: T.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirmBooking} disabled={loading}>
                <LinearGradient
                  colors={loading ? ['#CBD5E1', '#94A3B8'] : T.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>{loading ? 'Booking...' : 'Confirm'}</Text>
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
  doctorCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fallbackAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  specText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  feeText: {
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  dateText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  noSlotsText: {
    fontSize: FONT_SIZES.md,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  slotCard: {
    width: '30%',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    ...SHADOWS.sm,
  },
  slotCardBooked: {
    opacity: 0.6,
  },
  slotText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: 6,
  },
  bookedLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  divider: {
    height: 1,
  },
  ctaSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 40,
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
  modalSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  modalBody: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  modalLabel: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
  },
  modalValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  modalDivider: {
    height: 1,
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.xl,
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

export default BookingScreen;
