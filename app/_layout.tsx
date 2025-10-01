import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useTripStore } from '@/store/tripStore';
import '../global.css';

export default function RootLayout() {
  useFrameworkReady();
  const loadData = useTripStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
