import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BookingRecord } from '../types';

interface MyBookingsTabProps {
  bookings: BookingRecord[];
}

export const MyBookingsTab: React.FC<MyBookingsTabProps> = ({ bookings }) => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');

  const filtered = bookings.filter((b) => b.status === activeTab);

  const handleTrackBus = (pnr: string) => {
    Alert.alert(
      'Live Bus Tracker',
      `Bus for PNR ${pnr} is currently on time. Driver location is active on GPS tracking.`
    );
  };

  const handleDownloadTicket = (pnr: string) => {
    Alert.alert('E-Ticket', `E-Ticket for PNR ${pnr} has been saved to device.`);
  };

  const handleShowVikalpQR = (pnr: string) => {
    Alert.alert(
      '📱 Vikalp Digital Boarding QR',
      `PNR: ${pnr}\n\n[ ■■■■■■■■■■■■■ ]\n[ ■  VIKALP QR  ■ ]\n[ ■■■■■■■■■■■■■ ]\n\nShow this QR to the conductor at bus entrance. Confirmed passengers board first; Vikalp boards in spare capacity.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'UPCOMING' && styles.tabActive]}
          onPress={() => setActiveTab('UPCOMING')}
        >
          <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.tabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'COMPLETED' && styles.tabActive]}
          onPress={() => setActiveTab('COMPLETED')}
        >
          <Text style={[styles.tabText, activeTab === 'COMPLETED' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySub}>Book a bus or Vikalp pass to see your trip details here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.ticketCard, item.ticketType === 'VIKALP' && styles.ticketCardVikalp]}>
            {/* Vikalp Badge if applicable */}
            {item.ticketType === 'VIKALP' && (
              <View style={styles.vikalpTicketBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={13} color="#FFF" />
                <Text style={styles.vikalpTicketBadgeText}>VIKALP 24H FLEXIBLE PASS</Text>
              </View>
            )}

            {/* Ticket Header */}
            <View style={styles.ticketHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.operatorTitle}>{item.operator}</Text>
                <Text style={styles.pnrText}>PNR: {item.pnr}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'UPCOMING' ? styles.statusUpcoming : styles.statusCompleted]}>
                <Text style={[styles.statusText, item.status === 'UPCOMING' ? styles.statusUpcomingText : styles.statusCompletedText]}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Journey Details */}
            <View style={styles.routeRow}>
              <View>
                <Text style={styles.cityText}>{item.from}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right-thin" size={32} color="#888" />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cityText}>{item.to}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>

            {/* Seats & Fare */}
            <View style={styles.metaRow}>
              <Text style={styles.seatsText} numberOfLines={1}>
                {item.ticketType === 'VIKALP' ? 'Capacity: ' : 'Seats: '}
                <Text style={styles.boldText}>{item.seatNumbers.join(', ')}</Text>
              </Text>
              <Text style={styles.fareText}>Total: ₹{item.fare}</Text>
            </View>

            {/* Action Buttons */}
            {item.status === 'UPCOMING' && (
              <View style={styles.actionRow}>
                {item.ticketType === 'VIKALP' ? (
                  <>
                    <TouchableOpacity
                      style={styles.vikalpQrButton}
                      onPress={() => handleShowVikalpQR(item.pnr)}
                    >
                      <Ionicons name="qr-code-outline" size={16} color="#FFF" />
                      <Text style={styles.vikalpQrButtonText}>Boarding QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadTicket(item.pnr)}
                    >
                      <Ionicons name="download-outline" size={16} color="#0284C7" />
                      <Text style={[styles.downloadText, { color: '#0284C7' }]}>Pass Details</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => handleTrackBus(item.pnr)}
                    >
                      <MaterialCommunityIcons name="map-marker-path" size={16} color="#2E7D32" />
                      <Text style={styles.trackText}>Track Bus</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadTicket(item.pnr)}
                    >
                      <Ionicons name="download-outline" size={16} color="#D84E55" />
                      <Text style={styles.downloadText}>Download Ticket</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#D84E55',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  tabTextActive: {
    color: '#D84E55',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  ticketCardVikalp: {
    borderColor: '#7DD3FC',
    borderWidth: 1.5,
    backgroundColor: '#FAFCFF',
  },
  vikalpTicketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  vikalpTicketBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  operatorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  pnrText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusUpcoming: {
    backgroundColor: '#E8F5E9',
  },
  statusUpcomingText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: '800',
  },
  statusCompleted: {
    backgroundColor: '#F5F5F5',
  },
  statusCompletedText: {
    color: '#757575',
    fontSize: 10,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  cityText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  seatsText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: '#111',
  },
  fareText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D84E55',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF0F0',
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadText: {
    color: '#D84E55',
    fontSize: 12,
    fontWeight: '700',
  },
  vikalpQrButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    borderRadius: 8,
  },
  vikalpQrButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
