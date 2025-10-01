import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { TripType } from '@/types/models';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { ArrowLeft } from 'lucide-react-native';

export default function CreateTripScreen() {
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [tripType, setTripType] = useState<TripType>('Solo');
  const [numTravelers, setNumTravelers] = useState('1');
  const [description, setDescription] = useState('');

  const handleCreateTrip = async () => {
    if (!destination || !startDate || !endDate || !totalBudget) {
      alert('Please fill in all required fields');
      return;
    }

    await addTrip({
      destination,
      startDate,
      endDate,
      totalBudget: parseFloat(totalBudget),
      tripType,
      numTravelers: parseInt(numTravelers) || 1,
      status: 'Upcoming',
      description,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Trip</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NeoBrutalistCard style={styles.formCard}>
          <Text style={styles.label}>Destination *</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g., Goa, Manali, Kerala"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Start Date * (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="2025-12-01"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>End Date * (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="2025-12-07"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Total Budget * (₹)</Text>
          <TextInput
            style={styles.input}
            value={totalBudget}
            onChangeText={setTotalBudget}
            placeholder="15000"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Trip Type *</Text>
          <View style={styles.tripTypeContainer}>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === 'Solo' && styles.tripTypeButtonActive,
              ]}
              onPress={() => {
                setTripType('Solo');
                setNumTravelers('1');
              }}>
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === 'Solo' && styles.tripTypeTextActive,
                ]}>
                Solo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tripTypeButton,
                tripType === 'Group' && styles.tripTypeButtonActive,
              ]}
              onPress={() => setTripType('Group')}>
              <Text
                style={[
                  styles.tripTypeText,
                  tripType === 'Group' && styles.tripTypeTextActive,
                ]}>
                Group
              </Text>
            </TouchableOpacity>
          </View>

          {tripType === 'Group' && (
            <>
              <Text style={styles.label}>Number of Travelers *</Text>
              <TextInput
                style={styles.input}
                value={numTravelers}
                onChangeText={setNumTravelers}
                placeholder="4"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </>
          )}

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes about your trip..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </NeoBrutalistCard>

        <View style={styles.buttonContainer}>
          <NeoBrutalistButton
            title="Create Trip"
            onPress={handleCreateTrip}
            color="#4CD964"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFD600',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tripTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tripTypeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  tripTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  tripTypeTextActive: {
    color: '#000000',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
