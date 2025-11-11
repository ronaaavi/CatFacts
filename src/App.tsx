import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import AboutCats from "./pages/AboutCats";
import AdminPanel from "./pages/admin/AdminPanel";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        }
      />

      {/* About Us */}
      <Route
        path="/about"
        element={
          <>
            <Header />
            <AboutUs />
            <Footer />
          </>
        }
      />

      {/* About Cats */}
      <Route
        path="/cats"
        element={
          <>
            <Header />
            <AboutCats />
            <Footer />
          </>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <>
            <AdminPanel />
          </>
        }
      />
    </Routes>
  );
}

export default App;
