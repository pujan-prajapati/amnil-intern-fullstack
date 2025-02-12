import { Navigate, Route, Routes } from "react-router-dom";
import {
  ForgotPassword,
  LoginPage,
  RegisterPage,
  ResetPassword,
  VefifyOTP,
} from "../pages/auth";
import { HomeLayout } from "../layout/home.layout";
import { HomePage, ProductsPage } from "../pages/home";

const AppRoutes = () => {
  const token = localStorage.getItem("token") as string | null;

  return (
    <>
      <Routes>
        {/* auth routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VefifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* home routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
