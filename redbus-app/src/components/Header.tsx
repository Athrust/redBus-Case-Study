import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  activeVertical: 'BUS' | 'RAILS' | 'CABS';
  onSelectVertical: (v: 'BUS' | 'RAILS' | 'CABS') => void;
  onOpenCaseStudy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeVertical,
  onSelectVertical,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Branding Row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/redbus/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.brandTitle}>redBus</Text>
            <Text style={styles.brandSubtitle}>India's No. 1 Bus Booking</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Services Switcher Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeVertical === 'BUS' && styles.activeTab]}
          onPress={() => onSelectVertical('BUS')}
        >
          <MaterialCommunityIcons 
            name="bus" 
            size={22} 
            color={activeVertical === 'BUS' ? '#D84E55' : '#FFF'} 
          />
          <Text style={[styles.tabText, activeVertical === 'BUS' && styles.activeTabText]}>
            Bus Tickets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeVertical === 'RAILS' && styles.activeTab]}
          onPress={() => onSelectVertical('RAILS')}
        >
          <MaterialCommunityIcons 
            name="train" 
            size={22} 
            color={activeVertical === 'RAILS' ? '#D84E55' : '#FFF'} 
          />
          <Text style={[styles.tabText, activeVertical === 'RAILS' && styles.activeTabText]}>
            redRail
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeVertical === 'CABS' && styles.activeTab]}
          onPress={() => onSelectVertical('CABS')}
        >
          <MaterialCommunityIcons 
            name="car-multiple" 
            size={22} 
            color={activeVertical === 'CABS' ? '#D84E55' : '#FFF'} 
          />
          <Text style={[styles.tabText, activeVertical === 'CABS' && styles.activeTabText]}>
            Cab Rental
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D84E55',
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#FFE2E3',
    fontWeight: '500',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#D84E55',
    fontWeight: '800',
  },
});
