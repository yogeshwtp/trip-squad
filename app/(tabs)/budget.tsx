import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function BudgetScreen() {
  const router = useRouter();
  const trips = useTripStore((state) => state.trips);
  const getTripExpenses = useTripStore((state) => state.getTripExpenses);

  const activeTrips = trips.filter((t) => t.status !== 'Completed');

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Transport: '#4A90E2',
      Accommodation: '#FF6B9D',
      Food: '#FF9500',
      Activities: '#4CD964',
      Miscellaneous: '#9B59B6',
    };
    return colors[category] || '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wallet size={32} color="#000" />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Budget Tracker</Text>
          <Text style={styles.subtitle}>Monitor your spending</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTrips.length === 0 ? (
          <NeoBrutalistCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active trips</Text>
            <Text style={styles.emptySubtext}>Create a trip to start tracking budget</Text>
          </NeoBrutalistCard>
        ) : (
          activeTrips.map((trip) => {
            const expenses = getTripExpenses(trip.id);
            const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const remaining = trip.totalBudget - totalSpent;
            const percentUsed = (totalSpent / trip.totalBudget) * 100;

            const categoryExpenses = expenses.reduce((acc, exp) => {
              if (!acc[exp.category]) {
                acc[exp.category] = 0;
              }
              acc[exp.category] += exp.amount;
              return acc;
            }, {} as Record<string, number>);

            const perPersonCost = trip.tripType === 'Group' ? totalSpent / trip.numTravelers : totalSpent;

            return (
              <TouchableOpacity
                key={trip.id}
                onPress={() => router.push(`/trip/${trip.id}`)}>
                <NeoBrutalistCard style={styles.tripCard}>
                  <Text style={styles.tripTitle}>{trip.destination}</Text>

                  <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Budget</Text>
                      <Text style={styles.summaryValue}>
                        ₹{trip.totalBudget.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Spent</Text>
                      <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
                        ₹{totalSpent.toLocaleString('en-IN')}
                      </Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Left</Text>
                      <Text
                        style={[
                          styles.summaryValue,
                          { color: remaining >= 0 ? '#4CD964' : '#FF3B30' },
                        ]}>
                        ₹{Math.abs(remaining).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(percentUsed, 100)}%`,
                            backgroundColor: percentUsed > 100 ? '#FF3B30' : '#000000',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{percentUsed.toFixed(0)}% used</Text>
                  </View>

                  {trip.tripType === 'Group' && (
                    <View style={styles.perPersonContainer}>
                      <Text style={styles.perPersonLabel}>Per Person:</Text>
                      <Text style={styles.perPersonValue}>
                        ₹{perPersonCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                  )}

                  {Object.keys(categoryExpenses).length > 0 && (
                    <View style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>Category Breakdown</Text>
                      {Object.entries(categoryExpenses).map(([category, amount]) => (
                        <View key={category} style={styles.categoryRow}>
                          <View
                            style={[
                              styles.categoryDot,
                              { backgroundColor: getCategoryColor(category) },
                            ]}
                          />
                          <Text style={styles.categoryName}>{category}</Text>
                          <Text style={styles.categoryAmount}>
                            ₹{amount.toLocaleString('en-IN')}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </NeoBrutalistCard>
              </TouchableOpacity>
            );
          })
        )}

        <NeoBrutalistCard color="#FFD600" style={styles.tipCard}>
          <Text style={styles.tipTitle}>Budget Tip</Text>
          <Text style={styles.tipText}>
            Set aside 10-15% of your budget for unexpected expenses. Student trips often have
            surprise costs!
          </Text>
        </NeoBrutalistCard>
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
    backgroundColor: '#4CD964',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerContent: {
    flex: 1,
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
  },
  tripCard: {
    marginBottom: 20,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'right',
  },
  perPersonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: '#000000',
    marginBottom: 16,
  },
  perPersonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  perPersonValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  categorySection: {
    borderTopWidth: 3,
    borderTopColor: '#000000',
    paddingTop: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  tipCard: {
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
});
