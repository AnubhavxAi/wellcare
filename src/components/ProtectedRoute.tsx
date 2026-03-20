"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, openLogin } = useAuth();
  
  useEffect(() => {
    // If auth state is determined and user is null, trigger login.
    // AuthContext loads user from localStorage immediately, so it's synchronously available.
    if (!user) {
      openLogin();
    }
  }, [user, openLogin]);
  
  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gray-50 min-h-[50vh]">
        <Loader2 className="animate-spin mb-4 text-[var(--color-brand-green)]" size={40} />
        <h2 className="text-xl font-bold text-gray-700">Checking authentication...</h2>
        <p className="text-sm text-gray-500 mt-2">Please log in to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
