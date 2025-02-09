import { Navigate } from "react-router-dom";
import { getLocalStore } from "../helpers";

interface PrivateRouteProps {
  component: JSX.Element;
}

export const PrivateRoute = ({ component }: PrivateRouteProps) => {
  const token = getLocalStore("accessToken") ?? "";
  const is_logged_in = token ? true : false;

  return is_logged_in ? component : <Navigate to={"/login"} />;
};

interface AdminPrivateRouteProps {
  component: JSX.Element;
}

export const AdminPrivateRoute = ({ component }: AdminPrivateRouteProps) => {
  const token = getLocalStore("accessToken") as string | null;
  const user = getLocalStore("user") as { role?: string } | null;

  const is_logged_in = token ? true : false;
  let role = null;

  if (user && user["role"]) {
    role = user["role"].toLowerCase();
  }

  return is_logged_in && role === "admin" ? component : <Navigate to={"/"} />;
};
