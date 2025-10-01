import { View, StyleSheet, ViewStyle } from 'react-native';

interface NeoBrutalistCardProps {
  children: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}

export default function NeoBrutalistCard({
  children,
  color = '#FFFFFF',
  style,
}: NeoBrutalistCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: color }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 4,
    borderColor: '#000000',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
});
