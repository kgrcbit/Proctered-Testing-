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
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-gradient-to-tr from-rose-100 to-orange-50 opacity-40 blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                ProcTesting
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                About the Platform
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Product of the {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
                  Information Technology
                </span>{" "}
                Department
              </p>
              <p className="mt-2 text-lg text-slate-600 font-medium">
                Chaitanya Bharathi Institute of Technology
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content (Spans 2 cols on lg screens) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Mission / Overview Section */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">What is it?</h2>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">
                  <strong className="text-slate-900 font-semibold">ProcTesting</strong> is a modern, secure proctored examination platform designed to help educational institutions conduct online assessments with confidence and integrity. It bridges the gap between remote learning and authentic evaluation.
                </p>
                
                <hr className="my-6 border-slate-100" />
                
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <Users className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Role-based Access</p>
                      <p className="text-sm text-slate-600 mt-1">Dedicated portals for Admins, Faculty, and Students.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Exam Management</p>
                      <p className="text-sm text-slate-600 mt-1">Streamlined test creation, organization, and grading.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Proctored Attempts</p>
                      <p className="text-sm text-slate-600 mt-1">Real-time monitoring and event tracking during exams.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Performance Review</p>
                      <p className="text-sm text-slate-600 mt-1">Detailed attempt analytics and simple evaluation.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tech Stack Section */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                    <Code2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Tech Stack</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                    <Database className="w-4 h-4 text-emerald-600" /> MongoDB
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                    <Server className="w-4 h-4 text-slate-800" /> Express.js
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                    <Atom className="w-4 h-4 text-cyan-500" /> React.js
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                    <Server className="w-4 h-4 text-green-600" /> Node.js
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                    <span className="text-teal-500 font-bold text-lg leading-none shrink-0 border-b-2 border-teal-500 h-3 mb-1">~</span> Tailwind CSS
                  </span>
                </div>
              </section>

            </div>

            {/* Right Column - Developer Details */}
            <div className="lg:col-span-1">
              <section className="bg-slate-900 rounded-3xl border border-slate-800 shadow-lg p-6 sm:p-8 text-slate-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <UserRound className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Developer</h2>
                    <p className="text-sm text-slate-400">Project Architect</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="font-medium text-lg text-slate-200">Godishala Ashwith</p>
                  </div>
                  
                  <hr className="border-slate-800" />
                  
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Number</p>
                    <p className="font-mono text-emerald-400 text-lg">160123737179</p>
                  </div>
                  
                  <hr className="border-slate-800" />
                  
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contact</p>
                    <a
                      href="mailto:ashwithgodishala.work@gmail.com"
                      className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors break-all text-sm group"
                    >
                      <Mail className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                      <span className="underline decoration-slate-700 underline-offset-4 group-hover:decoration-emerald-400/50">ashwithgodishala.work@gmail.com</span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex gap-3 flex-col sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href="https://github.com/GodishalaAshwith"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <Github className="w-5 h-5" /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ashwithg"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                </div>
              </section>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
