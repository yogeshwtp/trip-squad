import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { ArrowLeft } from 'lucide-react-native';

export default function AddItineraryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;

  const addItinerary = useTripStore((state) => state.addItinerary);

  const [dayNumber, setDayNumber] = useState('1');
  const [activityName, setActivityName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddItinerary = async () => {
    if (!activityName || !dayNumber) {
      alert('Please fill in activity name and day number');
      return;
    }

    await addItinerary({
      tripId,
      dayNumber: parseInt(dayNumber),
      activityName,
      startTime: startTime || undefined,
      durationMinutes: parseInt(durationMinutes) || 60,
      estimatedCost: parseFloat(estimatedCost) || 0,
      location: location || undefined,
      notes: notes || undefined,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Activity</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NeoBrutalistCard style={styles.formCard}>
          <Text style={styles.label}>Day Number *</Text>
          <TextInput
            style={styles.input}
            value={dayNumber}
            onChangeText={setDayNumber}
            placeholder="1"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Activity Name *</Text>
          <TextInput
            style={styles.input}
            value={activityName}
            onChangeText={setActivityName}
            placeholder="e.g., Visit Red Fort"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Start Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="09:00"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={durationMinutes}
            onChangeText={setDurationMinutes}
            placeholder="60"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Estimated Cost (₹)</Text>
          <TextInput
            style={styles.input}
            value={estimatedCost}
            onChangeText={setEstimatedCost}
            placeholder="500"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Address or landmark"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional details..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </NeoBrutalistCard>

        <View style={styles.buttonContainer}>
          <NeoBrutalistButton
            title="Add Activity"
            onPress={handleAddItinerary}
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
  buttonContainer: {
    marginBottom: 40,
  },
});
