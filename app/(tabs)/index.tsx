import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { Plus, MapPin, Calendar, Users } from 'lucide-react-native';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';

export default function HomeScreen() {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);

  const upcomingTrips = trips.filter((t) => t.status === 'Upcoming');
  const ongoingTrips = trips.filter((t) => t.status === 'Ongoing');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const tripDate = new Date(dateString);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TripSquad</Text>
        <Text style={styles.subtitle}>Plan Your Next Adventure</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {ongoingTrips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ongoing Trips</Text>
            {ongoingTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                onPress={() => router.push(`/trip/${trip.id}`)}>
                <NeoBrutalistCard color="#4CD964" style={styles.tripCard}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripDestination}>{trip.destination}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>LIVE</Text>
                    </View>
                  </View>
                  <View style={styles.tripDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color="#000" />
                      <Text style={styles.detailText}>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users size={16} color="#000" />
                      <Text style={styles.detailText}>
                        {trip.numTravelers} {trip.tripType}
                      </Text>
                    </View>
                  </View>
                </NeoBrutalistCard>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Trips</Text>
            {upcomingTrips.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/trip/create')}>
                <View style={styles.addButton}>
                  <Plus size={24} color="#000" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {upcomingTrips.length === 0 ? (
            <NeoBrutalistCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>No upcoming trips yet!</Text>
              <Text style={styles.emptySubtext}>
                Start planning your next adventure
              </Text>
              <View style={styles.emptyButtonContainer}>
                <NeoBrutalistButton
                  title="Create Trip"
                  onPress={() => router.push('/trip/create')}
                  color="#FFD600"
                />
              </View>
            </NeoBrutalistCard>
          ) : (
            upcomingTrips.map((trip) => {
              const daysUntil = getDaysUntil(trip.startDate);
              return (
                <TouchableOpacity
                  key={trip.id}
                  onPress={() => router.push(`/trip/${trip.id}`)}>
                  <NeoBrutalistCard color="#4A90E2" style={styles.tripCard}>
                    <View style={styles.tripHeader}>
                      <Text style={styles.tripDestination}>{trip.destination}</Text>
                      {daysUntil >= 0 && (
                        <View style={styles.daysTag}>
                          <Text style={styles.daysText}>{daysUntil}d</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.tripDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={16} color="#000" />
                        <Text style={styles.detailText}>
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Users size={16} color="#000" />
                        <Text style={styles.detailText}>
                          {trip.numTravelers} {trip.tripType}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <MapPin size={16} color="#000" />
                        <Text style={styles.detailText}>
                          ₹{trip.totalBudget.toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>
                  </NeoBrutalistCard>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Quick Actions removed to avoid redundancy with tab bar */}
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFD600',
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripCard: {
    marginBottom: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  badge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  daysTag: {
    backgroundColor: '#FFD600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#000000',
  },
  daysText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  emptyButtonContainer: {
    width: '100%',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionItem: {
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});
