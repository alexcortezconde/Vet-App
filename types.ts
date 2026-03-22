
export enum AppRole {
  OWNER = 'OWNER',
  VETERINARIAN = 'VETERINARIAN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  role: AppRole;
}

export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  petImageUrl: string;
  reason: string;
  time: string;
  date: string;
  vetName?: string;
  status: 'Confirmed' | 'Pending' | 'InProgress' | 'Completed' | 'Cancelled' | 'NoShow';
  notes?: string;
  prescription?: string;
  consultationFee?: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  time: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'consultation' | 'sale' | 'supply' | 'other';
  appointmentId?: string;
  patientName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minThreshold: number;
  unitPrice: number;
  category?: string;
  description?: string;
  supplier?: string;
  expiryDate?: string;
}

export interface PatientRecord {
  id: string;
  petName: string;
  ownerName: string;
  ownerPhone?: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  imageUrl: string;
  species?: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
}

export interface Vaccine {
  name: string;
  date: string;
  nextDue: string;
}

export interface Deworming {
  internal: { last: string; next: string };
  external: { last: string; next: string };
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'prescription' | 'study' | 'other';
  date: string;
  url: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  weight: number;
  imageUrl: string;
  medicalHistorySummary: string;
  vaccines: Vaccine[];
  deworming: Deworming;
  currentMedications: string[];
  allergies: string[];
  chronicConditions: string[];
  documents: MedicalDocument[];
}

export interface Vet {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  imageUrl: string;
  responseTime: string;
}

export interface HealthRecommendation {
  type: 'info' | 'preventive' | 'urgent';
  title: string;
  message: string;
  doctorReference?: string;
}
