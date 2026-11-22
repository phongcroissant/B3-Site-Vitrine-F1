"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Remplace PublicRoute : connexion et inscription, seulement si déconnecté.
export default function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  if (loading || user) return <p className="text-center mt-10">Chargement...</p>;
  return children;
}
