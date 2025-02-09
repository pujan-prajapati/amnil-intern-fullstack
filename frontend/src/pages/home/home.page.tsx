import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    const userString = queryParams.get("user");

    if (accessToken && userString) {
      localStorage.setItem("token", accessToken);
      const decodedUser = JSON.parse(decodeURIComponent(userString));

      localStorage.setItem("user", JSON.stringify(decodedUser));

      setUser(decodedUser);

      navigate("/");
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [location, navigate]);

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
