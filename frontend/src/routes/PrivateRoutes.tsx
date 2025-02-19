import { Navigate } from "react-router-dom";
import { getLocalStore } from "../helpers";

interface PrivateRouteProps {
  component: JSX.Element;
}

export const PrivateRoute = ({ component }: PrivateRouteProps) => {
  const token = getLocalStore("token") ?? "";
  const is_logged_in = token ? true : false;

  return is_logged_in ? component : <Navigate to={"/login"} />;
};

interface AdminPrivateRouteProps {
  component: JSX.Element;
}

export const AdminPrivateRoute = ({ component }: AdminPrivateRouteProps) => {
  const token = getLocalStore("token") as string | null;
  const role = getLocalStore("role") as string | null;

  const is_logged_in = token ? true : false;
  if (is_logged_in && role === "admin") {
    return component;
  }

  return <Navigate to={"/"} />;
};
