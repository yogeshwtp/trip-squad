import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, ItineraryItem, Expense, BudgetCategory, TripMember } from '../types/models';

interface TripState {
  trips: Trip[];
  itineraries: ItineraryItem[];
  expenses: Expense[];
  budgetCategories: BudgetCategory[];
  tripMembers: TripMember[];
  isLoaded: boolean;

  loadData: () => Promise<void>;
  saveData: () => Promise<void>;

  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTrip: (id: string) => Trip | undefined;

  addItinerary: (item: Omit<ItineraryItem, 'id'>) => Promise<void>;
  updateItinerary: (id: string, item: Partial<ItineraryItem>) => Promise<void>;
  deleteItinerary: (id: string) => Promise<void>;
  getTripItineraries: (tripId: string) => ItineraryItem[];

  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getTripExpenses: (tripId: string) => Expense[];

  setBudgetCategories: (tripId: string, categories: Omit<BudgetCategory, 'id'>[]) => Promise<void>;
  getTripBudgetCategories: (tripId: string) => BudgetCategory[];

  addTripMember: (member: Omit<TripMember, 'id'>) => Promise<void>;
  removeTripMember: (id: string) => Promise<void>;
  getTripMembers: (tripId: string) => TripMember[];
}

const STORAGE_KEY = '@tripsquad_data';

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  itineraries: [],
  expenses: [],
  budgetCategories: [],
  tripMembers: [],
  isLoaded: false,

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          trips: parsed.trips || [],
          itineraries: parsed.itineraries || [],
          expenses: parsed.expenses || [],
          budgetCategories: parsed.budgetCategories || [],
          tripMembers: parsed.tripMembers || [],
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoaded: true });
    }
  },

  saveData: async () => {
    try {
      const state = get();
      const data = {
        trips: state.trips,
        itineraries: state.itineraries,
        expenses: state.expenses,
        budgetCategories: state.budgetCategories,
        tripMembers: state.tripMembers,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  addTrip: async (trip) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ trips: [...state.trips, newTrip] }));
    await get().saveData();
  },

  updateTrip: async (id, trip) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...trip } : t)),
    }));
    await get().saveData();
  },

  deleteTrip: async (id) => {
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
      itineraries: state.itineraries.filter((i) => i.tripId !== id),
      expenses: state.expenses.filter((e) => e.tripId !== id),
      budgetCategories: state.budgetCategories.filter((b) => b.tripId !== id),
      tripMembers: state.tripMembers.filter((m) => m.tripId !== id),
    }));
    await get().saveData();
  },

  getTrip: (id) => {
    return get().trips.find((t) => t.id === id);
  },

  addItinerary: async (item) => {
    const newItem: ItineraryItem = {
      ...item,
      id: Date.now().toString(),
    };
    set((state) => ({ itineraries: [...state.itineraries, newItem] }));
    await get().saveData();
  },

  updateItinerary: async (id, item) => {
    set((state) => ({
      itineraries: state.itineraries.map((i) => (i.id === id ? { ...i, ...item } : i)),
    }));
    await get().saveData();
  },

  deleteItinerary: async (id) => {
    set((state) => ({
      itineraries: state.itineraries.filter((i) => i.id !== id),
    }));
    await get().saveData();
  },

  getTripItineraries: (tripId) => {
    return get().itineraries.filter((i) => i.tripId === tripId).sort((a, b) => {
      if (a.dayNumber !== b.dayNumber) {
        return a.dayNumber - b.dayNumber;
      }
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
  },

  addExpense: async (expense) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    set((state) => ({ expenses: [...state.expenses, newExpense] }));
    await get().saveData();
  },

  updateExpense: async (id, expense) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
    }));
    await get().saveData();
  },

  deleteExpense: async (id) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
    await get().saveData();
  },

  getTripExpenses: (tripId) => {
    return get().expenses.filter((e) => e.tripId === tripId);
  },

  setBudgetCategories: async (tripId, categories) => {
    const newCategories: BudgetCategory[] = categories.map((cat) => ({
      ...cat,
      id: `${tripId}-${cat.category}`,
      tripId,
    }));

    set((state) => ({
      budgetCategories: [
        ...state.budgetCategories.filter((b) => b.tripId !== tripId),
        ...newCategories,
      ],
    }));
    await get().saveData();
  },

  getTripBudgetCategories: (tripId) => {
    return get().budgetCategories.filter((b) => b.tripId === tripId);
  },

  addTripMember: async (member) => {
    const newMember: TripMember = {
      ...member,
      id: Date.now().toString(),
    };
    set((state) => ({ tripMembers: [...state.tripMembers, newMember] }));
    await get().saveData();
  },

  removeTripMember: async (id) => {
    set((state) => ({
      tripMembers: state.tripMembers.filter((m) => m.id !== id),
    }));
    await get().saveData();
  },

  getTripMembers: (tripId) => {
    return get().tripMembers.filter((m) => m.tripId === tripId);
  },
}));
