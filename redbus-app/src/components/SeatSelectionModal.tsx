import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusItem, Seat } from '../types';
import { GENERATE_SEATS } from '../data/mockData';

interface SeatSelectionModalProps {
  visible: boolean;
  bus: BusItem | null;
  onClose: () => void;
  onProceedBooking: (bus: BusItem, selectedSeats: Seat[], totalFare: number) => void;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  visible,
  bus,
  onClose,
  onProceedBooking,
}) => {
  if (!bus) return null;

  const [deck, setDeck] = useState<'lower' | 'upper'>('lower');
  const [seats, setSeats] = useState<Seat[]>(() => GENERATE_SEATS(bus.fare));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const selectedSeatsList = seats.filter((s) => selectedSeatIds.includes(s.id));
  const totalAmount = selectedSeatsList.reduce((acc, s) => acc + s.fare, 0);

  const currentDeckSeats = seats.filter((s) => s.deck === deck);
  const rows = [1, 2, 3, 4, 5];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Modal Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{bus.operator}</Text>
            <Text style={styles.headerSubtitle}>{bus.busType}</Text>
          </View>
        </View>

        {/* Deck Switcher Tabs */}
        <View style={styles.deckSwitcher}>
          <TouchableOpacity
            style={[styles.deckTab, deck === 'lower' && styles.deckTabActive]}
            onPress={() => setDeck('lower')}
          >
            <Text style={[styles.deckTabText, deck === 'lower' && styles.deckTabTextActive]}>
              Lower Deck
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deckTab, deck === 'upper' && styles.deckTabActive]}
            onPress={() => setDeck('upper')}
          >
            <Text style={[styles.deckTabText, deck === 'upper' && styles.deckTabTextActive]}>
              Upper Deck
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seat Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatBooked]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatLadies]} />
            <Text style={styles.legendText}>Ladies</Text>
          </View>
        </View>

        {/* Bus Layout Canvas */}
        <ScrollView contentContainerStyle={styles.busLayoutContainer}>
          <View style={styles.busChassis}>
            {/* Driver Steering Row */}
            <View style={styles.steeringRow}>
              <MaterialCommunityIcons name="steering" size={28} color="#888" />
              <Text style={styles.frontText}>FRONT</Text>
            </View>

            {/* Seats Grid */}
            <View style={styles.seatsGrid}>
              {rows.map((rowNum) => {
                const seatA = currentDeckSeats.find((s) => s.row === rowNum && s.col === 1);
                const seatB = currentDeckSeats.find((s) => s.row === rowNum && s.col === 2);
                const seatC = currentDeckSeats.find((s) => s.row === rowNum && s.col === 3);

                return (
                  <View key={rowNum} style={styles.rowWrapper}>
                    {/* Left Single Berth */}
                    {seatA && (
                      <TouchableOpacity
                        style={[
                          styles.seatBerth,
                          seatA.status === 'booked' && styles.seatBooked,
                          seatA.status === 'ladies' && styles.seatLadies,
                          selectedSeatIds.includes(seatA.id) && styles.seatSelected,
                        ]}
                        disabled={seatA.status === 'booked'}
                        onPress={() => toggleSeat(seatA)}
                      >
                        <Text
                          style={[
                            styles.seatNumber,
                            selectedSeatIds.includes(seatA.id) && styles.seatNumberSelected,
                          ]}
                        >
                          {seatA.number}
                        </Text>
                        <Text style={styles.seatFareText}>₹{seatA.fare}</Text>
                      </TouchableOpacity>
                    )}

                    {/* Gangway Aisle */}
                    <View style={styles.aisleSpace} />

                    {/* Right Double Berths */}
                    <View style={styles.doubleSeatCol}>
                      {seatB && (
                        <TouchableOpacity
                          style={[
                            styles.seatBerth,
                            seatB.status === 'booked' && styles.seatBooked,
                            seatB.status === 'ladies' && styles.seatLadies,
                            selectedSeatIds.includes(seatB.id) && styles.seatSelected,
                          ]}
                          disabled={seatB.status === 'booked'}
                          onPress={() => toggleSeat(seatB)}
                        >
                          <Text
                            style={[
                              styles.seatNumber,
                              selectedSeatIds.includes(seatB.id) && styles.seatNumberSelected,
                            ]}
                          >
                            {seatB.number}
                          </Text>
                          <Text style={styles.seatFareText}>₹{seatB.fare}</Text>
                        </TouchableOpacity>
                      )}

                      {seatC && (
                        <TouchableOpacity
                          style={[
                            styles.seatBerth,
                            seatC.status === 'booked' && styles.seatBooked,
                            seatC.status === 'ladies' && styles.seatLadies,
                            selectedSeatIds.includes(seatC.id) && styles.seatSelected,
                          ]}
                          disabled={seatC.status === 'booked'}
                          onPress={() => toggleSeat(seatC)}
                        >
                          <Text
                            style={[
                              styles.seatNumber,
                              selectedSeatIds.includes(seatC.id) && styles.seatNumberSelected,
                            ]}
                          >
                            {seatC.number}
                          </Text>
                          <Text style={styles.seatFareText}>₹{seatC.fare}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Booking Summary Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.selectedSeatsSummary}>
              {selectedSeatIds.length > 0
                ? `Seats: ${selectedSeatsList.map((s) => s.number).join(', ')}`
                : 'Select seats to continue'}
            </Text>
            <Text style={styles.totalFareText}>₹{totalAmount}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.proceedButton,
              selectedSeatIds.length === 0 && styles.proceedButtonDisabled,
            ]}
            disabled={selectedSeatIds.length === 0}
            onPress={() => onProceedBooking(bus, selectedSeatsList, totalAmount)}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO BOOK</Text>
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
    backgroundColor: '#F7F7F8',
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
  deckSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  deckTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  deckTabActive: {
    borderBottomColor: '#D84E55',
  },
  deckTabText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  deckTabTextActive: {
    color: '#D84E55',
    fontWeight: '800',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  busLayoutContainer: {
    padding: 20,
    alignItems: 'center',
  },
  busChassis: {
    width: '94%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E2E2',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  steeringRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    gap: 8,
  },
  frontText: {
    fontSize: 10,
    color: '#AAA',
    fontWeight: '700',
    letterSpacing: 1,
  },
  seatsGrid: {
    paddingTop: 16,
    gap: 12,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aisleSpace: {
    width: 32,
  },
  doubleSeatCol: {
    flexDirection: 'row',
    gap: 8,
  },
  seatBerth: {
    width: 60,
    height: 64,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#70A0F0',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  seatAvailable: {
    backgroundColor: '#FFF',
    borderColor: '#70A0F0',
    borderWidth: 1.5,
  },
  seatSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  seatBooked: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  seatLadies: {
    backgroundColor: '#FCE4EC',
    borderColor: '#EC407A',
  },
  seatNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },
  seatNumberSelected: {
    color: '#FFF',
  },
  seatFareText: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
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
  selectedSeatsSummary: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  totalFareText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  proceedButton: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  proceedButtonDisabled: {
    backgroundColor: '#CCC',
  },
  proceedButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

