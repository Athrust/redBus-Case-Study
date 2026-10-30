import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavProps {
  currentTab: 'home' | 'bookings' | 'account';
  onSelectTab: (tab: 'home' | 'bookings' | 'account') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('home')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="bus"
          size={26}
          color={currentTab === 'home' ? '#D84E55' : '#888'}
        />
        <Text style={[styles.navText, currentTab === 'home' && styles.navTextActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('bookings')}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="ticket-confirmation"
          size={26}
          color={currentTab === 'bookings' ? '#D84E55' : '#888'}
        />
        <Text style={[styles.navText, currentTab === 'bookings' && styles.navTextActive]}>
          Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('account')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="person-circle-outline"
          size={27}
          color={currentTab === 'account' ? '#D84E55' : '#888'}
        />
        <Text style={[styles.navText, currentTab === 'account' && styles.navTextActive]}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingVertical: 10,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  navTextActive: {
    color: '#D84E55',
    fontWeight: '800',
  },
});
