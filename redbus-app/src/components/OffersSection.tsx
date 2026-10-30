import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const OffersSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* RTC Government Bus Partners Strip */}
      <View style={styles.rtcSection}>
        <Text style={styles.rtcHeader}>OFFICIAL GOVT. BUS PARTNERS</Text>
        <View style={styles.rtcLogosRow}>
          {['KSRTC', 'APSRTC', 'TSRTC', 'GSRTC', 'UPSRTC'].map((rtc, idx) => (
            <View key={idx} style={styles.rtcChip}>
              <MaterialCommunityIcons name="bus-side" size={16} color="#D84E55" />
              <Text style={styles.rtcText}>{rtc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rtcSection: {
    backgroundColor: '#FFF8F8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  rtcHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D84E55',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  rtcLogosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rtcChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0D0D0',
  },
  rtcText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
});
