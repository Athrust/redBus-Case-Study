import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface UniversalQRCodeModalProps {
  visible: boolean;
  pnr: string;
  fromCity: string;
  toCity: string;
  paidAmount: number;
  onClose: () => void;
}

export const UniversalQRCodeModal: React.FC<UniversalQRCodeModalProps> = ({
  visible,
  pnr,
  fromCity,
  toCity,
  paidAmount,
  onClose,
}) => {
  const qrPayload = JSON.stringify({
    type: 'REDBUS_VIKALP_UNIVERSAL_PASS',
    pnr: pnr,
    corridor: `${fromCity}-${toCity}`,
    distanceKm: 148,
    fare: paidAmount,
    validHours: 24,
    issuedAt: new Date().toISOString(),
    team: 'Team Vantage - Prodyssey 2026',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `redBus Vikalp 24H Universal Pass\nPNR: ${pnr}\nRoute: ${fromCity} ⇄ ${toCity} (148 km)\nFare Paid: ₹${paidAmount} (10% Off Assured Rate)\nValidity: 24 Hours on all eligible departures.`,
      });
    } catch (e) {
      // Ignored
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconCircle}>
                <MaterialCommunityIcons name="lightning-bolt" size={22} color="#FFD700" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Universal One-Time Boarding Pass</Text>
                <Text style={styles.headerSubtitle}>redBus Vikalp • Valid on Any Eligible Bus</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Route & Corridor Summary */}
            <View style={styles.routeHeader}>
              <View style={styles.cityBlock}>
                <Text style={styles.cityCode}>{fromCity.substring(0, 3).toUpperCase()}</Text>
                <Text style={styles.cityName}>{fromCity}</Text>
              </View>
              <View style={styles.corridorArrowBlock}>
                <Text style={styles.corridorDist}>148 km Corridor</Text>
                <View style={styles.arrowRow}>
                  <View style={styles.arrowLine} />
                  <MaterialCommunityIcons name="bus" size={20} color="#D84E55" />
                  <View style={styles.arrowLine} />
                </View>
                <Text style={styles.corridorTag}>Short Route (&lt; 250 km)</Text>
              </View>
              <View style={[styles.cityBlock, { alignItems: 'flex-end' }]}>
                <Text style={styles.cityCode}>{toCity.substring(0, 3).toUpperCase()}</Text>
                <Text style={styles.cityName}>{toCity}</Text>
              </View>
            </View>

            {/* PNR Banner */}
            <View style={styles.pnrContainer}>
              <Text style={styles.pnrLabel}>UNIVERSAL PASS PNR</Text>
              <Text style={styles.pnrValue}>{pnr}</Text>
            </View>

            {/* Authentic Realistic QR Code Container */}
            <View style={styles.qrWrapper}>
              <View style={styles.qrFrameWithCorners}>
                <View style={styles.qrInnerFrame}>
                  <QRCode
                    value={qrPayload}
                    size={260}
                    color="#111827"
                    backgroundColor="#FFFFFF"
                    quietZone={6}
                  />
                </View>

                <View style={styles.qrCornerTopLeft} />
                <View style={styles.qrCornerTopRight} />
                <View style={styles.qrCornerBottomLeft} />
                <View style={styles.qrCornerBottomRight} />
              </View>

              <View style={styles.scanNoticeRow}>
                <MaterialCommunityIcons name="line-scan" size={20} color="#0284C7" />
                <Text style={styles.scanNoticeText}>
                  Conductor will scan this QR at boarding door
                </Text>
              </View>
            </View>

            {/* Pass Validity and Fare Matrix */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>VALIDITY PERIOD</Text>
                  <View style={styles.metaValRow}>
                    <Ionicons name="time-outline" size={16} color="#0F172A" />
                    <Text style={styles.metaVal}>24 Hours</Text>
                  </View>
                  <Text style={styles.metaSub}>⏱ 23h 59m remaining</Text>
                </View>

                <View style={styles.metaDivider} />

                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>FARE PAID</Text>
                  <View style={styles.metaValRow}>
                    <Text style={styles.fareCurrency}>₹</Text>
                    <Text style={styles.metaVal}>{paidAmount}</Text>
                  </View>
                  <Text style={styles.discountHighlight}>10% Off Assured Rate</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>VIEW BUS DEPARTURES</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare} activeOpacity={0.7}>
              <Ionicons name="share-social-outline" size={18} color="#475569" />
              <Text style={styles.secondaryButtonText}>Share / Save Pass</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: 480,
    maxHeight: '94%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#FFE2E3',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  contentContainer: {
    padding: 18,
    alignItems: 'center',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cityBlock: {
    width: 80,
  },
  cityCode: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  cityName: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  corridorArrowBlock: {
    alignItems: 'center',
    flex: 1,
  },
  corridorDist: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 2,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '80%',
    justifyContent: 'center',
  },
  arrowLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CBD5E1',
  },
  corridorTag: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 3,
  },
  pnrContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  pnrLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  pnrValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  // QR Frame with targeting corners
  qrWrapper: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginVertical: 10,
    width: '100%',
  },
  qrFrameWithCorners: {
    position: 'relative',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInnerFrame: {
    padding: 6,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  qrCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#D84E55',
  },
  qrCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#D84E55',
  },
  qrCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#D84E55',
  },
  qrCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#D84E55',
  },
  scanNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  scanNoticeText: {
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
  },
  metaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  metaValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  fareCurrency: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaSub: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '700',
    marginTop: 2,
  },
  discountHighlight: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '700',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#D84E55',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#D84E55',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
});
