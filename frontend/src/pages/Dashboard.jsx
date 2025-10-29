import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });

    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // Redirect if not logged in
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  return (
    <div className="bg-gray-100 font-sans flex items-center justify-center h-screen">
      <div
        className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full text-center"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold text-indigo-700 mb-4">
          Welcome, {user ? user.name : "Guest"}!
        </h2>
        <p className="text-gray-600 mb-6">
          This is your dashboard. Here, you can manage your account and courses.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
