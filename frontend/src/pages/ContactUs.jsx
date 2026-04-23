import { useEffect } from 'react';
import { Github, Linkedin, Mail, UserRound, ShieldCheck, BookOpen, Users, CheckSquare, Code2, Atom, Database, Server } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="bg-slate-50 font-sans min-h-[70vh] py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-8" data-aos="fade-up">
          
          {/* Hero Section */}
          <header className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-2">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-gradient-to-tr from-rose-100 to-orange-50 opacity-40 blur-2xl"></div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                ProcTesting
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                About the Platform
              </h1>

              <p className="mt-4 text-xl font-bold text-slate-800">
                Product of the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
                  Information Technology
                </span>{" "}
                Department
              </p>

              <p className="mt-2 text-lg text-slate-600">
                Chaitanya Bharathi Institute of Technology
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-8">

              {/* What is it */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold">What is it?</h2>
                </div>

                <p className="text-slate-700 text-lg">
                  <strong>ProcTesting</strong> is a secure proctored examination platform for conducting online exams with integrity.
                </p>
              </section>

              {/* Tech Stack */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-5 h-5 text-purple-600" />
                  <h2 className="text-2xl font-bold">Tech Stack</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="tag"><Database /> MongoDB</span>
                  <span className="tag"><Server /> Express</span>
                  <span className="tag"><Atom /> React</span>
                  <span className="tag"><Server /> Node.js</span>
                </div>
              </section>

            </div>

            {/* RIGHT SIDE - MULTIPLE CARDS */}
            <div className="lg:col-span-1 space-y-6">

              {/* Faculty Contributor */}
              <section className="bg-slate-900 rounded-3xl p-6 text-white">
                <h2 className="text-lg font-bold mb-2">Faculty Contributor</h2>
                <p>Mr. K. Gangadhar Rao</p>
                <a href="mailto:kgangadhar_it@cbit.ac.in" className="text-sm text-gray-300">
                  kgangadhar_it@cbit.ac.in
                </a>
              </section>

              {/* Developer - Ashwith */}
              <section className="bg-slate-900 rounded-3xl p-6 text-white">
                <h2 className="text-lg font-bold mb-2">Developer</h2>
                <p>Godishala Ashwith</p>
                <p className="text-emerald-400 text-sm">160123737179</p>
                <a href="mailto:ashwithgodishala.work@gmail.com" className="text-sm text-gray-300">
                  ashwithgodishala.work@gmail.com
                </a>
              </section>

              {/* Developer - Bhargav */}
              <section className="bg-slate-900 rounded-3xl p-6 text-white">
                <h2 className="text-lg font-bold mb-2">Developer</h2>
                <p>Bhargav Ram K</p>
                <p className="text-emerald-400 text-sm">160123737173</p>
              </section>

              


            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
