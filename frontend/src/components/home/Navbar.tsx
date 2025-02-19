import { Avatar, Button, message } from "antd";
import { NavLink } from "react-router-dom";
import { httpGet, httpPost } from "../../services/axios.service";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getLocalStore } from "../../helpers";

interface User {
  avatar: string;
}

export const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const token = getLocalStore("token") as string | null;
  const role = getLocalStore("role") as string | null;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await httpGet("/auth/me", null, true);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await httpPost("/auth/logoutUser", {}, true);

        if (response.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log("Error while logging out", error);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <>
      <header className=" bg-gray-100 ">
        <nav className="container py-4 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-indigo-700">LOGO.</h2>

          <div className="flex gap-6 nav-items">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {token && role === "admin" && (
              <NavLink to="/admin">Dashboard</NavLink>
            )}
          </div>

          <div className="flex items-center gap-4 ">
            {token ? (
              <div className="flex items-center gap-5">
                <Avatar
                  size={"large"}
                  src={user?.avatar || ""}
                  alt="avatar"
                  icon={user?.avatar === "" ? <FaUser /> : ""}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleLogout}
                  loading={loading}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <NavLink to="/login">
                  <Button type="primary" size="large">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="register">
                  <Button size="large">Register</Button>
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};
