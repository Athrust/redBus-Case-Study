import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface CaseStudyFeatureModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CaseStudyFeatureModal: React.FC<CaseStudyFeatureModalProps> = ({
  visible,
  onClose,
}) => {
  const [ecoModeEnabled, setEcoModeEnabled] = useState(true);
  const [splitFareEnabled, setSplitFareEnabled] = useState(false);
  const [quietZoneEnabled, setQuietZoneEnabled] = useState(true);
  const [luggageOption, setLuggageOption] = useState<'standard' | 'heavy' | 'bicycle'>('standard');
  const [customFeatureName, setCustomFeatureName] = useState('Dynamic Surge Protection');
  const [customFeatureDetail, setCustomFeatureDetail] = useState('Guarantee price lock for students & senior citizens during peak festival seasons.');

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Modal Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Case Study Innovation Hub</Text>
            <Text style={styles.headerSubtitle}>Frontend Feature Showcase for Competition</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Competition Badge Card */}
          <View style={styles.competitionCard}>
            <MaterialCommunityIcons name="trophy-award" size={32} color="#FFD700" />
            <View style={{ flex: 1 }}>
              <Text style={styles.competitionTitle}>Team Vantage • Prodyssey 2026</Text>
              <Text style={styles.competitionSubtext}>
                redBus Vikalp Solution for Short-Distance Corridors (&lt; 250 km).
              </Text>
            </View>
          </View>

          {/* Core Case Study Card: Vikalp for Short Corridors (< 250 km) */}
          <View style={[styles.featureBox, { borderColor: '#38BDF8', borderWidth: 2, backgroundColor: '#F0F9FF' }]}>
            <View style={styles.featureHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: '#0369A1' }]}>
                  Core Bet: Vikalp on Short Corridors (&lt; 250 km)
                </Text>
                <Text style={styles.featureDesc}>
                  Example: Pune ⇄ Mumbai (148 km, ~3h 30m, high frequency).
                </Text>
              </View>
            </View>
            <View style={[styles.featureActiveCard, { backgroundColor: '#FFF', borderColor: '#BAE6FD' }]}>
              <Text style={[styles.ecoActiveText, { color: '#0C4A6E' }]}>
                • Why &lt; 250 km? Search-to-seat funnel leaked heavily (42% vs 70% on long routes) because short-trip commuters need schedule flexibility over fixed seats.{'\n'}
                • Solution: Inline Vikalp choice at flat route rate (₹299–₹350), 24h validity, and spare-capacity boarding without intrusive pop-ups.{'\n'}
                • Success Metric: Net completed journeys per search (not false 5-min cancellations).
              </Text>
            </View>
          </View>

          {/* Innovation 1: Eco-Pass Carbon Offset */}
          <View style={styles.featureBox}>
            <View style={styles.featureHeader}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="leaf" size={22} color="#2E7D32" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Green Miles: Carbon Offset Pass</Text>
                <Text style={styles.featureDesc}>
                  Offset ~14.2 kg CO₂ on Bangalore → Hyderabad route.
                </Text>
              </View>
              <Switch
                value={ecoModeEnabled}
                onValueChange={setEcoModeEnabled}
                trackColor={{ false: '#767577', true: '#A5D6A7' }}
                thumbColor={ecoModeEnabled ? '#2E7D32' : '#f4f3f4'}
              />
            </View>
            {ecoModeEnabled && (
              <View style={styles.featureActiveCard}>
                <Text style={styles.ecoActiveText}>
                  🌱 ₹19 added to plant 1 tree along the highway. Digital Eco-Badge earned on profile!
                </Text>
              </View>
            )}
          </View>

          {/* Innovation 2: Group Travel Split-Fare */}
          <View style={styles.featureBox}>
            <View style={styles.featureHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#EDE7F6' }]}>
                <MaterialCommunityIcons name="account-group" size={22} color="#673AB7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Group Split-Fare Engine</Text>
                <Text style={styles.featureDesc}>
                  Split bus ticket fares automatically with travel companions.
                </Text>
              </View>
              <Switch
                value={splitFareEnabled}
                onValueChange={setSplitFareEnabled}
                trackColor={{ false: '#767577', true: '#D1C4E9' }}
                thumbColor={splitFareEnabled ? '#673AB7' : '#f4f3f4'}
              />
            </View>
            {splitFareEnabled && (
              <View style={styles.splitFarePreview}>
                <Text style={styles.splitFareText}>
                  👥 Shareable Link: redbus.in/split/RB9842X (₹599 / person across 4 passengers)
                </Text>
              </View>
            )}
          </View>

          {/* Innovation 3: Luggage & Cargo Capacity Pre-booking */}
          <View style={styles.featureBox}>
            <View style={styles.featureHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="bag-personal" size={22} color="#E65100" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Luggage & Cargo Slot Booking</Text>
                <Text style={styles.featureDesc}>
                  Guarantee under-bus luggage booth space before boarding.
                </Text>
              </View>
            </View>

            <View style={styles.luggageOptionsRow}>
              <TouchableOpacity
                style={[styles.luggageBtn, luggageOption === 'standard' && styles.luggageBtnActive]}
                onPress={() => setLuggageOption('standard')}
              >
                <Text style={[styles.luggageBtnText, luggageOption === 'standard' && styles.luggageBtnTextActive]}>
                  Standard (Up to 15kg) - Free
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.luggageBtn, luggageOption === 'heavy' && styles.luggageBtnActive]}
                onPress={() => setLuggageOption('heavy')}
              >
                <Text style={[styles.luggageBtnText, luggageOption === 'heavy' && styles.luggageBtnTextActive]}>
                  Heavy Cargo (+25kg) - +₹99
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.luggageBtn, luggageOption === 'bicycle' && styles.luggageBtnActive]}
                onPress={() => setLuggageOption('bicycle')}
              >
                <Text style={[styles.luggageBtnText, luggageOption === 'bicycle' && styles.luggageBtnTextActive]}>
                  Bicycle / Large Box - +₹199
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Innovation 4: Quiet Zone Berths */}
          <View style={styles.featureBox}>
            <View style={styles.featureHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}>
                <MaterialCommunityIcons name="volume-mute" size={22} color="#00838F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Silent Cabin / Quiet Berth</Text>
                <Text style={styles.featureDesc}>
                  Strict 10:30 PM lights-out & zero phone loudspeaker zone.
                </Text>
              </View>
              <Switch
                value={quietZoneEnabled}
                onValueChange={setQuietZoneEnabled}
                trackColor={{ false: '#767577', true: '#80DEEA' }}
                thumbColor={quietZoneEnabled ? '#00838F' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Customizable Template for the User's Own Case Study Idea */}
          <View style={styles.customFeatureContainer}>
            <Text style={styles.customHeader}>⚡ YOUR CASE STUDY IDEA</Text>
            <Text style={styles.customSub}>
              Edit the fields below to showcase your exact pitch:
            </Text>

            <TextInput
              style={styles.inputField}
              value={customFeatureName}
              onChangeText={setCustomFeatureName}
              placeholder="Enter your Feature Name"
            />

            <TextInput
              style={[styles.inputField, { height: 70 }]}
              value={customFeatureDetail}
              onChangeText={setCustomFeatureDetail}
              placeholder="Enter feature description & impact"
              multiline
            />
          </View>
        </ScrollView>
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
    backgroundColor: '#1E293B',
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
    color: '#94A3B8',
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  competitionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  competitionTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  competitionSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  featureBox: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8EC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  featureActiveCard: {
    marginTop: 12,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  ecoActiveText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  splitFarePreview: {
    marginTop: 12,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  splitFareText: {
    fontSize: 12,
    color: '#673AB7',
    fontWeight: '600',
  },
  luggageOptionsRow: {
    marginTop: 12,
    gap: 8,
  },
  luggageBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  luggageBtnActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#E65100',
  },
  luggageBtnText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  luggageBtnTextActive: {
    color: '#E65100',
    fontWeight: '700',
  },
  customFeatureContainer: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  customHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  customSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    marginBottom: 12,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 10,
  },
});

