import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const AppointmentCard = ({ appointment, onCancel, theme }) => {
  const T = theme || COLORS;

  const handleCancel = () => {
    onCancel();
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: T.surface }]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: T.primaryGhost, borderColor: T.primaryGhostBorder }]}>
          <Ionicons name="calendar" size={20} color={T.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.doctorName, { color: T.textPrimary }]}>{appointment.doctorName}</Text>
          <Text style={[styles.specialization, { color: T.primary }]}>{appointment.specialization}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={15} color={T.textTertiary} />
          <Text style={[styles.detailText, { color: T.textSecondary }]}>{appointment.timeSlot}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={15} color={T.textTertiary} />
          <Text style={[styles.detailText, { color: T.textSecondary }]}>{appointment.formattedDate || formatDate(appointment.bookedAt)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: T.dangerLight }]} onPress={handleCancel} activeOpacity={0.7}>
        <Ionicons name="close-circle-outline" size={16} color={T.danger} />
        <Text style={[styles.cancelText, { color: T.danger }]}>Cancel Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  doctorName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  specialization: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cancelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default AppointmentCard;
