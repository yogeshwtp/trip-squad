import { View, Text, ScrollView, StyleSheet } from 'react-native';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { Compass, MapPin, TrendingUp } from 'lucide-react-native';

const popularDestinations = [
  { name: 'Goa', budget: '₹8,000-15,000', days: '3-5 days', type: 'Beach' },
  { name: 'Manali', budget: '₹10,000-18,000', days: '4-6 days', type: 'Mountains' },
  { name: 'Rishikesh', budget: '₹5,000-10,000', days: '2-4 days', type: 'Adventure' },
  { name: 'Jaipur', budget: '₹6,000-12,000', days: '3-4 days', type: 'Heritage' },
  { name: 'Udaipur', budget: '₹8,000-14,000', days: '3-4 days', type: 'Heritage' },
  { name: 'Munnar', budget: '₹7,000-13,000', days: '3-5 days', type: 'Hill Station' },
];

const budgetTips = [
  'Travel during off-season for 30-40% cheaper accommodations',
  'Book train tickets in advance for sleeper class savings',
  'Use student hostels and dorms instead of hotels',
  'Cook your own meals when possible or eat at local dhabas',
  'Group trips split costs - accommodation and transport',
];

export default function DiscoverScreen() {
  const getColorForType = (type: string) => {
    const colors: Record<string, string> = {
      Beach: '#4A90E2',
      Mountains: '#4CD964',
      Adventure: '#FF9500',
      Heritage: '#FF6B9D',
      'Hill Station': '#9B59B6',
    };
    return colors[type] || '#FFD600';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Compass size={32} color="#000" />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Popular student destinations</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Trending Destinations</Text>

        {popularDestinations.map((destination, index) => (
          <NeoBrutalistCard
            key={index}
            color={getColorForType(destination.type)}
            style={styles.destinationCard}>
            <View style={styles.destinationHeader}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{destination.type}</Text>
              </View>
            </View>
            <View style={styles.destinationDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{destination.budget}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{destination.days}</Text>
              </View>
            </View>
          </NeoBrutalistCard>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Budget Travel Tips</Text>

        {budgetTips.map((tip, index) => (
          <NeoBrutalistCard key={index} color="#FFD600" style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          </NeoBrutalistCard>
        ))}

        <NeoBrutalistCard color="#FF6B9D" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Student Travel Hacks</Text>
          <Text style={styles.infoText}>
            • Always carry your student ID for discounts{'\n'}
            • ISIC card gets you deals worldwide{'\n'}
            • Check for student railway concessions{'\n'}
            • Hostels offer community and networking{'\n'}
            • Travel in groups to split costs
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
    backgroundColor: '#FF6B9D',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  destinationCard: {
    marginBottom: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  typeBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000000',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  destinationDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {},
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  tipCard: {
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD600',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  infoCard: {
    marginTop: 24,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 22,
  },
});
