import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "../features/auth/pages/AuthPage";
import { routes } from "../shared/utils/routes";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path={routes.auth} element={<AuthPage />} />
      <Route path="/*" element={<Navigate to={routes.auth} />} />
    </Routes>
  )
}

export default AuthRoutes;