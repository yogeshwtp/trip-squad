import { View, Text, ScrollView, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { Compass, MapPin, TrendingUp } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchDestinations, getDestinationImage } from '@/lib/destinationService';
import { Destination } from '@/types/models';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Destination[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchDestinations(query.trim(), 10);
        setResults(res);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
        <Text style={styles.sectionTitle}>Search Destinations</Text>
        <NeoBrutalistCard color="#FFFFFF" style={{ marginBottom: 16 }}>
          <TextInput
            placeholder="Search city or region..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          {loading ? (
            <View style={{ paddingTop: 12, paddingBottom: 4 }}>
              <ActivityIndicator color="#000" />
            </View>
          ) : null}
          {results.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={styles.resultItem}
              onPress={() => {
                router.push({ pathname: '/trip/place-info', params: { name: d.name, country: d.country || '', lat: String(d.latitude), lng: String(d.longitude) } });
              }}>
              {d.imageUrl ? (
                <Image source={{ uri: d.imageUrl }} style={styles.resultImage} />
              ) : (
                <View style={[styles.resultImage, { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' }]}>
                  <MapPin size={20} color="#000" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.resultName}>{d.name}</Text>
                <Text style={styles.resultMeta}>{d.country || 'Unknown country'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </NeoBrutalistCard>
        
        <Text style={styles.sectionTitle}>Trending Destinations</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {popularDestinations.map((destination, index) => (
            <View key={index} style={{ width: '48%' }}>
              <NeoBrutalistCard
                color={getColorForType(destination.type)}
                style={styles.destinationCard}>
                <TrendingImage name={destination.name} />
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
            </View>
          ))}
        </View>

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

function TrendingImage({ name }: { name: string }) {
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const u = await getDestinationImage(name);
        if (isMounted) setUri(u);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [name]);
  if (loading) {
    return <View style={{ height: 90, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#000', marginBottom: 8 }} />;
  }
  if (!uri) {
    return <View style={{ height: 90, backgroundColor: '#EEE', borderWidth: 2, borderColor: '#000', marginBottom: 8 }} />;
  }
  return <Image source={{ uri }} style={{ height: 90, width: '100%', borderWidth: 2, borderColor: '#000', marginBottom: 8 }} resizeMode="cover" />;
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
  searchInput: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  resultMeta: {
    fontSize: 12,
    color: '#000',
    opacity: 0.7,
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
