"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthModal from "@/components/AuthModal";

export interface AuthUser {
  phone: string;
  name: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
  openLogin: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Persist login across page refresh using localStorage + Firebase Auth
  useEffect(() => {
    const saved = localStorage.getItem("wellcare_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }

    // Also listen to Firebase auth state to ensure tokens are valid
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("wellcare_user");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSetUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("wellcare_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("wellcare_user");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
    handleSetUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        logout,
        openLogin: () => setShowModal(true),
      }}
    >
      {children}
      {showModal && (
        <AuthModal
          onSuccess={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
