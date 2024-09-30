// src/routes/Router.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login/Index"; // Asegúrate de importar el componente Login
import MainLayout from "../layouts/MainLayout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<Login />} />

        {/* Layout principal con el menú */}
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
