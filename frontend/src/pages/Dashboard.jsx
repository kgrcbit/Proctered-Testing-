import { useEffect, useState } from "react";
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
    <div className="bg-slate-50 font-sans flex items-center justify-center min-h-[70vh] py-10">
      <div
        className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-200"
        data-aos="fade-up"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4">
          Welcome, {user ? user.name : "Guest"}!
        </h2>
        <p className="text-slate-600 mb-6">
          Manage exams, review attempts, and keep your proctoring settings in
          check.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
