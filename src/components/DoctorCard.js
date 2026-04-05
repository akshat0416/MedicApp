import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../utils/theme';

const DoctorCard = ({ doctor, onPress, theme }) => {
  const T = theme || COLORS;
  const [imgError, setImgError] = useState(false);
  const showFallback = !doctor.profileImage || imgError;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: T.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardInner}>
        {showFallback ? (
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }}
            style={[styles.image, { backgroundColor: T.borderLight }]}
          />
        ) : (
          <Image
            source={{ uri: doctor.profileImage }}
            style={[styles.image, { backgroundColor: T.borderLight }]}
            onError={() => setImgError(true)}
          />
        )}
        <View style={styles.info}>
          <Text style={[styles.name, { color: T.textPrimary }]} numberOfLines={1}>
            {doctor.name}
          </Text>
          <View style={styles.specRow}>
            <Ionicons name="medical" size={13} color={T.primary} />
            <Text style={[styles.specialization, { color: T.primary }]}>{doctor.specialization}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={T.textTertiary} />
              <Text style={[styles.metaText, { color: T.textTertiary }]}>{doctor.experience}</Text>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: T.warningLight }]}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: T.isDark ? '#FFFFFF' : '#92400E' }]}>{doctor.rating}</Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <Text style={[styles.fee, { color: T.textPrimary }]}>{doctor.fee}</Text>
            <View style={[styles.arrowBtn, { backgroundColor: T.primary }]}>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardInner: {
    flexDirection: 'row',
    padding: SPACING.md,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: BORDER_RADIUS.md,
  },
  fallbackAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  specialization: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#92400E',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fee: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoctorCard;
