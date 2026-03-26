"use client";
import {
  createContext, useContext, useState,
  useEffect, ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  const router = useRouter();

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.phone) {
        await loadUserProfile(session.user.phone);
      }
      setIsAuthLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user?.phone) {
          await loadUserProfile(session.user.phone);
        } else {
          setUserState(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("name, phone")
        .eq("phone", phone)
        .maybeSingle();

      if (data) {
        setUserState({
          phone,
          name: data.name || "",
          isLoggedIn: true,
        });
      } else {
        setUserState({
          phone,
          name: "",
          isLoggedIn: true,
        });
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
      setUserState({
        phone,
        name: "",
        isLoggedIn: true,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser: setUserState,
      logout,
      openLogin: () => setShowModal(true),
      isAuthLoading,
    }}>
      {children}
      {showModal && (
        <AuthModal
          onSuccess={() => {
            setShowModal(false);
            const redirectPath = localStorage.getItem("wellcare_redirect");
            if (redirectPath) {
              localStorage.removeItem("wellcare_redirect");
              router.push(redirectPath);
            }
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
