import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Register = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, mirror: false });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = "/login"; // Redirect after registration
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="bg-slate-50 font-sans flex items-center justify-center min-h-screen p-6">
      <div
        className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200"
        data-aos="fade-up"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-3">
          Create Account
        </h2>
        <p className="text-slate-600 mb-6">
          Join ProcTesting to deliver or take secure online exams.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-700 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
