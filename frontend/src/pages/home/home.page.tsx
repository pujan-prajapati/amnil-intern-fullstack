import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { httpGet } from "../../services/axios.service";

interface User {
  username: string;
  avatar: string;
  email: string;
  phone: string;
}

export const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      document.cookie = `accessToken=${accessToken}; SameSite=Lax; Secure;`;
      document.cookie = `refreshToken=${refreshToken}; SameSite=Lax; Secure;`;
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

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

  return (
    <section className="container my-10">
      {user ? (
        <div className="space-y-5">
          <h1 className="text-4xl">Welcome {user.username}</h1>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      ) : (
        <h1>Welcome. Please login</h1>
      )}
    </section>
  );
};
