import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type {
  Clinic,
  ClinicUser,
  Patient,
  Quote,
  AccountingRecord,
} from "../types/tenant";

// Helper para referencia a colecciones multi-tenant bajo /clinics/{clinicId}
export const getClinicRef = (clinicId: string) => doc(db, "clinics", clinicId);

export const getPatientsCollection = (clinicId: string) =>
  collection(db, "clinics", clinicId, "patients");

export const getQuotesCollection = (clinicId: string) =>
  collection(db, "clinics", clinicId, "quotes");

export const getAccountingCollection = (clinicId: string) =>
  collection(db, "clinics", clinicId, "accounting");

export const getUsersCollection = (clinicId: string) =>
  collection(db, "clinics", clinicId, "users");

// Servicio principal Multi-tenant
export const tenantService = {
  // --- GESTIÓN DE CLÍNICA ---
  async getClinic(clinicId: string): Promise<Clinic | null> {
    const snap = await getDoc(getClinicRef(clinicId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Clinic;
  },

  async updateClinic(clinicId: string, data: Partial<Clinic>): Promise<void> {
    const ref = getClinicRef(clinicId);
    await updateDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  // --- GESTIÓN DE USUARIOS DE LA CLÍNICA (RBAC) ---
  async getClinicUsers(clinicId: string): Promise<ClinicUser[]> {
    const snap = await getDocs(getUsersCollection(clinicId));
    return snap.docs.map((docSnap) => ({
      uid: docSnap.id,
      ...docSnap.data(),
    })) as ClinicUser[];
  },

  async setClinicUser(clinicId: string, user: ClinicUser): Promise<void> {
    const userRef = doc(db, "clinics", clinicId, "users", user.uid);
    await setDoc(userRef, {
      ...user,
      updatedAt: new Date().toISOString(),
    });
  },

  // --- GESTIÓN DE PACIENTES ---
  async getPatients(clinicId: string): Promise<Patient[]> {
    const q = query(getPatientsCollection(clinicId), orderBy("fullName", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Patient[];
  },

  async createPatient(
    clinicId: string,
    data: Omit<Patient, "id" | "clinicId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(getPatientsCollection(clinicId), {
      ...data,
      clinicId,
      createdAt: now,
      updatedAt: now,
      serverCreatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // --- GESTIÓN DE COTIZACIONES (PRESUPUESTOS) ---
  async getQuotes(clinicId: string): Promise<Quote[]> {
    const q = query(getQuotesCollection(clinicId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Quote[];
  },

  async createQuote(
    clinicId: string,
    data: Omit<Quote, "id" | "clinicId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(getQuotesCollection(clinicId), {
      ...data,
      clinicId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // --- GESTIÓN CONTABLE ---
  async getAccountingRecords(clinicId: string): Promise<AccountingRecord[]> {
    const q = query(getAccountingCollection(clinicId), orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AccountingRecord[];
  },

  async createAccountingRecord(
    clinicId: string,
    data: Omit<AccountingRecord, "id" | "clinicId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(getAccountingCollection(clinicId), {
      ...data,
      clinicId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },
};

