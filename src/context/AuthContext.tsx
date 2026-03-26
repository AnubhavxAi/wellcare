"use client";
import { createContext, useContext, useState, 
         useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } 
  from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import AuthModal from "../components/AuthModal";

interface AuthUser {
  phone: string;
  name: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
  openLogin: () => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.phoneNumber) {
        // User is logged in — load their Firestore profile
        try {
          const userRef = doc(db, "users", firebaseUser.phoneNumber);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserState({
              phone: firebaseUser.phoneNumber,
              name: userSnap.data().name || "",
              isLoggedIn: true,
            });
          } else {
            // Document might not exist yet if they just signed up 
            // and the AuthModal hasn't finished setDoc
            setUserState({
              phone: firebaseUser.phoneNumber,
              name: "",
              isLoggedIn: true,
            });
          }
        } catch (err) {
          console.error("Error loading user profile:", err);
          setUserState({
            phone: firebaseUser.phoneNumber,
            name: "",
            isLoggedIn: true,
          });
        }
      } else {
        setUserState(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      logout,
      openLogin: () => setShowModal(true),
      isAuthLoading,
    }}>
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
