import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="bg-gray-50 font-sans custom-scrollbar">
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4f46e5, #3b82f6);
            border-radius: 10px;
          }
        `}
      </style>
      {/* Hero Section */}
      <section
        className="h-screen bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-center flex flex-col items-center justify-center px-6"
        data-aos="fade-up"
      >
        <h1 className="text-6xl font-extrabold leading-tight max-w-4xl">
          Transform Learning, Earn as You Teach
        </h1>
        <p className="text-xl max-w-3xl mx-auto mt-4">
          Share your knowledge, earn credits based on course difficulty, and
          unlock premium content effortlessly.
        </p>
        <Link
          to="/register"
          className="mt-6 px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition-all text-lg"
        >
          Get Started
        </Link>
      </section>

      {/* How It Works */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <h2
          className="text-5xl font-bold mb-12 text-gray-800"
          data-aos="fade-up"
        >
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Upload a Course",
              desc: "Share your expertise with the world by uploading engaging courses.",
            },
            {
              title: "Earn Credits",
              desc: "The difficulty of your course determines the reward credits you earn.",
            },
            {
              title: "Buy Courses",
              desc: "Use earned credits to access exclusive premium courses from top educators.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-3"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay={`${index * 200}`}
            >
              <h3 className="text-2xl font-semibold mb-3 text-indigo-700">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section
        className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-6"
        data-aos="fade-up"
      >
        <h2 className="text-5xl font-bold mb-12 text-gray-800">
          Featured Courses
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            "Advanced Web Development",
            "AI & Machine Learning",
            "UI/UX Design Principles",
          ].map((course, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-3"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay={`${index * 200}`}
            >
              <h3 className="text-2xl font-semibold text-indigo-700">
                {course}
              </h3>
              <p className="text-gray-600 mt-3 text-lg">
                Master this skill with expert-led content and real-world
                projects.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="h-screen flex flex-col justify-center items-center text-center bg-white px-6"
        data-aos="fade-up"
      >
        <h2 className="text-5xl font-bold mb-12 text-gray-800">
          What Our Users Say
        </h2>
        <div
          className="max-w-4xl mx-auto p-10 bg-gray-100 rounded-xl shadow-xl"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          <p className="text-xl italic text-gray-700">
            "This platform has completely changed the way I learn and share
            knowledge. The credit system makes learning more accessible!"
          </p>
          <p className="mt-6 font-semibold text-indigo-700 text-lg">
            - Alex Morgan, Educator & Learner
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-indigo-900 text-white text-center py-8 relative z-10"
        data-aos="fade-up"
        data-aos-anchor-placement="bottom-bottom"
      >
        <p className="text-lg font-light">
          &copy; 2025 CourseCred | Empowering Knowledge Exchange
        </p>
      </footer>
    </div>
  );
};

export default Home;
