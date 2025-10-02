import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import { estimateStudentBudget } from '@/lib/destinationService';
import { useState, useMemo } from 'react';
import { useTripStore } from '@/store/tripStore';

export default function DestinationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const addTrip = useTripStore((s) => s.addTrip);
  const [days, setDays] = useState<string>('3');
  const [people, setPeople] = useState<string>('2');

  const name = String(params.name || 'Destination');
  const country = String(params.country || '');
  const lat = Number(params.lat || 0);
  const lng = Number(params.lng || 0);

  const parsedDays = Math.max(1, Number(days || 1));
  const parsedPeople = Math.max(1, Number(people || 1));

  const budget = useMemo(() => estimateStudentBudget({ days: parsedDays, people: parsedPeople }), [parsedDays, parsedPeople]);

  const handleCreateTrip = async () => {
    try {
      const today = new Date();
      const end = new Date(today);
      end.setDate(today.getDate() + parsedDays - 1);
      await addTrip({
        destination: `${name}${country ? ', ' + country : ''}`,
        startDate: today.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        totalBudget: Math.round(budget.total),
        tripType: parsedPeople > 1 ? 'Group' : 'Solo',
        numTravelers: parsedPeople,
        status: 'Upcoming',
        description: `Auto-created from destination search (${name}).`,
      });
      router.push('/');
    } catch (e) {
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <NeoBrutalistCard color="#FFD600" style={{ margin: 16 }}>
        <Text style={styles.title}>{name}</Text>
        {country ? <Text style={styles.subtitle}>{country}</Text> : null}
        <Text style={styles.coords}>Lat {lat.toFixed(3)}, Lng {lng.toFixed(3)}</Text>
      </NeoBrutalistCard>

      <NeoBrutalistCard color="#FFFFFF" style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <Text style={styles.label}>Days</Text>
        <TextInput
          keyboardType="number-pad"
          value={days}
          onChangeText={setDays}
          style={styles.input}
        />
        <Text style={[styles.label, { marginTop: 12 }]}>People</Text>
        <TextInput
          keyboardType="number-pad"
          value={people}
          onChangeText={setPeople}
          style={styles.input}
        />
      </NeoBrutalistCard>

      <NeoBrutalistCard color="#FF6B9D" style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Estimated Budget</Text>
        <Text style={styles.budgetLine}>Per person: ₹{Math.round(budget.perPerson).toLocaleString('en-IN')}</Text>
        <Text style={styles.budgetLine}>Total: ₹{Math.round(budget.total).toLocaleString('en-IN')}</Text>
        <View style={{ height: 8 }} />
        <Text style={styles.breakdown}>Accommodation: ₹{Math.round(budget.breakdown.accommodation).toLocaleString('en-IN')}</Text>
        <Text style={styles.breakdown}>Food: ₹{Math.round(budget.breakdown.food).toLocaleString('en-IN')}</Text>
        <Text style={styles.breakdown}>Local Transport: ₹{Math.round(budget.breakdown.localTransport).toLocaleString('en-IN')}</Text>
        <Text style={styles.breakdown}>Activities: ₹{Math.round(budget.breakdown.activities).toLocaleString('en-IN')}</Text>
      </NeoBrutalistCard>

      <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <NeoBrutalistButton title="Create Trip" onPress={handleCreateTrip} color="#4CD964" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
    marginTop: 4,
  },
  coords: {
    marginTop: 8,
    color: '#000',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  budgetLine: {
    color: '#000',
    fontWeight: '700',
  },
  breakdown: {
    color: '#000',
    fontSize: 12,
  },
});


