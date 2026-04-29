import { useEffect } from 'react';
import { UserRound, ShieldCheck, BookOpen, Users, CheckSquare, Code2, Atom, Database, Server } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="bg-slate-50 font-sans min-h-[70vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-8" data-aos="fade-up">

          {/* Hero Section */}
          <header className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-2">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 opacity-50 blur-3xl"></div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                ProcTesting
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                About the Platform
              </h1>

              <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-800">
                Product of the{" "}
                <span className="text-rose-600">Information Technology Department</span>
              </p>

              <p className="mt-2 text-lg text-slate-600">
                Chaitanya Bharathi Institute of Technology
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* About */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">What is it?</h2>
                </div>

                <p className="text-slate-700 text-lg leading-relaxed">
                  <strong>ProcTesting</strong> is a secure proctored online examination
                  platform developed to conduct examinations efficiently with integrity,
                  analytics, and streamlined management.
                </p>

                <hr className="my-6 border-slate-100" />

                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Capabilities</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="font-semibold text-sm">Role-based Access</p>
                      <p className="text-sm text-slate-600">Admin, Faculty and Student modules</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50">
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-sm">Exam Management</p>
                      <p className="text-sm text-slate-600">Easy test scheduling and evaluation</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50">
                    <ShieldCheck className="w-5 h-5 text-rose-500" />
                    <div>
                      <p className="font-semibold text-sm">Live Proctoring</p>
                      <p className="text-sm text-slate-600">Real-time monitoring during exams</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-2xl bg-slate-50">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-sm">Analytics</p>
                      <p className="text-sm text-slate-600">Performance insights and reports</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tech Stack */}
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Tech Stack</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border">MongoDB</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border">Express.js</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border">React.js</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border">Node.js</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-50 border">Tailwind CSS</span>
                </div>
              </section>
            </div>

            {/* Right Side Faculty */}
            <div className="lg:col-span-1">
              <section className="bg-slate-900 rounded-3xl shadow-lg p-6 sm:p-8 text-white sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <UserRound className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h2 className="text-xl font-bold">Faculty Contributors</h2>
                    <p className="text-sm text-slate-400">Academic Guidance</p>
                  </div>
                </div>

                <div className="space-y-5">

                  <div>
                    <p className="font-semibold text-lg">K Gangadhara Rao</p>
                    <p className="text-slate-400 text-sm">Assistant Professor, IT</p>
                  </div>

                  <hr className="border-slate-700" />

                  <div>
                    <p className="font-semibold text-lg">K Ramakrishna</p>
                    <p className="text-slate-400 text-sm">Professor, IT</p>
                  </div>

                  <hr className="border-slate-700" />

                  <div>
                    <p className="font-semibold text-lg">Ramadevi N</p>
                    <p className="text-slate-400 text-sm">Professor & Head, AIML</p>
                  </div>

                  <hr className="border-slate-700" />

                  <div>
                    <p className="font-semibold text-lg">Prabhakar</p>
                    <p className="text-slate-400 text-sm">Professor, AIML</p>
                  </div>

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
