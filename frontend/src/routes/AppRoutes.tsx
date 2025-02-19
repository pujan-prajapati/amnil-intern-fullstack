import { Navigate, Route, Routes } from "react-router-dom";
import {
  ForgotPassword,
  LoginPage,
  RegisterPage,
  ResetPassword,
  VefifyOTP,
} from "../pages/auth";
import { HomePage, ProductsPage } from "../pages/home";
import { AdminLayout, HomeLayout } from "../layout";
import { AdminPrivateRoute } from "./PrivateRoutes";
import { CreateProduct, Dashboard, ViewProducts } from "../pages/admin";
import { getLocalStore } from "../helpers";

const AppRoutes = () => {
  const token = getLocalStore("token") as string | null;

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
          <Route path="products" element={<ProductsPage />} />
        </Route>

        {/* admin routes */}
        <Route
          path="/admin"
          element={<AdminPrivateRoute component={<AdminLayout />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="view-products" element={<ViewProducts />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
