import { Navigate, Outlet } from "react-router-dom";
import { useProfileQuery } from "../api/auth/queries";

export default function AuthGuard() {
  const { data, isLoading, isError, isSuccess } = useProfileQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError || !data) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
