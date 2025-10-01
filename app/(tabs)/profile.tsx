import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTripStore } from '@/store/tripStore';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import { User, MapPin, Calendar, Wallet, Award } from 'lucide-react-native';

export default function ProfileScreen() {
  const trips = useTripStore((state) => state.trips);
  const expenses = useTripStore((state) => state.expenses);

  const totalTrips = trips.length;
  const completedTrips = trips.filter((t) => t.status === 'Completed').length;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageSpent = totalTrips > 0 ? totalSpent / totalTrips : 0;

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your trips, itineraries, and expenses. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            trips.forEach(async (trip) => {
              await useTripStore.getState().deleteTrip(trip.id);
            });
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={40} color="#000" />
        </View>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>Travel Stats & Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <NeoBrutalistCard color="#4A90E2" style={styles.statCard}>
            <MapPin size={28} color="#000" />
            <Text style={styles.statValue}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </NeoBrutalistCard>

          <NeoBrutalistCard color="#4CD964" style={styles.statCard}>
            <Award size={28} color="#000" />
            <Text style={styles.statValue}>{completedTrips}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </NeoBrutalistCard>
        </View>

        <NeoBrutalistCard color="#FFD600" style={styles.card}>
          <Text style={styles.cardTitle}>Spending Summary</Text>
          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Total Spent</Text>
            <Text style={styles.spendingValue}>₹{totalSpent.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.spendingRow}>
            <Text style={styles.spendingLabel}>Average per Trip</Text>
            <Text style={styles.spendingValue}>
              ₹{averageSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </NeoBrutalistCard>

        <NeoBrutalistCard style={styles.card}>
          <Text style={styles.cardTitle}>About TripSquad</Text>
          <Text style={styles.aboutText}>
            TripSquad is designed specifically for Indian students to plan budget-friendly trips
            with friends. Track expenses, create itineraries, and manage group spending all in one
            place.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </NeoBrutalistCard>

        <NeoBrutalistCard color="#FF6B9D" style={styles.card}>
          <Text style={styles.cardTitle}>Travel Tips for Students</Text>
          <Text style={styles.tipItem}>💡 Always book tickets 2-3 months in advance</Text>
          <Text style={styles.tipItem}>💡 Join travel groups on social media for deals</Text>
          <Text style={styles.tipItem}>💡 Use UPI for easy group payment splits</Text>
          <Text style={styles.tipItem}>💡 Pack light to save on baggage fees</Text>
          <Text style={styles.tipItem}>💡 Download offline maps before traveling</Text>
        </NeoBrutalistCard>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Data Management</Text>
          <NeoBrutalistButton
            title="Clear All Data"
            onPress={handleClearData}
            color="#FF3B30"
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
    backgroundColor: '#9B59B6',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFD600',
    borderWidth: 4,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spendingLabel: {
    fontSize: 14,
    color: '#000000',
  },
  spendingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  aboutText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 16,
  },
  versionContainer: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  versionText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  tipItem: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 8,
  },
  dangerZone: {
    marginBottom: 40,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
  },
});
