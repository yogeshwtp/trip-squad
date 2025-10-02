export type TripType = 'Solo' | 'Group';
export type TripStatus = 'Upcoming' | 'Ongoing' | 'Completed';
export type ExpenseCategory = 'Transport' | 'Accommodation' | 'Food' | 'Activities' | 'Miscellaneous';

export interface Trip {
  id: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  tripType: TripType;
  numTravelers: number;
  status: TripStatus;
  description?: string;
  createdAt: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  dayNumber: number;
  activityName: string;
  startTime?: string;
  durationMinutes: number;
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  paidBy?: string;
}

export interface BudgetCategory {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  allocatedAmount: number;
}

export interface TripMember {
  id: string;
  tripId: string;
  name: string;
  email?: string;
}

export interface Destination {
  id: string; // provider id or stable slug
  name: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'region';
  imageUrl?: string;
}
