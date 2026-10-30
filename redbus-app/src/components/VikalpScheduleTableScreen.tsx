import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusItem } from '../types';

interface VikalpScheduleTableScreenProps {
  fromCity: string;
  toCity: string;
  dateStr: string;
  buses: BusItem[];
  onBack: () => void;
  onPaymentSuccess: (paidAmount: number) => void;
}

export const VikalpScheduleTableScreen: React.FC<VikalpScheduleTableScreenProps> = ({
  fromCity,
  toCity,
  dateStr,
  buses,
  onBack,
  onPaymentSuccess,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<'UPI' | 'WALLET' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter out buses that are full or not eligible at all
  const eligibleBuses = buses.filter(
    (b) => b.isVikalpEligible && (b.vikalpEstimatedSpareSeats || 0) > 0
  );

  // Standard assured ticket benchmark is ₹450, Vikalp is strictly 10% less (450 - 45 = 405)
  const assuredBenchmarkRate = 450;
  const vikalpDiscount = 45; // Exactly 10%
  const flatRouteRate = assuredBenchmarkRate - vikalpDiscount; // ₹405

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(flatRouteRate);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{fromCity} → {toCity}</Text>
          <Text style={styles.headerSubtitle}>
            {dateStr} • 24h Window • {eligibleBuses.length} Buses found
          </Text>
        </View>

        <View style={styles.vikalpHeaderBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFD700" />
          <Text style={styles.vikalpHeaderBadgeText}>VIKALP 24H</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 24-Hour Window Explanation Banner */}
        <View style={styles.windowBanner}>
          <View style={styles.windowHeaderRow}>
            <View style={styles.clockIconCircle}>
              <MaterialCommunityIcons name="timer-sand" size={20} color="#0284C7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.windowTitle}>24-Hour Validity Window</Text>
              <Text style={styles.windowPeriod}>
                Valid from: Current Time → Next 24 Hours (Next Day)
              </Text>
            </View>
          </View>
          <Text style={styles.windowDesc}>
            Below is the complete, non-clickable timetable of all departures over the next 24 hours.
            A single flat-rate Vikalp Pass covers any eligible bus with spare capacity.
          </Text>
        </View>

        {/* Section Title */}
        <View style={styles.tableTitleRow}>
          <MaterialCommunityIcons name="table-clock" size={18} color="#334155" />
          <Text style={styles.tableTitleText}>
            Eligible Scheduled Departures in 24 Hours ({eligibleBuses.length} Buses)
          </Text>
        </View>

        {/* 3. Non-Clickable 24-Hour Table (Only Eligible Buses with Available Spare Capacity) */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1.6 }]}>DEPART / OPERATOR</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ARRIVE</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>ARRIVING IN</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right' }]}>SPARE</Text>
          </View>

          {/* Table Body (Non-Clickable Rows) */}
          {eligibleBuses.map((bus, idx) => (
            <View
              key={bus.id}
              style={[
                styles.tableRow,
                idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              {/* Departure & Operator */}
              <View style={{ flex: 1.6, paddingRight: 4 }}>
                <Text style={styles.departTimeText}>{bus.departureTime}</Text>
                <Text style={styles.operatorText} numberOfLines={1}>
                  {bus.operator}
                </Text>
                <Text style={styles.busTypeText} numberOfLines={1}>
                  {bus.busType.split(' ')[0]} {bus.busType.split(' ')[1] || ''}
                </Text>
              </View>

              {/* Arrival */}
              <View style={{ flex: 1 }}>
                <Text style={styles.arriveTimeText}>{bus.arrivalTime}</Text>
                <Text style={styles.durationSubtext}>{bus.duration}</Text>
              </View>

              {/* Arriving In */}
              <View style={{ flex: 1.4 }}>
                <View style={styles.arrivingInPill}>
                  <Text style={styles.arrivingInText} numberOfLines={1}>
                    {bus.arrivingIn || bus.vikalpNextDeparture || 'Scheduled'}
                  </Text>
                </View>
              </View>

              {/* Spare Capacity */}
              <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                <View style={styles.spareBadge}>
                  <Text style={styles.spareBadgeText}>
                    ~{bus.vikalpEstimatedSpareSeats} seats
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 4. Payment Section (Locked directly below table) */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentHeaderRow}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>Complete Payment to Activate Pass</Text>
              <Text style={styles.paymentSub}>
                Without payment, you cannot proceed to view detailed bus boarding information.
              </Text>
            </View>
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.priceBreakdownCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Normal Assured Ticket Price</Text>
              <Text style={styles.priceVal}>₹{assuredBenchmarkRate}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: '#16A34A', fontWeight: '700' }]}>
                10% Less (Vikalp Route Policy)
              </Text>
              <Text style={[styles.priceVal, { color: '#16A34A' }]}>-₹{vikalpDiscount} (10% OFF)</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Payable:</Text>
                <Text style={{ fontSize: 10, color: '#0284C7', fontWeight: '700' }}>
                  10% less than assured price
                </Text>
              </View>
              <Text style={styles.totalVal}>₹{flatRouteRate}</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.methodHeader}>Select Dummy Payment Method:</Text>
          <View style={styles.methodsContainer}>
            <TouchableOpacity
              style={[styles.methodCard, selectedPayment === 'UPI' && styles.methodCardActive]}
              onPress={() => setSelectedPayment('UPI')}
            >
              <Ionicons
                name={selectedPayment === 'UPI' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={selectedPayment === 'UPI' ? '#0284C7' : '#94A3B8'}
              />
              <Text style={styles.methodName}>UPI (Google Pay / PhonePe / Paytm)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, selectedPayment === 'WALLET' && styles.methodCardActive]}
              onPress={() => setSelectedPayment('WALLET')}
            >
              <Ionicons
                name={selectedPayment === 'WALLET' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={selectedPayment === 'WALLET' ? '#0284C7' : '#94A3B8'}
              />
              <Text style={styles.methodName}>redBus Wallet (Available: ₹500)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, selectedPayment === 'CARD' && styles.methodCardActive]}
              onPress={() => setSelectedPayment('CARD')}
            >
              <Ionicons
                name={selectedPayment === 'CARD' ? 'radio-button-on' : 'radio-button-off'}
                size={18}
                color={selectedPayment === 'CARD' ? '#0284C7' : '#94A3B8'}
              />
              <Text style={styles.methodName}>Debit / Credit Card</Text>
            </TouchableOpacity>
          </View>

          {/* CTA Pay Button */}
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
            onPress={handlePay}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.payButtonText}>
                  PAY ₹{flatRouteRate} &amp; ACTIVATE 24H PASS
                </Text>
                <Ionicons name="lock-closed" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  backButton: {
    padding: 6,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#FFE2E3',
    fontSize: 13,
    marginTop: 2,
  },
  vikalpHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  vikalpHeaderBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  windowBanner: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  windowHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  clockIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0369A1',
  },
  windowPeriod: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 1,
  },
  windowDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  tableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  tableTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  // Table Container (Non-clickable)
  tableContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowEven: {
    backgroundColor: '#FFF',
  },
  tableRowOdd: {
    backgroundColor: '#F8FAFC',
  },
  tableRowIneligible: {
    opacity: 0.5,
  },
  departTimeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  operatorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
  },
  busTypeText: {
    fontSize: 11,
    color: '#64748B',
  },
  arriveTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  durationSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  arrivingInPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  arrivingInText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  spareBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  spareBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  ineligibleBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ineligibleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },
  // Payment Section
  paymentSection: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 17,
  },
  priceBreakdownCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  priceLabel: {
    fontSize: 14,
    color: '#475569',
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  priceStrike: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0284C7',
  },
  methodHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  methodsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
  },
  methodCardActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  payButton: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

