import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import { getDestinationImage, getNearbySights, getPlaceSummary } from '@/lib/destinationService';

export default function PlaceInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = String(params.name || '');
  const country = String(params.country || '');
  const lat = Number(params.lat || 0);
  const lon = Number(params.lng || 0);

  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [summary, setSummary] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [sights, setSights] = useState<{ title: string; imageUrl?: string; distance: number }[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [img, sum, poi] = await Promise.all([
          getDestinationImage(name),
          getPlaceSummary(name),
          getNearbySights(lat, lon, 8000, 8),
        ]);
        if (!isMounted) return;
        setImageUrl(img || sum?.imageUrl);
        setSummary(sum?.summary);
        setSights(poi.map((p) => ({ title: p.title, imageUrl: p.imageUrl, distance: p.distance })));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [name, lat, lon]);

  const goCreate = () => {
    const label = `${name}${country ? ', ' + country : ''}`;
    router.push({ pathname: '/trip/create', params: { prefillDestination: label } });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ padding: 24 }}>
          <ActivityIndicator color="#000" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <NeoBrutalistCard color="#FFD600" style={{ margin: 16 }}>
            <Text style={styles.title}>{name}</Text>
            {country ? <Text style={styles.subtitle}>{country}</Text> : null}
          </NeoBrutalistCard>

          {imageUrl ? (
            <NeoBrutalistCard color="#FFFFFF" style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <Image source={{ uri: imageUrl }} style={{ height: 220, width: '100%', borderWidth: 2, borderColor: '#000' }} resizeMode="cover" />
            </NeoBrutalistCard>
          ) : null}

          {summary ? (
            <NeoBrutalistCard color="#FFFFFF" style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>About</Text>
              <Text style={styles.paragraph}>{summary}</Text>
            </NeoBrutalistCard>
          ) : null}

          {sights.length > 0 ? (
            <NeoBrutalistCard color="#FFFFFF" style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Nearby Highlights</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {sights.map((s, idx) => (
                  <View key={idx} style={{ width: '47%' }}>
                    {s.imageUrl ? (
                      <Image source={{ uri: s.imageUrl }} style={{ height: 90, borderWidth: 2, borderColor: '#000', marginBottom: 6 }} resizeMode="cover" />
                    ) : (
                      <View style={{ height: 90, backgroundColor: '#EEE', borderWidth: 2, borderColor: '#000', marginBottom: 6 }} />
                    )}
                    <Text style={styles.sightTitle} numberOfLines={2}>{s.title}</Text>
                  </View>
                ))}
              </View>
            </NeoBrutalistCard>
          ) : null}

          <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            <NeoBrutalistButton title="Create Trip" onPress={goCreate} color="#4CD964" />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  subtitle: { color: '#000', opacity: 0.8, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  paragraph: { color: '#000', lineHeight: 20 },
  sightTitle: { color: '#000', fontSize: 12, fontWeight: '700' },
});


