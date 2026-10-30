import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusItem } from '../types';
import { UniversalQRCodeModal } from './UniversalQRCodeModal';

interface VikalpActivatedBusListScreenProps {
  fromCity: string;
  toCity: string;
  dateStr: string;
  buses: BusItem[];
  pnr: string;
  onBackToHome: () => void;
  onOpenMyBookings: () => void;
}

export const VikalpActivatedBusListScreen: React.FC<VikalpActivatedBusListScreenProps> = ({
  fromCity,
  toCity,
  dateStr,
  buses,
  pnr,
  onBackToHome,
  onOpenMyBookings,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'AC' | 'NON_AC' | 'EV'>('ALL');
  // Auto-opens the Universal One-Time QR modal immediately after payment
  const [showQRModal, setShowQRModal] = useState(true);

  // All eligible buses with spare capacity in 24 hours
  const eligibleBuses = useMemo(() => {
    return buses.filter(
      (b) => b.isVikalpEligible && b.vikalpEstimatedSpareSeats && b.vikalpEstimatedSpareSeats > 0
    );
  }, [buses]);

  // Filter out buses based on user category tab
  const filtered = useMemo(() => {
    return eligibleBuses.filter((b) => {
      const typeLower = b.busType.toLowerCase();
      const isNonAC =
        typeLower.includes('non-ac') ||
        typeLower.includes('non a/c') ||
        typeLower.includes('non-a/c') ||
        typeLower.includes('non ac');
      const isAC = !isNonAC && (typeLower.includes('ac') || typeLower.includes('a/c'));
      const isEV =
        b.operator.toLowerCase().includes('electric') ||
        b.amenities.some((a) => a.toLowerCase().includes('ev') || a.toLowerCase().includes('electric'));

      if (filterCategory === 'AC') return isAC;
      if (filterCategory === 'NON_AC') return isNonAC;
      if (filterCategory === 'EV') return isEV;
      return true;
    });
  }, [eligibleBuses, filterCategory]);

  return (
    <View style={styles.container}>
      {/* Header Bar - styled to match authentic redBus app (Image 1) */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{fromCity} → {toCity}</Text>
          <Text style={styles.headerSubtitle}>
            {dateStr} • {filtered.length} Buses found
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.filterHeaderBtn} 
          onPress={() => setShowQRModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Activated Vikalp Pass Banner */}
      <View style={styles.activePassBanner}>
        <View style={styles.passTopRow}>
          <View style={styles.passBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFF" />
            <Text style={styles.passBadgeText}>VIKALP PASS ACTIVE</Text>
          </View>
          <Text style={styles.pnrText}>PNR: {pnr}</Text>
        </View>

        <View style={styles.passMetaRow}>
          <View>
            <Text style={styles.passValidityTitle}>24 Hours Validity Window</Text>
            <Text style={styles.passValidityTimer}>⏱ 23h 59m Remaining</Text>
          </View>

          <TouchableOpacity style={styles.qrButton} onPress={() => setShowQRModal(true)}>
            <Ionicons name="qr-code" size={16} color="#FFF" />
            <Text style={styles.qrButtonText}>Show Pass QR</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.passRulesReminder}>
          ✓ Paid ₹405 (10% less than normal assured rate). One-time universal QR code is valid on ANY departure below with spare seats!
        </Text>
      </View>

      {/* Filter Category Bar */}
      <View style={styles.filterRowContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilterCategory('ALL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filterCategory === 'ALL' && styles.filterTextActive]}>
              All Departures ({eligibleBuses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'AC' && styles.filterChipActive]}
            onPress={() => setFilterCategory('AC')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filterCategory === 'AC' && styles.filterTextActive]}>
              AC Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'NON_AC' && styles.filterChipActive]}
            onPress={() => setFilterCategory('NON_AC')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filterCategory === 'NON_AC' && styles.filterTextActive]}>
              Non AC
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterCategory === 'EV' && styles.filterChipActive]}
            onPress={() => setFilterCategory('EV')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filterCategory === 'EV' && styles.filterTextActive]}>
              Electric Express
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Scheduled Bus Departures List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.busCard}>
            {/* Operator and Rating */}
            <View style={styles.cardHeader}>
              <View style={styles.operatorTitleRow}>
                <Text style={styles.operatorName}>{item.operator}</Text>
                {item.isPrimo && (
                  <View style={styles.primoTag}>
                    <Text style={styles.primoText}>★ PRIMO</Text>
                  </View>
                )}
                <View style={styles.vikalpCoveredPill}>
                  <Text style={styles.vikalpCoveredText}>✓ Pass Eligible</Text>
                </View>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={11} color="#FFF" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>

            <Text style={styles.busType}>{item.busType}</Text>

            {/* Time & Duration Row */}
            <View style={styles.scheduleRow}>
              <View>
                <Text style={styles.timeVal}>{item.departureTime}</Text>
                <Text style={styles.citySub}>{fromCity}</Text>
              </View>

              <View style={styles.durationBox}>
                <Text style={styles.durationText}>{item.duration}</Text>
                <View style={styles.durationLine} />
                <Text style={styles.arrivingInTag}>
                  {item.arrivingIn || 'Scheduled'}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.timeVal}>{item.arrivalTime}</Text>
                <Text style={styles.citySub}>{toCity}</Text>
              </View>
            </View>

            {/* Additional Information: Boarding & Dropping Points */}
            <View style={styles.pointsContainer}>
              <View style={styles.pointRow}>
                <Ionicons name="radio-button-on" size={12} color="#0284C7" />
                <Text style={styles.pointLabel}>Boarding:</Text>
                <Text style={styles.pointVal} numberOfLines={1}>
                  {item.boardingPoints.join(' • ')}
                </Text>
              </View>
              <View style={styles.pointRow}>
                <Ionicons name="location" size={12} color="#D84E55" />
                <Text style={styles.pointLabel}>Dropping:</Text>
                <Text style={styles.pointVal} numberOfLines={1}>
                  {item.droppingPoints.join(' • ')}
                </Text>
              </View>
            </View>

            {/* Additional Information: Live GPS & Spare Capacity */}
            <View style={styles.amenitiesRow}>
              {item.hasLiveTracking && (
                <View style={styles.liveTrackingBadge}>
                  <Ionicons name="navigate" size={11} color="#15803D" />
                  <Text style={styles.liveTrackingText}>Live GPS Tracking</Text>
                </View>
              )}
              <View style={styles.spareSeatBadge}>
                <Text style={styles.spareSeatText}>
                  ~{item.vikalpEstimatedSpareSeats} spare capacity
                </Text>
              </View>
              <Text style={styles.amenitiesText}>
                {item.amenities.slice(0, 2).join(' • ')}
              </Text>
            </View>

            {/* Bottom Row - Universal QR code is one-time usable across all buses */}
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.passCoveredText}>Covered by Vikalp Pass</Text>
                <Text style={styles.farePaidText}>Paid ₹405 (10% Less Rate)</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Universal One-Time QR Code Modal */}
      <UniversalQRCodeModal
        visible={showQRModal}
        pnr={pnr}
        fromCity={fromCity}
        toCity={toCity}
        paidAmount={405}
        onClose={() => setShowQRModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerBar: {
    backgroundColor: '#D84E55',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#FFE2E3',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  filterHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePassBanner: {
    backgroundColor: '#0F172A',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  passTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  passBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pnrText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  passMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  passValidityTitle: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
  },
  passValidityTimer: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  qrButton: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  qrButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  passRulesReminder: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    lineHeight: 18,
  },
  filterRowContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  busCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  operatorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  operatorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  primoTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E65100',
  },
  vikalpCoveredPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vikalpCoveredText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  busType: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
  },
  timeVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  citySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  durationBox: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 3,
  },
  durationLine: {
    height: 1.5,
    backgroundColor: '#CBD5E1',
    width: '80%',
    marginBottom: 4,
  },
  arrivingInTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  pointsContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  pointVal: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  liveTrackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveTrackingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  spareSeatBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  spareSeatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  amenitiesText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  passCoveredText: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '700',
  },
  farePaidText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
});
