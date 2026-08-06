export type UserRole = "admin" | "assistant" | "accountant";

export interface Clinic {
  id: string;
  name: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface ClinicUser {
  uid: string;
  clinicId: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  clinicId: string;
  fullName: string;
  documentId: string;
  email?: string;
  phone: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  medicalHistoryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  treatmentName: string;
  description?: string;
  toothNumber?: number;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  createdByUid: string;
  createdByName: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discountTotal: number;
  totalAmount: number;
  status: "draft" | "sent" | "approved" | "rejected" | "paid";
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingRecord {
  id: string;
  clinicId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
  patientId?: string;
  quoteId?: string;
  createdByUid: string;
  paymentMethod: "cash" | "card" | "transfer" | "other";
  createdAt: string;
  updatedAt: string;
}

