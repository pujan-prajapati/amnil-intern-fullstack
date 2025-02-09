import { Outlet } from "react-router-dom";
import { Navbar } from "../components/home/Navbar";

export const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
