import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import LMSDashboard from "./pages/LMSDashboard";
import InstructorProfile from "./pages/InstructorProfile";
import GlobalAlert from "./components/GlobalAlert";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <GlobalAlert />
      <Routes>

        {/* Public Website with Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/instructor-profile" element={<InstructorProfile />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Panel (Separate) */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Student LMS Dashboard (Separate) */}
        <Route path="/lms" element={<LMSDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
