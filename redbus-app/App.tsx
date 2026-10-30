import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { SearchCard } from './src/components/SearchCard';
import { OffersSection } from './src/components/OffersSection';
import { BusSearchResults } from './src/components/BusSearchResults';
import { VikalpScheduleTableScreen } from './src/components/VikalpScheduleTableScreen';
import { VikalpActivatedBusListScreen } from './src/components/VikalpActivatedBusListScreen';
import { SeatSelectionModal } from './src/components/SeatSelectionModal';
import { VikalpTicketModal } from './src/components/VikalpTicketModal';
import { CaseStudyFeatureModal } from './src/components/CaseStudyFeatureModal';
import { MyBookingsTab } from './src/components/MyBookingsTab';
import { BottomNav } from './src/components/BottomNav';
import { MOCK_BUSES, MOCK_BOOKINGS, POPULAR_CITIES, SHORT_DISTANCE_ROUTES } from './src/data/mockData';
import { BusItem, Seat, BookingRecord } from './src/types';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function App() {
  const [activeVertical, setActiveVertical] = useState<'BUS' | 'RAILS' | 'CABS'>('BUS');
  const [fromCity, setFromCity] = useState('Pune');
  const [toCity, setToCity] = useState('Mumbai');
  const [dateStr, setDateStr] = useState('Today');

  const [currentTab, setCurrentTab] = useState<'home' | 'bookings' | 'account'>('home');
  const [viewMode, setViewMode] = useState<'home' | 'standard_srp' | 'vikalp_table' | 'vikalp_activated_list'>('home');

  // Vikalp State (Team Vantage Innovation)
  const [isVikalpSelected, setIsVikalpSelected] = useState(true);
  const [activeVikalpPnr, setActiveVikalpPnr] = useState('VK48291040P');
  const [selectedVikalpBus, setSelectedVikalpBus] = useState<BusItem | null>(null);
  const [vikalpModalVisible, setVikalpModalVisible] = useState(false);

  // Confirmed Seat Booking State
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [seatModalVisible, setSeatModalVisible] = useState(false);
  const [caseStudyModalVisible, setCaseStudyModalVisible] = useState(false);

  const [bookings, setBookings] = useState<BookingRecord[]>(MOCK_BOOKINGS);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSelectFrom = () => {
    const currentIndex = SHORT_DISTANCE_ROUTES.findIndex(
      (r) => r.from === fromCity && r.to === toCity
    );
    const nextRoute = SHORT_DISTANCE_ROUTES[(currentIndex + 1) % SHORT_DISTANCE_ROUTES.length];
    setFromCity(nextRoute.from);
    setToCity(nextRoute.to);
  };

  const handleSelectTo = () => {
    const currentIndex = SHORT_DISTANCE_ROUTES.findIndex(
      (r) => r.from === fromCity && r.to === toCity
    );
    const nextRoute = SHORT_DISTANCE_ROUTES[(currentIndex + 1) % SHORT_DISTANCE_ROUTES.length];
    setFromCity(nextRoute.from);
    setToCity(nextRoute.to);
  };

  // Date selection: Vikalp Pass is ONLY eligible for 'Today'
  const handleSelectDate = (newDate: string) => {
    setDateStr(newDate);
    if (newDate === 'Today') {
      setIsVikalpSelected(true);
    } else {
      setIsVikalpSelected(false);
    }
  };

  // Search Buses Action
  const handleSearchBuses = () => {
    if (isVikalpSelected && dateStr === 'Today') {
      // 3. Vikalp option chosen for Today: Navigate to 24-Hour Non-clickable Table & Payment Screen
      setViewMode('vikalp_table');
    } else {
      // Standard search: Navigate to standard bus list
      setViewMode('standard_srp');
    }
  };

  // 4 & 5. Payment Completed on Vikalp Table Screen: Navigate to Original Bus List with Additional Information
  const handleVikalpPaymentSuccess = (paidAmount: number) => {
    const newPnr = `VK${Math.floor(10000000 + Math.random() * 90000000)}P`;
    setActiveVikalpPnr(newPnr);

    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      pnr: newPnr,
      operator: 'Opted-in Network (MSRTC Shivneri / Neeta / Purple)',
      busType: `Vikalp 24h Route Pass (${fromCity} ⇄ ${toCity})`,
      from: fromCity,
      to: toCity,
      date: dateStr,
      time: 'Valid for next 24 Hours',
      seatNumbers: ['Legal Spare Capacity'],
      fare: paidAmount,
      status: 'UPCOMING',
      ticketType: 'VIKALP',
      vikalpExpiresAt: '24 Hours from now',
    };

    setBookings([newBooking, ...bookings]);

    // Go forward to the original bus list with additional information and auto-show Universal QR modal
    setViewMode('vikalp_activated_list');
  };

  const handleOpenSeatSelection = (bus: BusItem) => {
    setSelectedBus(bus);
    setSeatModalVisible(true);
  };

  const handleOpenVikalpModal = (bus: BusItem) => {
    setSelectedVikalpBus(bus);
    setVikalpModalVisible(true);
  };

  const handleProceedBooking = (bus: BusItem, selectedSeats: Seat[], totalFare: number) => {
    const newPnr = `RB${Math.floor(10000000 + Math.random() * 90000000)}X`;
    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      pnr: newPnr,
      operator: bus.operator,
      busType: bus.busType,
      from: fromCity,
      to: toCity,
      date: dateStr,
      time: bus.departureTime,
      seatNumbers: selectedSeats.map((s) => s.number),
      fare: totalFare,
      status: 'UPCOMING',
      ticketType: 'CONFIRMED',
    };

    setBookings([newBooking, ...bookings]);
    setSeatModalVisible(false);
    setViewMode('home');
    setCurrentTab('bookings');

    Alert.alert(
      '🎉 Booking Confirmed!',
      `Your booking with ${bus.operator} is confirmed.\n\nPNR: ${newPnr}\nSeats: ${selectedSeats
        .map((s) => s.number)
        .join(', ')}\nTotal: ₹${totalFare}\n\n(Added to My Bookings)`
    );
  };

  const handleConfirmVikalp = (bus: BusItem, fare: number) => {
    handleVikalpPaymentSuccess(fare);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Main Body Content based on Tab & ViewMode */}
      <View style={styles.contentContainer}>
        {currentTab === 'bookings' ? (
          <View style={{ flex: 1 }}>
            <View style={styles.bookingsHeader}>
              <Text style={styles.bookingsHeaderTitle}>My Bookings</Text>
            </View>
            <MyBookingsTab bookings={bookings} />
          </View>
        ) : currentTab === 'account' ? (
          <View style={styles.accountContainer}>
            <View style={styles.accountTopCard}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={36} color="#FFF" />
              </View>
              <Text style={styles.accountName}>Case Study Evaluator</Text>
              <Text style={styles.accountPhone}>Team Vantage • IIIT Nagpur</Text>
            </View>

            <View style={styles.accountMenu}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setCaseStudyModalVisible(true)}
              >
                <MaterialCommunityIcons name="lightbulb-on" size={22} color="#D84E55" />
                <Text style={styles.menuTitle}>Case Study Innovation Hub</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuRow}>
                <MaterialCommunityIcons name="wallet-outline" size={22} color="#444" />
                <Text style={styles.menuTitle}>redBus Wallet: ₹500</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuRow}>
                <MaterialCommunityIcons name="shield-check-outline" size={22} color="#444" />
                <Text style={styles.menuTitle}>Safety & Security Guidelines</Text>
                <Ionicons name="chevron-forward" size={18} color="#AAA" />
              </TouchableOpacity>
            </View>
          </View>
        ) : viewMode === 'vikalp_table' ? (
          /* 3 & 4. 24-Hour Non-clickable Table + Payment Screen */
          <VikalpScheduleTableScreen
            fromCity={fromCity}
            toCity={toCity}
            dateStr={dateStr}
            buses={MOCK_BUSES}
            onBack={() => setViewMode('home')}
            onPaymentSuccess={handleVikalpPaymentSuccess}
          />
        ) : viewMode === 'vikalp_activated_list' ? (
          /* 5. Original Bus List with the same table data + additional information */
          <VikalpActivatedBusListScreen
            fromCity={fromCity}
            toCity={toCity}
            dateStr={dateStr}
            buses={MOCK_BUSES}
            pnr={activeVikalpPnr}
            onBackToHome={() => setViewMode('home')}
            onOpenMyBookings={() => {
              setViewMode('home');
              setCurrentTab('bookings');
            }}
          />
        ) : viewMode === 'standard_srp' ? (
          /* Standard SRP Search Results (when Vikalp is OFF) */
          <BusSearchResults
            fromCity={fromCity}
            toCity={toCity}
            dateStr={dateStr}
            buses={MOCK_BUSES}
            isVikalpOn={false}
            onToggleVikalp={setIsVikalpSelected}
            onBack={() => setViewMode('home')}
            onSelectBus={handleOpenSeatSelection}
            onSelectVikalpBus={handleOpenVikalpModal}
          />
        ) : (
          /* Home Screen */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Header
              activeVertical={activeVertical}
              onSelectVertical={setActiveVertical}
              onOpenCaseStudy={() => setCaseStudyModalVisible(true)}
            />

            {/* 1. Search Route Card with Vikalp Option placed ABOVE Search Buses button */}
            <SearchCard
              fromCity={fromCity}
              toCity={toCity}
              dateStr={dateStr}
              isVikalpSelected={isVikalpSelected}
              onToggleVikalp={setIsVikalpSelected}
              onSwapCities={handleSwapCities}
              onSelectFrom={handleSelectFrom}
              onSelectTo={handleSelectTo}
              onSelectDate={handleSelectDate}
              onSearch={handleSearchBuses}
            />

            {/* Primo Promotion Banner */}
            <View style={styles.primoBanner}>
              <View style={styles.primoBannerContent}>
                <View style={styles.primoStarIcon}>
                  <Ionicons name="star" size={18} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.primoBannerTitle}>redBus Primo Assurance</Text>
                  <Text style={styles.primoBannerSub}>
                    Top-rated drivers, punctual departures & clean sanitized seats.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Confirmed Seat Selection Modal */}
      <SeatSelectionModal
        visible={seatModalVisible}
        bus={selectedBus}
        onClose={() => setSeatModalVisible(false)}
        onProceedBooking={handleProceedBooking}
      />

      {/* Vikalp Ticket Choice & Rules Modal */}
      <VikalpTicketModal
        visible={vikalpModalVisible}
        bus={selectedVikalpBus}
        fromCity={fromCity}
        toCity={toCity}
        onClose={() => setVikalpModalVisible(false)}
        onConfirmVikalp={handleConfirmVikalp}
      />

      {/* Case Study Feature Modal */}
      <CaseStudyFeatureModal
        visible={caseStudyModalVisible}
        onClose={() => setCaseStudyModalVisible(false)}
      />

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={(tab) => {
        setCurrentTab(tab);
        if (tab === 'home') setViewMode('home');
      }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D84E55',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  primoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1A237E',
    borderRadius: 14,
    padding: 14,
  },
  primoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primoStarIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E65100',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primoBannerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  primoBannerSub: {
    color: '#C5CAE9',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  bookingsHeader: {
    backgroundColor: '#D84E55',
    paddingTop: 45,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  bookingsHeaderTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  accountContainer: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  accountTopCard: {
    backgroundColor: '#D84E55',
    paddingTop: 50,
    paddingBottom: 24,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  accountPhone: {
    fontSize: 13,
    color: '#FFEAEA',
    marginTop: 2,
  },
  accountMenu: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
