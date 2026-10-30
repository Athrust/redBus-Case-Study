import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchCardProps {
  fromCity: string;
  toCity: string;
  dateStr: string;
  isVikalpSelected: boolean;
  onToggleVikalp: (val: boolean) => void;
  onSwapCities: () => void;
  onSelectFrom: () => void;
  onSelectTo: () => void;
  onSelectDate: (d: string) => void;
  onSearch: () => void;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  fromCity,
  toCity,
  dateStr,
  isVikalpSelected,
  onToggleVikalp,
  onSwapCities,
  onSelectFrom,
  onSelectTo,
  onSelectDate,
  onSearch,
}) => {
  const isDateToday = dateStr === 'Today';
  const isVikalpActive = isDateToday && isVikalpSelected;

  return (
    <View style={styles.card}>
      {/* Route Inputs Container */}
      <View style={styles.routeContainer}>
        {/* From Section */}
        <TouchableOpacity 
          style={styles.locationRow} 
          onPress={onSelectFrom}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="bus-marker" size={26} color="#D84E55" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>From</Text>
            <Text style={styles.locationValue}>{fromCity}</Text>
          </View>
        </TouchableOpacity>

        {/* Divider with Swap Button */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <TouchableOpacity 
            style={styles.swapButton} 
            onPress={onSwapCities}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-vertical" size={22} color="#D84E55" />
          </TouchableOpacity>
        </View>

        {/* To Section */}
        <TouchableOpacity 
          style={styles.locationRow} 
          onPress={onSelectTo}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="map-marker-distance" size={26} color="#2E7D32" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>To</Text>
            <Text style={styles.locationValue}>{toCity}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Short-Distance Route Tag (< 250 km Case Study Scope) */}
      <View style={styles.shortRouteTag}>
        <MaterialCommunityIcons name="map-marker-path" size={16} color="#0284C7" />
        <Text style={styles.shortRouteTagText}>
          {(fromCity === 'Pune' && toCity === 'Mumbai') || (fromCity === 'Mumbai' && toCity === 'Pune')
            ? '148 km Expressway Corridor • Short Route (< 250 km)'
            : 'Short Distance Intercity Route (< 250 km)'}
        </Text>
      </View>

      {/* Date Selector Row */}
      <View style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#555" />
          <Text style={styles.dateLabel}>Date of Journey: </Text>
          <Text style={styles.currentDateText}>{dateStr}</Text>
        </View>

        <View style={styles.dateChipsRow}>
          <TouchableOpacity 
            style={[styles.dateChip, dateStr === 'Today' && styles.dateChipActive]}
            onPress={() => onSelectDate('Today')}
          >
            <Text style={[styles.dateChipText, dateStr === 'Today' && styles.dateChipTextActive]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dateChip, dateStr === 'Tomorrow' && styles.dateChipActive]}
            onPress={() => onSelectDate('Tomorrow')}
          >
            <Text style={[styles.dateChipText, dateStr === 'Tomorrow' && styles.dateChipTextActive]}>
              Tomorrow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dateChip, dateStr === '02 Nov, Sun' && styles.dateChipActive]}
            onPress={() => onSelectDate('02 Nov, Sun')}
          >
            <Text style={[styles.dateChipText, dateStr === '02 Nov, Sun' && styles.dateChipTextActive]}>
              02 Nov, Sun
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. redBus Vikalp Option (Placed directly ABOVE Search Buses Button) */}
      {/* STRICT RULE: Eligible ONLY if user selects 'Today' */}
      <TouchableOpacity
        style={[
          styles.vikalpOptionBox,
          isVikalpActive && styles.vikalpOptionBoxActive,
          !isDateToday && styles.vikalpOptionBoxIneligible,
        ]}
        onPress={() => {
          if (!isDateToday) {
            onSelectDate('Today');
            onToggleVikalp(true);
          } else {
            onToggleVikalp(!isVikalpSelected);
          }
        }}
        activeOpacity={0.85}
      >
        <View style={styles.vikalpOptionHeader}>
          <View style={styles.vikalpTitleRow}>
            <View style={[
              styles.vikalpIconCircle, 
              !isDateToday && styles.vikalpIconCircleIneligible
            ]}>
              <MaterialCommunityIcons 
                name="lightning-bolt" 
                size={20} 
                color={isDateToday ? "#0284C7" : "#94A3B8"} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[
                  styles.vikalpTitleText, 
                  !isDateToday && styles.vikalpTitleTextIneligible
                ]}>
                  redBus Vikalp Pass
                </Text>
                <View style={[
                  styles.vikalpTag, 
                  !isDateToday && styles.vikalpTagIneligible
                ]}>
                  <Text style={styles.vikalpTagText}>
                    {isDateToday ? '10% LESS' : 'TODAY ONLY'}
                  </Text>
                </View>
              </View>
              <Text style={styles.vikalpSubText}>
                {isDateToday 
                  ? '10% less than normal assured tickets • Valid 24h on eligible buses'
                  : 'Eligible for same-day travel (Today) to fill vacant seats'}
              </Text>
            </View>
          </View>

          <Switch
            value={isVikalpActive}
            onValueChange={(val) => {
              if (isDateToday) {
                onToggleVikalp(val);
              } else {
                onSelectDate('Today');
                onToggleVikalp(true);
              }
            }}
            disabled={!isDateToday}
            trackColor={{ false: '#CBD5E1', true: '#7DD3FC' }}
            thumbColor={isVikalpActive ? '#0284C7' : '#CBD5E1'}
          />
        </View>

        {isVikalpActive && (
          <View style={styles.vikalpActiveNotice}>
            <Ionicons name="information-circle" size={17} color="#0284C7" />
            <Text style={styles.vikalpActiveNoticeText}>
              24-hour departure timetable will be displayed with all scheduled buses.
            </Text>
          </View>
        )}

        {!isDateToday && (
          <View style={styles.vikalpIneligibleNotice}>
            <Ionicons name="alert-circle" size={17} color="#D97706" />
            <Text style={styles.vikalpIneligibleNoticeText}>
              Vikalp Pass is only eligible for Today. Tap here to select Today.
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Search CTA Button */}
      <TouchableOpacity 
        style={[
          styles.searchButton,
          isVikalpActive && styles.searchButtonVikalp,
        ]}
        onPress={onSearch}
        activeOpacity={0.85}
      >
        <Text style={styles.searchButtonText}>
          {isVikalpActive ? 'SEARCH 24H VIKALP BUSES' : 'SEARCH BUSES'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  routeContainer: {
    position: 'relative',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginTop: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -2,
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  shortRouteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  shortRouteTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  dateSection: {
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 15,
    color: '#666',
    marginLeft: 6,
  },
  currentDateText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  dateChipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  dateChipActive: {
    backgroundColor: '#FFEAEA',
    borderColor: '#D84E55',
  },
  dateChipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  dateChipTextActive: {
    color: '#D84E55',
    fontWeight: '800',
  },
  // Vikalp Option Box (Above Search Buses Button)
  vikalpOptionBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  vikalpOptionBoxActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  vikalpOptionBoxIneligible: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  vikalpOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vikalpTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  vikalpIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vikalpIconCircleIneligible: {
    backgroundColor: '#F1F5F9',
  },
  vikalpTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  vikalpTitleTextIneligible: {
    color: '#64748B',
  },
  vikalpTag: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vikalpTagIneligible: {
    backgroundColor: '#94A3B8',
  },
  vikalpTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  vikalpSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  vikalpActiveNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  vikalpActiveNoticeText: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '700',
    flex: 1,
  },
  vikalpIneligibleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  vikalpIneligibleNoticeText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '700',
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#D84E55',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  searchButtonVikalp: {
    backgroundColor: '#0284C7',
    shadowColor: '#0284C7',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
