import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import { ArrowLeft, Calendar, Users, Wallet, MapPin, CreditCard as Edit, Trash2, Plus } from 'lucide-react-native';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;

  const getTrip = useTripStore((state) => state.getTrip);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const getTripItineraries = useTripStore((state) => state.getTripItineraries);
  const getTripExpenses = useTripStore((state) => state.getTripExpenses);
  const getTripBudgetCategories = useTripStore((state) => state.getTripBudgetCategories);

  const trip = getTrip(tripId);
  const itineraries = getTripItineraries(tripId);
  const expenses = getTripExpenses(tripId);
  const budgetCategories = getTripBudgetCategories(tripId);

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'budget'>('overview');

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDeleteTrip = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTrip(tripId);
            router.back();
          },
        },
      ]
    );
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = trip.totalBudget - totalSpent;

  const groupedItineraries = itineraries.reduce((acc, item) => {
    if (!acc[item.dayNumber]) {
      acc[item.dayNumber] = [];
    }
    acc[item.dayNumber].push(item);
    return acc;
  }, {} as Record<number, typeof itineraries>);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{trip.destination}</Text>
          <Text style={styles.subtitle}>{trip.tripType} Trip</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteTrip}>
          <Trash2 size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}>
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'itinerary' && styles.tabActive]}
          onPress={() => setActiveTab('itinerary')}>
          <Text style={[styles.tabText, activeTab === 'itinerary' && styles.tabTextActive]}>
            Itinerary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budget' && styles.tabActive]}
          onPress={() => setActiveTab('budget')}>
          <Text style={[styles.tabText, activeTab === 'budget' && styles.tabTextActive]}>
            Budget
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <>
            <NeoBrutalistCard style={styles.card}>
              <Text style={styles.cardTitle}>Trip Details</Text>
              <View style={styles.detailRow}>
                <Calendar size={20} color="#000" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Dates</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Users size={20} color="#000" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Travelers</Text>
                  <Text style={styles.detailValue}>{trip.numTravelers} people</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Wallet size={20} color="#000" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={styles.detailValue}>₹{trip.totalBudget.toLocaleString('en-IN')}</Text>
                </View>
              </View>
              {trip.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.description}>{trip.description}</Text>
                </View>
              )}
            </NeoBrutalistCard>

            <NeoBrutalistCard color="#4CD964" style={styles.card}>
              <Text style={styles.cardTitle}>Budget Summary</Text>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Total Budget</Text>
                <Text style={styles.budgetValue}>₹{trip.totalBudget.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Total Spent</Text>
                <Text style={[styles.budgetValue, { color: '#FF3B30' }]}>
                  ₹{totalSpent.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={[styles.budgetRow, styles.budgetRowTotal]}>
                <Text style={styles.budgetTotalLabel}>Remaining</Text>
                <Text style={styles.budgetTotalValue}>₹{remaining.toLocaleString('en-IN')}</Text>
              </View>
            </NeoBrutalistCard>

            <View style={styles.quickStats}>
              <NeoBrutalistCard color="#4A90E2" style={styles.statCard}>
                <Text style={styles.statValue}>{itineraries.length}</Text>
                <Text style={styles.statLabel}>Activities</Text>
              </NeoBrutalistCard>
              <NeoBrutalistCard color="#FF6B9D" style={styles.statCard}>
                <Text style={styles.statValue}>{expenses.length}</Text>
                <Text style={styles.statLabel}>Expenses</Text>
              </NeoBrutalistCard>
            </View>
          </>
        )}

        {activeTab === 'itinerary' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Day-wise Plan</Text>
              <TouchableOpacity onPress={() => router.push(`/trip/${tripId}/itinerary/add`)}>
                <View style={styles.addButton}>
                  <Plus size={20} color="#000" />
                </View>
              </TouchableOpacity>
            </View>

            {Object.keys(groupedItineraries).length === 0 ? (
              <NeoBrutalistCard>
                <Text style={styles.emptyText}>No itinerary items yet</Text>
                <Text style={styles.emptySubtext}>Add activities to plan your days</Text>
              </NeoBrutalistCard>
            ) : (
              Object.entries(groupedItineraries).map(([day, items]) => (
                <View key={day} style={styles.daySection}>
                  <Text style={styles.dayTitle}>Day {day}</Text>
                  {items.map((item) => (
                    <NeoBrutalistCard key={item.id} color="#FFD600" style={styles.itineraryCard}>
                      <Text style={styles.activityName}>{item.activityName}</Text>
                      {item.startTime && (
                        <Text style={styles.activityDetail}>
                          ⏰ {item.startTime} ({item.durationMinutes}min)
                        </Text>
                      )}
                      {item.location && (
                        <Text style={styles.activityDetail}>📍 {item.location}</Text>
                      )}
                      <Text style={styles.activityCost}>
                        ₹{item.estimatedCost.toLocaleString('en-IN')}
                      </Text>
                      {item.notes && <Text style={styles.activityNotes}>{item.notes}</Text>}
                    </NeoBrutalistCard>
                  ))}
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'budget' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Expenses</Text>
              <TouchableOpacity onPress={() => router.push(`/trip/${tripId}/expense/add`)}>
                <View style={styles.addButton}>
                  <Plus size={20} color="#000" />
                </View>
              </TouchableOpacity>
            </View>

            <NeoBrutalistCard color="#4CD964" style={styles.card}>
              <View style={styles.budgetProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Budget Used</Text>
                  <Text style={styles.progressValue}>
                    {((totalSpent / trip.totalBudget) * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((totalSpent / trip.totalBudget) * 100, 100)}%`,
                        backgroundColor: totalSpent > trip.totalBudget ? '#FF3B30' : '#000000',
                      },
                    ]}
                  />
                </View>
              </View>
            </NeoBrutalistCard>

            {expenses.length === 0 ? (
              <NeoBrutalistCard>
                <Text style={styles.emptyText}>No expenses tracked yet</Text>
                <Text style={styles.emptySubtext}>Start adding your expenses</Text>
              </NeoBrutalistCard>
            ) : (
              expenses.map((expense) => (
                <NeoBrutalistCard key={expense.id} style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <View>
                      <Text style={styles.expenseDescription}>{expense.description}</Text>
                      <Text style={styles.expenseCategory}>{expense.category}</Text>
                    </View>
                    <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.expenseDate}>
                    {new Date(expense.date).toLocaleDateString('en-IN')}
                  </Text>
                </NeoBrutalistCard>
              ))
            )}
          </>
        )}
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  tabTextActive: {
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetRowTotal: {
    borderTopWidth: 3,
    borderTopColor: '#000000',
    paddingTop: 12,
    marginTop: 4,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#000000',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  budgetTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  budgetTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
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
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FFD600',
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  daySection: {
    marginBottom: 24,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  itineraryCard: {
    marginBottom: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  activityDetail: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  activityCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  activityNotes: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  budgetProgress: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  expenseCard: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  expenseDate: {
    fontSize: 12,
    color: '#666666',
  },
});
