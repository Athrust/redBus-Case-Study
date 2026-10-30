import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusItem } from '../types';

interface BusSearchResultsProps {
  fromCity: string;
  toCity: string;
  dateStr: string;
  buses: BusItem[];
  isVikalpOn: boolean;
  onToggleVikalp: (val: boolean) => void;
  onBack: () => void;
  onSelectBus: (bus: BusItem) => void;
  onSelectVikalpBus: (bus: BusItem) => void;
}

export const BusSearchResults: React.FC<BusSearchResultsProps> = ({
  fromCity,
  toCity,
  dateStr,
  buses,
  isVikalpOn,
  onToggleVikalp,
  onBack,
  onSelectBus,
  onSelectVikalpBus,
}) => {
  const [filterPrimo, setFilterPrimo] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterSleeper, setFilterSleeper] = useState(false);

  // Filter buses by category
  let filtered = buses.filter((b) => {
    if (filterPrimo && !b.isPrimo) return false;
    if (filterAC && !b.busType.toLowerCase().includes('a/c')) return false;
    if (filterSleeper && !b.busType.toLowerCase().includes('sleeper')) return false;
    return true;
  });

  // Sort and filter buses based on Vikalp toggle state
  if (isVikalpOn) {
    // When Vikalp is ON: Show ONLY eligible buses with available spare capacity (exclude full or ineligible)
    filtered = filtered.filter((b) => b.isVikalpEligible && (b.vikalpEstimatedSpareSeats || 0) > 0);
    filtered = [...filtered].sort((a, b) => (a.vikalpFare || 0) - (b.vikalpFare || 0));
  } else {
    // When Vikalp is OFF: Standard sort by departure time / standard fare
    filtered = [...filtered].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  return (
    <View style={styles.container}>
      {/* Route Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.routeHeaderInfo}>
          <Text style={styles.headerRouteTitle}>
            {fromCity} → {toCity}
          </Text>
          <Text style={styles.headerDateSubtitle}>
            {`${dateStr} • 148 km (< 250 km) • ${filtered.length} Buses`}
          </Text>
        </View>

        {/* Vikalp Toggle Button (Positioned exactly at the highlighted top-right spot) */}
        <TouchableOpacity
          style={[
            styles.vikalpHeaderToggle,
            isVikalpOn ? styles.vikalpHeaderToggleOn : styles.vikalpHeaderToggleOff,
          ]}
          onPress={() => onToggleVikalp(!isVikalpOn)}
          activeOpacity={0.8}
        >
          <View style={styles.vikalpLabelRow}>
            <MaterialCommunityIcons
              name={isVikalpOn ? "lightning-bolt" : "lightning-bolt-outline"}
              size={13}
              color={isVikalpOn ? "#FFD700" : "#FFF"}
            />
            <Text style={styles.vikalpToggleLabel}>Vikalp</Text>
          </View>
          <View
            style={[
              styles.vikalpStatusBadge,
              isVikalpOn ? styles.vikalpStatusBadgeOn : styles.vikalpStatusBadgeOff,
            ]}
          >
            <Text
              style={[
                styles.vikalpStatusText,
                isVikalpOn ? styles.vikalpStatusTextOn : styles.vikalpStatusTextOff,
              ]}
            >
              {isVikalpOn ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Vikalp Active Info Banner */}
      {isVikalpOn && (
        <View style={styles.vikalpBanner}>
          <View style={styles.vikalpBannerIconContainer}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#0284C7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vikalpBannerTitle}>
              Vikalp Active • Short Route Corridor (&lt; 250 km)
            </Text>
            <Text style={styles.vikalpBannerSub}>
              Single flat rate on Pune ⇄ Mumbai. Valid 24h on any participating bus in spare capacity.
            </Text>
          </View>
        </View>
      )}

      {/* Filter Chips Bar */}
      <View style={styles.filterChipsRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterPrimo && styles.filterChipActive]}
          onPress={() => setFilterPrimo(!filterPrimo)}
        >
          <MaterialCommunityIcons 
            name="star-circle" 
            size={16} 
            color={filterPrimo ? '#FFF' : '#E65100'} 
          />
          <Text style={[styles.filterChipText, filterPrimo && styles.filterChipTextActive]}>
            Primo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterAC && styles.filterChipActive]}
          onPress={() => setFilterAC(!filterAC)}
        >
          <MaterialCommunityIcons 
            name="snowflake" 
            size={15} 
            color={filterAC ? '#FFF' : '#555'} 
          />
          <Text style={[styles.filterChipText, filterAC && styles.filterChipTextActive]}>
            AC Only
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterSleeper && styles.filterChipActive]}
          onPress={() => setFilterSleeper(!filterSleeper)}
        >
          <MaterialCommunityIcons 
            name="bed-outline" 
            size={16} 
            color={filterSleeper ? '#FFF' : '#555'} 
          />
          <Text style={[styles.filterChipText, filterSleeper && styles.filterChipTextActive]}>
            Sleeper
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bus Cards List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.busCard, isVikalpOn && item.isVikalpEligible && styles.busCardVikalpHighlighted]}>
            {/* Operator & Badges */}
            <View style={styles.cardHeader}>
              <View style={styles.operatorRow}>
                <Text style={styles.operatorName}>{item.operator}</Text>
                {item.isPrimo && (
                  <View style={styles.primoTag}>
                    <Text style={styles.primoText}>★ PRIMO</Text>
                  </View>
                )}
                {isVikalpOn && item.isVikalpEligible && (
                  <View style={styles.vikalpEligiblePill}>
                    <Text style={styles.vikalpEligibleText}>⚡ Vikalp Opted-in</Text>
                  </View>
                )}
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFF" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <Text style={styles.busType}>{item.busType}</Text>

            {/* Timings & Duration */}
            <View style={styles.timingRow}>
              <View>
                <Text style={styles.timeText}>{item.departureTime}</Text>
                <Text style={styles.citySubtext}>{fromCity}</Text>
              </View>

              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{item.duration}</Text>
                <View style={styles.durationLine} />
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.timeText}>{item.arrivalTime}</Text>
                <Text style={styles.citySubtext}>{toCity}</Text>
              </View>
            </View>

            {/* Amenities & Live Tracking */}
            <View style={styles.amenitiesRow}>
              {item.hasLiveTracking && (
                <View style={styles.liveTrackingPill}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={13} color="#2E7D32" />
                  <Text style={styles.liveTrackingText}>Live Tracking</Text>
                </View>
              )}
              {isVikalpOn && item.isVikalpEligible && (
                <View style={styles.spareSeatPill}>
                  <Text style={styles.spareSeatText}>
                    ~{item.vikalpEstimatedSpareSeats} spare seats forecast
                  </Text>
                </View>
              )}
              <Text style={styles.amenitySummary} numberOfLines={1}>
                {item.amenities.slice(0, 2).join(' • ')}
              </Text>
            </View>

            {/* Bottom Section: Standard View vs Vikalp Two-Choice View */}
            {isVikalpOn && item.isVikalpEligible ? (
              // Two-Ticket Choice matching Slide 4 of Team Vantage PDF
              <View style={styles.vikalpTwoChoiceContainer}>
                {/* Option A: Confirmed */}
                <TouchableOpacity
                  style={styles.vikalpChoiceRow}
                  onPress={() => onSelectBus(item)}
                >
                  <View>
                    <Text style={styles.choiceTitle}>Confirmed • Standard Fare</Text>
                    <Text style={styles.choiceSub}>Guaranteed seat on this bus</Text>
                  </View>
                  <View style={styles.choicePriceRow}>
                    <Text style={styles.choicePrice}>₹{item.fare}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#888" />
                  </View>
                </TouchableOpacity>

                {/* Option B: Vikalp Flexible Ticket */}
                <TouchableOpacity
                  style={[styles.vikalpChoiceRow, styles.vikalpChoiceHighlight]}
                  onPress={() => onSelectVikalpBus(item)}
                >
                  <View>
                    <View style={styles.vikalpTitleWithBadge}>
                      <Text style={styles.vikalpChoiceTitle}>Vikalp • 10% Less Fare</Text>
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveBadgeText}>10% LESS</Text>
                      </View>
                    </View>
                    <Text style={styles.vikalpChoiceSub}>Valid 24h • 10% less than assured</Text>
                  </View>
                  <View style={styles.choicePriceRow}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.vikalpPrice}>₹{item.vikalpFare}</Text>
                      <Text style={styles.vikalpStrike}>₹{item.fare}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#0284C7" />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              // Standard View (when Vikalp is OFF or Bus not eligible)
              <View style={styles.cardBottomRow}>
                <View>
                  <View style={styles.fareRow}>
                    <Text style={styles.fareText}>₹{item.fare}</Text>
                    {item.originalFare && (
                      <Text style={styles.originalFareText}>₹{item.originalFare}</Text>
                    )}
                  </View>
                  <Text style={styles.seatsLeftText}>
                    {item.seatsAvailable} seats left
                  </Text>
                  {isVikalpOn && !item.isVikalpEligible && (
                    <Text style={styles.ineligibleText}>Confirmed Only (Vikalp Capped)</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.selectSeatsButton}
                  onPress={() => onSelectBus(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selectSeatsButtonText}>SELECT SEATS</Text>
                </TouchableOpacity>
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
  headerBar: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  backButton: {
    padding: 6,
  },
  routeHeaderInfo: {
    flex: 1,
  },
  headerRouteTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  headerDateSubtitle: {
    color: '#FFEAEA',
    fontSize: 11,
    marginTop: 2,
  },
  // Vikalp Header Toggle Button (Matches the highlighted spot in the image)
  vikalpHeaderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  vikalpHeaderToggleOn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
  },
  vikalpHeaderToggleOff: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  vikalpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  vikalpToggleLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  vikalpStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vikalpStatusBadgeOn: {
    backgroundColor: '#22C55E',
  },
  vikalpStatusBadgeOff: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  vikalpStatusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  vikalpStatusTextOn: {
    color: '#FFF',
  },
  vikalpStatusTextOff: {
    color: '#DDD',
  },
  vikalpBanner: {
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
    gap: 10,
  },
  vikalpBannerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vikalpBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  vikalpBannerSub: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 1,
  },
  filterChipsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  filterChipActive: {
    backgroundColor: '#D84E55',
    borderColor: '#D84E55',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  busCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  busCardVikalpHighlighted: {
    borderColor: '#7DD3FC',
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  operatorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  primoTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primoText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E65100',
  },
  vikalpEligiblePill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vikalpEligibleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  busType: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    marginBottom: 10,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  citySubtext: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  durationContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  durationText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  durationLine: {
    height: 1,
    backgroundColor: '#CCC',
    width: '80%',
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  liveTrackingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveTrackingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  spareSeatPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spareSeatText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  amenitySummary: {
    fontSize: 11,
    color: '#888',
  },
  // Vikalp Two-Choice Layout (Slide 4 of Team Vantage)
  vikalpTwoChoiceContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  vikalpChoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vikalpChoiceHighlight: {
    backgroundColor: '#F0F9FF',
    borderColor: '#7DD3FC',
  },
  choiceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  choiceSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  choicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  choicePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  vikalpTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vikalpChoiceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
  },
  saveBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  vikalpChoiceSub: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 1,
  },
  vikalpPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284C7',
  },
  vikalpStrike: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  // Standard Layout
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  fareText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  originalFareText: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  seatsLeftText: {
    fontSize: 11,
    color: '#D84E55',
    fontWeight: '600',
    marginTop: 2,
  },
  ineligibleText: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  selectSeatsButton: {
    backgroundColor: '#D84E55',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectSeatsButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
