import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { ExpenseCategory } from '@/types/models';
import NeoBrutalistButton from '@/components/NeoBrutalistButton';
import NeoBrutalistCard from '@/components/NeoBrutalistCard';
import { ArrowLeft } from 'lucide-react-native';

const CATEGORIES: ExpenseCategory[] = [
  'Transport',
  'Accommodation',
  'Food',
  'Activities',
  'Miscellaneous',
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;

  const addExpense = useTripStore((state) => state.addExpense);

  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleAddExpense = async () => {
    if (!amount || !description) {
      alert('Please fill in amount and description');
      return;
    }

    await addExpense({
      tripId,
      category,
      amount: parseFloat(amount),
      date,
      description,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NeoBrutalistCard style={styles.formCard}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="500"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Lunch at restaurant"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="2025-10-01"
            placeholderTextColor="#999"
          />
        </NeoBrutalistCard>

        <View style={styles.buttonContainer}>
          <NeoBrutalistButton
            title="Add Expense"
            onPress={handleAddExpense}
            color="#4CD964"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  categoryTextActive: {
    color: '#000000',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});
