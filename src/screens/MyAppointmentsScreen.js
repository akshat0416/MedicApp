import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppointmentCard from '../components/AppointmentCard';
import { getAppointments, cancelAppointment } from '../utils/storage';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const MyAppointmentsScreen = ({ user, onBack, theme }) => {
  const T = theme || COLORS;
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const loadAppointments = useCallback(async () => {
    const data = await getAppointments(user?.email || '');
    // Show most recent first
    setAppointments(data.reverse());
  }, [user]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const confirmCancel = (item) => {
    setAppointmentToCancel(item);
    setCancelModalVisible(true);
  };

  const handleCancel = async () => {
    if (!appointmentToCancel) return;
    const success = await cancelAppointment(appointmentToCancel.id, user?.email || '');
    if (success) {
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentToCancel.id));
    }
    setCancelModalVisible(false);
    setAppointmentToCancel(null);
  };

  const renderHeader = () => (
    <LinearGradient
      colors={T.gradientHeader || T.gradientPrimary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Appointments</Text>
      <View style={{ width: 40 }} />
    </LinearGradient>
  );

  const renderSummary = () => (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryCard, { backgroundColor: T.surface }]}>
        <View style={[styles.summaryIcon, { backgroundColor: T.primaryGhost }]}>
          <Ionicons name="calendar" size={20} color={T.primary} />
        </View>
        <Text style={[styles.summaryNumber, { color: T.textPrimary }]}>{appointments.length}</Text>
        <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Total Bookings</Text>
      </View>
      <View style={[styles.summaryCard, { backgroundColor: T.surface }]}>
        <View style={[styles.summaryIcon, { backgroundColor: T.successLight }]}>
          <Ionicons name="checkmark-circle" size={20} color={T.success} />
        </View>
        <Text style={[styles.summaryNumber, { color: T.textPrimary }]}>{appointments.length}</Text>
        <Text style={[styles.summaryLabel, { color: T.textTertiary }]}>Confirmed</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: T.primaryGhost, borderColor: T.primaryGhostBorder }]}>
        <Ionicons name="calendar-outline" size={48} color={T.textTertiary} />
      </View>
      <Text style={[styles.emptyTitle, { color: T.textPrimary }]}>No Appointments Yet</Text>
      <Text style={[styles.emptySubtitle, { color: T.textTertiary }]}>
        Book an appointment with a doctor to get started
      </Text>
      <TouchableOpacity
        style={[styles.emptyBtn, { backgroundColor: T.primaryGhost, borderColor: T.primaryGhostBorder }]}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={16} color={T.primary} />
        <Text style={[styles.emptyBtnText, { color: T.primary }]}>Browse Doctors</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: T.background }]}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} onCancel={() => confirmCancel(item)} theme={T} />
        )}
        ListHeaderComponent={appointments.length > 0 ? renderSummary : null}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={T.primary} />
        }
      />

      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: T.surface }]}>
            <View style={[styles.modalHeader, { backgroundColor: T.dangerLight }]}>
              <View style={[styles.modalIconCircle, { backgroundColor: T.danger }]}>
                <Ionicons name="trash-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.modalTitle, { color: T.textPrimary }]}>Cancel Appointment</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalMessage, { color: T.textSecondary }]}>
                Are you sure you want to cancel your appointment with {appointmentToCancel?.doctorName}?
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: T.border }]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={[styles.modalCancelText, { color: T.textSecondary }]}>Keep It</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleCancel}>
                <LinearGradient
                  colors={[T.danger, '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalConfirmGradient}
                >
                  <Text style={styles.modalConfirmText}>Yes, Cancel</Text>
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
  listContent: {
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  summaryNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
  },
  emptyBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
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

export default MyAppointmentsScreen;
