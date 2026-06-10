import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}