import { Avatar, Button, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { getLocalStore } from "../../helpers";
import { httpPost } from "../../services/axios.service";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

interface User {
  avatar: string;
}

export const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = getLocalStore("user") as User | null;
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await httpPost("/auth/logoutUser", {}, true);

        if (response.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          message.success(response.message);
          navigate("/login");
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
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
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
