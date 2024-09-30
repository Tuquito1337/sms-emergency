// src/routes/Router.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Messages from "../pages/Messages";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login/Index";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />

        {/* Layout principal con el menú */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
