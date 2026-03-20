"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  phone: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  sendOtp: (phone: string, recaptchaContainer: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  otpSent: boolean;
  otpLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user profile
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserProfile({
              uid: firebaseUser.uid,
              phone: data.phone || firebaseUser.phoneNumber || "",
              name: data.name || "",
            });
            // Update lastLogin
            await setDoc(
              userRef,
              { lastLogin: serverTimestamp() },
              { merge: true }
            );
          } else {
            // Create user doc on first login
            const profile = {
              uid: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || "",
              name: "",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userRef, profile);
            setUserProfile({
              uid: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || "",
              name: "",
            });
          }
        } catch {
          // Silently fail — user is still authenticated
          setUserProfile({
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber || "",
            name: "",
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const sendOtp = async (phone: string, recaptchaContainer: string) => {
    setError(null);
    setOtpLoading(true);
    try {
      // Clean up previous verifier
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        size: "invisible",
      });
      setRecaptchaVerifier(verifier);

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      if (firebaseErr.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (firebaseErr.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please check and try again.");
      } else {
        setError(firebaseErr.message || "Failed to send OTP. Please try again.");
      }
      // Clean up on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setError(null);
    setOtpLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error("Please request OTP first.");
      }
      await confirmationResult.confirm(otp);
      // Auth state listener will handle the rest
      setOtpSent(false);
      setConfirmationResult(null);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      if (firebaseErr.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check and try again.");
      } else if (firebaseErr.code === "auth/code-expired") {
        setError("OTP expired. Please request a new one.");
      } else {
        setError(firebaseErr.message || "Verification failed. Please try again.");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setOtpSent(false);
      setConfirmationResult(null);
    } catch {
      setError("Failed to logout. Please try again.");
    }
  };

  const updateUserName = async (name: string) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { name }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, name } : null));
    } catch {
      setError("Failed to update name.");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        sendOtp,
        verifyOtp,
        logout,
        updateUserName,
        error,
        clearError,
        otpSent,
        otpLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
