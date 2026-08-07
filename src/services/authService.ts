import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthService {
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}

const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const authService: AuthService = {
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return mapFirebaseUser(result.user);
    } catch (error: unknown) {
      const authError = error as { code?: string; message?: string };
      if (authError.code === "auth/popup-closed-by-user") {
        throw new Error("Autenticación cancelada por el usuario");
      }
      if (authError.code === "auth/api-key-not-valid" || authError.code === "auth/invalid-api-key") {
        throw new Error("API Key de Firebase no válida. Revisa las variables en el archivo .env");
      }
      if (authError.code === "auth/operation-not-allowed") {
        throw new Error("El proveedor de Google no está habilitado en la consola de Firebase");
      }
      if (authError.code === "auth/unauthorized-domain") {
        throw new Error("El dominio actual (localhost) no está autorizado en Firebase Auth");
      }
      throw error;
    }
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  getCurrentUser(): AuthUser | null {
    return auth.currentUser ? mapFirebaseUser(auth.currentUser as User) : null;
  },

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(user ? mapFirebaseUser(user) : null);
    });
  },
};

export default authService;
