import { Route, Routes } from "react-router-dom";
import useCheckAuth from "../features/auth/hooks/useCheckAuth";
import Loader from "../shared/components/Loader";
import AppRoutes from "./AppRoutes";
import AuthRoutes from "./AuthRoutes";

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === 'checking') return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader />
    </div>
  )

  return (
    <Routes>
      {
        status === 'authenticated'
          ? <Route path="/*" element={<AppRoutes />} />
          : <Route path="/*" element={<AuthRoutes />} />
      }
    </Routes>
  )
}