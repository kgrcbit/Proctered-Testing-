import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });

    // If already logged in, redirect to dashboard
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Refresh page to update navbar dynamically
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="bg-slate-50 font-sans flex items-center justify-center min-h-[70vh] py-10">
      <div
        className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-200"
        data-aos="fade-up"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-slate-900 py-3 rounded-md font-semibold hover:bg-emerald-500 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-slate-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-emerald-700 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
