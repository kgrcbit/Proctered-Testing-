import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  listAvailableExams,
  listMyExams,
  listAttemptsForExam,
  listFaculty,
} from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = useMemo(() => localStorage.getItem("token"), []);

  // Role-specific data
  const [studentStats, setStudentStats] = useState({
    available: 0,
    inProgress: 0,
    submitted: 0,
    nextWindow: null,
  });
  const [studentActive, setStudentActive] = useState([]);
  const [facultyStats, setFacultyStats] = useState({
    exams: 0,
    inProgress: 0,
  });
  const [currentExam, setCurrentExam] = useState(null);
  const [currentAttempts, setCurrentAttempts] = useState([]);
  const [adminStats, setAdminStats] = useState({
    facultyCount: 0,
    latest: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);
    fetchRoleData(u).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchRoleData = async (u) => {
    try {
      setError("");
      if (u.role === "student") {
        const { data } = await listAvailableExams();
        const available = data.length;
        const inProgress = data.filter(
          (e) => e.status === "in-progress"
        ).length;
        const submitted = data.filter((e) => e.status === "submitted").length;
        const nextWindow =
          data
            .map((e) => e.window?.start)
            .filter(Boolean)
            .map((d) => new Date(d))
            .sort((a, b) => a - b)[0] || null;
        setStudentStats({ available, inProgress, submitted, nextWindow });
        setStudentActive(data);
      } else if (u.role === "faculty") {
        const { data: exams } = await listMyExams();
        const examsCount = exams.length;
        // determine current running exam(s)
        const now = new Date();
        const running = (exams || []).filter((e) => {
          const s = e?.window?.start ? new Date(e.window.start) : null;
          const ed = e?.window?.end ? new Date(e.window.end) : null;
          return s && ed && s <= now && now <= ed;
        });
        running.sort((a, b) => new Date(a.window.end) - new Date(b.window.end));
        const curr = running[0] || null;
        setCurrentExam(curr);
        let inProgress = 0;
        if (curr) {
          const { data: atts } = await listAttemptsForExam(curr._id);
          setCurrentAttempts(atts);
          inProgress = atts.filter((a) => a.status === "in-progress").length;
        } else {
          setCurrentAttempts([]);
        }
        setFacultyStats({ exams: examsCount, inProgress });
      } else if (u.role === "admin") {
        const { data } = await listFaculty(token || "");
        setAdminStats({ facultyCount: data.length, latest: data.slice(0, 5) });
      }
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to load dashboard data"
      );
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-[70vh] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6" data-aos="fade-up">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700">
              Welcome, {user ? user.name : "Guest"}
            </h2>
            {user?.role && (
              <span
                aria-label={`Role: ${user.role}`}
                className="px-3 py-1 rounded-full bg-emerald-600/15 text-emerald-700 border border-emerald-600/30 text-sm font-semibold"
              >
                {user.role.slice(0, 1).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">
            {user?.role === "student" && "Your exam overview and next steps."}
            {user?.role === "faculty" && "Your exams and recent activity."}
            {user?.role === "admin" && "Faculty overview and management."}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4"
            data-aos="fade-up"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="bg-white p-6 rounded-xl shadow border border-slate-200"
            data-aos="fade-up"
          >
            Loading dashboard...
          </div>
        ) : (
          <>
            {user?.role === "student" && (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                data-aos="fade-up"
              >
                <StatCard
                  label="Available exams"
                  value={studentStats.available}
                />
                <StatCard label="In-progress" value={studentStats.inProgress} />
                <StatCard label="Submitted" value={studentStats.submitted} />
              </div>
            )}

            {user?.role === "student" && (
              <div className="mt-6" data-aos="fade-up">
                <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Current exam
                  </h3>
                  {studentActive.length === 0 ? (
                    <p className="text-slate-600 mt-1">
                      No exam is currently active.
                    </p>
                  ) : (
                    <StudentCurrentExam exam={studentActive[0]} />
                  )}
                </div>
              </div>
            )}

            {user?.role === "faculty" && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                data-aos="fade-up"
              >
                <StatCard label="My exams" value={facultyStats.exams} />
                <StatCard
                  label="In-progress (current)"
                  value={facultyStats.inProgress}
                />
              </div>
            )}

            {user?.role === "faculty" && (
              <div className="mt-6" data-aos="fade-up">
                <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Current running exam
                  </h3>
                  {!currentExam ? (
                    <p className="text-slate-600 mt-1">
                      No exam is currently running.
                    </p>
                  ) : (
                    <div className="mt-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-lg font-semibold text-emerald-700">
                            {currentExam.title}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Window:{" "}
                            {new Date(
                              currentExam.window.start
                            ).toLocaleString()}
                            &rarr;{" "}
                            {new Date(currentExam.window.end).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Submissions:{" "}
                            {
                              currentAttempts.filter(
                                (a) => a.status === "submitted"
                              ).length
                            }
                          </span>
                          <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            In-progress:{" "}
                            {
                              currentAttempts.filter(
                                (a) => a.status === "in-progress"
                              ).length
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-slate-800">
                          Recent submissions
                        </h4>
                        {currentAttempts.filter((a) => a.status === "submitted")
                          .length === 0 ? (
                          <p className="text-slate-600 text-sm mt-1">
                            No submissions yet.
                          </p>
                        ) : (
                          <ul className="mt-2 divide-y divide-slate-200">
                            {currentAttempts
                              .filter((a) => a.status === "submitted")
                              .sort(
                                (a, b) =>
                                  new Date(b.submittedAt) -
                                  new Date(a.submittedAt)
                              )
                              .slice(0, 5)
                              .map((a) => {
                                const studentLabel =
                                  a.student?.name ||
                                  a.student?.email ||
                                  a.studentId;
                                const studentSub = a.student?.rollNo
                                  ? ` • ${a.student.rollNo}`
                                  : "";
                                return (
                                  <li
                                    key={a._id}
                                    className="py-2 flex items-center justify-between"
                                  >
                                    <span className="text-sm text-slate-700">
                                      {studentLabel}
                                      {studentSub}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {new Date(a.submittedAt).toLocaleString()}
                                    </span>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user?.role === "admin" && (
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                data-aos="fade-up"
              >
                <StatCard
                  label="Total faculty"
                  value={adminStats.facultyCount}
                />
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Newest faculty
                  </h3>
                  {adminStats.latest.length === 0 ? (
                    <p className="text-slate-600 mt-2">No faculty yet.</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-slate-200">
                      {adminStats.latest.map((f) => (
                        <li
                          key={f._id || f.id}
                          className="py-2 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {f.name}
                            </p>
                            <p className="text-sm text-slate-600">{f.email}</p>
                          </div>
                          <span className="text-sm text-slate-500">
                            {f.createdAt
                              ? new Date(f.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import PropTypes from "prop-types";

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 p-6 text-center">
      <div className="text-3xl font-extrabold text-emerald-700">{value}</div>
      <div className="text-slate-600 mt-1">{label}</div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function StudentCurrentExam({ exam }) {
  const navigate = useNavigate();
  const btn = () => {
    if (exam.status === "in-progress") return "Resume";
    if (exam.status === "submitted") return "Submitted";
    return "Start";
  };
  const disabled = exam.status === "submitted";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
      <div>
        <p className="text-lg font-semibold text-emerald-700">{exam.title}</p>
        <p className="text-slate-600 text-sm">
          Window: {new Date(exam.window.start).toLocaleString()} &rarr;{" "}
          {new Date(exam.window.end).toLocaleString()}
        </p>
        <p className="text-slate-600 text-sm">
          Duration: {exam.durationMins} mins
        </p>
      </div>
      <button
        className={`px-3 py-2 rounded font-semibold transition-colors ${
          disabled
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-emerald-600 text-slate-900 hover:bg-emerald-500"
        }`}
        onClick={() => navigate(`/attempt/${exam._id}`)}
        disabled={disabled}
        title={disabled ? "Already submitted" : "Open exam"}
      >
        {btn()}
      </button>
    </div>
  );
}

StudentCurrentExam.propTypes = {
  exam: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    durationMins: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    window: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
