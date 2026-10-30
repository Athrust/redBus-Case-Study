import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusItem } from '../types';

interface VikalpTicketModalProps {
  visible: boolean;
  bus: BusItem | null;
  fromCity: string;
  toCity: string;
  onClose: () => void;
  onConfirmVikalp: (bus: BusItem, fare: number) => void;
}

export const VikalpTicketModal: React.FC<VikalpTicketModalProps> = ({
  visible,
  bus,
  fromCity,
  toCity,
  onClose,
  onConfirmVikalp,
}) => {
  if (!bus) return null;

  const [ticketChoice, setTicketChoice] = useState<'CONFIRMED' | 'VIKALP'>('VIKALP');

  const vikalpPrice = bus.vikalpFare || Math.round(bus.fare * 0.90);
  const confirmedPrice = bus.fare;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Choose Your Ticket Type</Text>
            <Text style={styles.headerSubtitle}>
              {fromCity} → {toCity} • Team Vantage Vikalp
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Trip Summary Card */}
          <View style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.operatorText}>{bus.operator}</Text>
              <Text style={styles.busTypeText}>{bus.busType}</Text>
            </View>
            <View style={styles.timingRow}>
              <Text style={styles.timeVal}>{bus.departureTime} → {bus.arrivalTime}</Text>
              <Text style={styles.durationVal}>{bus.duration}</Text>
            </View>
          </View>

          {/* Option 1: Confirmed Ticket */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              ticketChoice === 'CONFIRMED' && styles.optionCardActive,
            ]}
            onPress={() => setTicketChoice('CONFIRMED')}
            activeOpacity={0.8}
          >
            <View style={styles.optionHeader}>
              <View style={styles.radioRow}>
                <Ionicons
                  name={ticketChoice === 'CONFIRMED' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={ticketChoice === 'CONFIRMED' ? '#D84E55' : '#888'}
                />
                <View>
                  <Text style={styles.optionTitle}>Confirmed Ticket</Text>
                  <Text style={styles.optionSub}>Specific bus • Guaranteed seat</Text>
                </View>
              </View>
              <Text style={styles.optionPrice}>₹{confirmedPrice}</Text>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.featureItemText}>Guaranteed reserved seat on this departure</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.featureItemText}>Fixed boarding time ({bus.departureTime})</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.featureItemText}>Standard cancellation & refund policy</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Option 2: Vikalp Ticket (Team Vantage Innovation) */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              ticketChoice === 'VIKALP' && styles.optionCardVikalpActive,
            ]}
            onPress={() => setTicketChoice('VIKALP')}
            activeOpacity={0.8}
          >
            <View style={styles.vikalpBadgeStrip}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFF" />
              <Text style={styles.vikalpBadgeText}>VIKALP PASS • 10% LESS</Text>
            </View>

            <View style={styles.optionHeader}>
              <View style={styles.radioRow}>
                <Ionicons
                  name={ticketChoice === 'VIKALP' ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={ticketChoice === 'VIKALP' ? '#0284C7' : '#888'}
                />
                <View>
                  <Text style={styles.optionTitle}>Vikalp Flexible Ticket</Text>
                  <Text style={styles.optionSub}>10% Less than Assured Rate • 24 h Validity</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.vikalpPriceText}>₹{vikalpPrice}</Text>
                <Text style={styles.originalStrikeText}>₹{confirmedPrice}</Text>
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="time-outline" size={16} color="#0284C7" />
                <Text style={styles.featureItemText}>Valid for any departure on route within 24 hours</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="bus-outline" size={16} color="#0284C7" />
                <Text style={styles.featureItemText}>Usable across all opted-in operators on this route</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="alert-circle-outline" size={16} color="#E65100" />
                <Text style={[styles.featureItemText, { color: '#B45309' }]}>
                  Boarding within legal spare capacity (Confirmed passengers board first)
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="qr-code-outline" size={16} color="#0284C7" />
                <Text style={styles.featureItemText}>Single-use secure digital QR validation at boarding</Text>
              </View>
            </View>

            <View style={styles.policyBox}>
              <Text style={styles.policyHeading}>Short Corridor Rules (&lt; 250 km • Team Vantage):</Text>
              <Text style={styles.policyText}>
                • Designed for high-frequency short corridors (e.g. Pune ⇄ Mumbai, 148 km).{'\n'}
                • Buses depart every 15–20 mins, so if one departure is full, next arrives shortly.{'\n'}
                • redBus sets one unified flat route rate (₹{vikalpPrice}) across all participating operators.{'\n'}
                • Confirmed passengers board first; Vikalp boards within legal spare capacity.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom CTA Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.summaryLabel}>
              {ticketChoice === 'VIKALP' ? 'Vikalp 24h Pass' : 'Confirmed Seat'}
            </Text>
            <Text style={styles.summaryAmount}>
              ₹{ticketChoice === 'VIKALP' ? vikalpPrice : confirmedPrice}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              ticketChoice === 'VIKALP' ? styles.vikalpBtnBg : styles.confirmedBtnBg,
            ]}
            onPress={() => onConfirmVikalp(bus, ticketChoice === 'VIKALP' ? vikalpPrice : confirmedPrice)}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              {ticketChoice === 'VIKALP' ? 'CONFIRM VIKALP PASS' : 'CONTINUE TO SEATS'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  header: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  closeBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#FFE2E3',
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  tripCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  operatorText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  busTypeText: {
    fontSize: 12,
    color: '#777',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  durationVal: {
    fontSize: 12,
    color: '#666',
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardActive: {
    borderColor: '#D84E55',
    backgroundColor: '#FFFBFB',
  },
  optionCardVikalpActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  vikalpBadgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  vikalpBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  optionSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  vikalpPriceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0284C7',
  },
  originalStrikeText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  featuresList: {
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureItemText: {
    fontSize: 12,
    color: '#444',
    flex: 1,
  },
  policyBox: {
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  policyHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  bottomBar: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  confirmedBtnBg: {
    backgroundColor: '#D84E55',
  },
  vikalpBtnBg: {
    backgroundColor: '#0284C7',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

