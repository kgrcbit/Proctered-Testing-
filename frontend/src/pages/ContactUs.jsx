import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="bg-slate-50 font-sans flex items-center justify-center min-h-[70vh] py-10">
      <div
        className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-200"
        data-aos="fade-up"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6">
          Contact Us
        </h2>
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
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-slate-900 py-3 rounded-md font-semibold hover:bg-emerald-500 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
