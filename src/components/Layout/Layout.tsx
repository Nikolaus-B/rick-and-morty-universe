import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Loader } from "../Loader/Loader";
import { Footer } from "../Footer/Footer";

export const Layout = () => {
  return (
    <>
      <Header />

      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </>
  );
};
