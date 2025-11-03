import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExam, getExam, updateExam } from "../utils/api";

const emptyQuestion = (type = "single") => {
  if (type === "text") {
    return {
      type: "text",
      text: "",
      options: [],
      correctAnswers: [],
      points: 1,
    };
  }
  if (type === "mcq") {
    return {
      type: "mcq",
      text: "",
      options: ["", ""],
      correctAnswers: [],
      points: 1,
    };
  }
  return {
    type: "single",
    text: "",
    options: ["", ""],
    correctAnswers: [0],
    points: 1,
  };
};

const ExamEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if present => edit mode
  const isEdit = Boolean(id && id !== "new");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMins: 60,
    windowStart: "",
    windowEnd: "",
    assignment: { college: "", year: [], department: [], section: [] },
    questions: [emptyQuestion()],
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "faculty") {
      navigate("/");
      return;
    }
    if (isEdit) loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadExam = async () => {
    try {
      const { data } = await getExam(id);
      setForm({
        title: data.title || "",
        description: data.description || "",
        durationMins: data.durationMins || 60,
        windowStart: data.window?.start
          ? toLocalDateTime(data.window.start)
          : "",
        windowEnd: data.window?.end ? toLocalDateTime(data.window.end) : "",
        assignment: {
          college: data.assignmentCriteria?.college || "",
          year: data.assignmentCriteria?.year || [],
          department: data.assignmentCriteria?.department || [],
          section: data.assignmentCriteria?.section || [],
        },
        questions:
          data.questions && data.questions.length > 0
            ? data.questions
            : [emptyQuestion()],
      });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to load exam"
      );
    }
  };

  const toLocalDateTime = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const fromLocalToISO = (val) => (val ? new Date(val).toISOString() : "");

  const updateQuestion = (idx, patch) => {
    setForm((f) => {
      const qs = [...f.questions];
      qs[idx] = { ...qs[idx], ...patch };
      return { ...f, questions: qs };
    });
  };

  const addQuestion = () =>
    setForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion()] }));

  const addQuestionOfType = (type) =>
    setForm((f) => ({
      ...f,
      questions: [...f.questions, emptyQuestion(type)],
    }));

  const removeQuestion = (idx) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== idx),
    }));

  const duplicateQuestion = (idx) =>
    setForm((f) => {
      const qs = [...f.questions];
      const copy = JSON.parse(JSON.stringify(qs[idx]));
      qs.splice(idx + 1, 0, copy);
      return { ...f, questions: qs };
    });

  const setOption = (qIdx, optIdx, value) => {
    setForm((f) => {
      const qs = [...f.questions];
      const q = { ...qs[qIdx] };
      const opts = [...(q.options || [])];
      opts[optIdx] = value;
      q.options = opts;
      qs[qIdx] = q;
      return { ...f, questions: qs };
    });
  };

  const addOption = (qIdx) =>
    setForm((f) => {
      const qs = [...f.questions];
      const q = { ...qs[qIdx] };
      q.options = [...(q.options || []), ""];
      qs[qIdx] = q;
      return { ...f, questions: qs };
    });

  const removeOption = (qIdx, optIdx) =>
    setForm((f) => {
      const qs = [...f.questions];
      const q = { ...qs[qIdx] };
      q.options = (q.options || []).filter((_, i) => i !== optIdx);
      // also remove any correctAnswers referencing this index
      q.correctAnswers = (q.correctAnswers || [])
        .filter((i) => i !== optIdx)
        .map((i) => (i > optIdx ? i - 1 : i));
      qs[qIdx] = q;
      return { ...f, questions: qs };
    });

  const toggleCorrect = (qIdx, optIdx, isMulti) =>
    setForm((f) => {
      const qs = [...f.questions];
      const q = { ...qs[qIdx] };
      const curr = new Set(q.correctAnswers || []);
      if (isMulti) {
        if (curr.has(optIdx)) curr.delete(optIdx);
        else curr.add(optIdx);
        q.correctAnswers = Array.from(curr).sort((a, b) => a - b);
      } else {
        q.correctAnswers = [optIdx];
      }
      qs[qIdx] = q;
      return { ...f, questions: qs };
    });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        durationMins: Number(form.durationMins),
        window: {
          start: fromLocalToISO(form.windowStart),
          end: fromLocalToISO(form.windowEnd),
        },
        questions: form.questions.map((q) => ({
          type: q.type,
          text: q.text,
          options:
            q.type === "text" ? [] : (q.options || []).filter((s) => s !== ""),
          correctAnswers: q.type === "text" ? [] : q.correctAnswers || [],
          points: Number(q.points || 1),
        })),
        assignmentCriteria: {
          college: form.assignment.college || undefined,
          year: form.assignment.year,
          department: form.assignment.department,
          section: form.assignment.section,
        },
      };

      if (isEdit) {
        await updateExam(id, payload);
      } else {
        const { data } = await createExam(payload);
        // navigate to edit page of new exam
        navigate(`/faculty/exams/${data._id}`);
        return;
      }
      navigate("/faculty/exams");
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to save exam"
      );
    } finally {
      setSaving(false);
    }
  };

  const years = [1, 2, 3, 4, 5, 6, 7, 8];
  const sections = [1, 2, 3, 4, 5];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          {isEdit ? "Edit Exam" : "Create Exam"}
        </h1>
        <button
          onClick={() => navigate("/faculty/exams")}
          className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M9.53 3.22a.75.75 0 0 1 0 1.06L4.56 9.25H21a.75.75 0 0 1 0 1.5H4.56l4.97 4.97a.75.75 0 1 1-1.06 1.06l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back to list
        </button>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={onSave}
        className="bg-white rounded-lg shadow p-4 md:p-6 space-y-8"
      >
        {/* Basics */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-slate-900">Basics</h2>
            <p className="text-sm text-slate-600">
              Core information students will see before starting.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white placeholder-slate-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                value={form.durationMins}
                onChange={(e) =>
                  setForm({ ...form, durationMins: e.target.value })
                }
                required
              />
              <p className="help mt-1 text-xs text-slate-500">
                Total time allowed in minutes.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <p className="help mt-1 text-xs text-slate-500">
                Optional short summary for students.
              </p>
            </div>
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-slate-900">Scheduling</h2>
            <p className="text-sm text-slate-600">
              Define when the exam can be started by students.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Window start
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                value={form.windowStart}
                onChange={(e) =>
                  setForm({ ...form, windowStart: e.target.value })
                }
                required
              />
              <p className="help mt-1 text-xs text-slate-500">
                Local date and time when students can start.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Window end
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                value={form.windowEnd}
                onChange={(e) =>
                  setForm({ ...form, windowEnd: e.target.value })
                }
                required
              />
              <p className="help mt-1 text-xs text-slate-500">
                Local date and time after which the exam can’t be started.
              </p>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Assignment criteria
            </h2>
            <p className="text-sm text-slate-600">
              Leave a field empty to apply to all. Use comma-separated lists for
              multiple departments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                College
              </label>
              <input
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                value={form.assignment.college}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignment: { ...form.assignment, college: e.target.value },
                  })
                }
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Year
              </label>
              <div className="flex flex-wrap gap-3">
                {years.map((y) => (
                  <label
                    key={y}
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded border text-sm ${
                      form.assignment.year.includes(y)
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-emerald-600"
                      checked={form.assignment.year.includes(y)}
                      onChange={(e) => {
                        const set = new Set(form.assignment.year);
                        e.target.checked ? set.add(y) : set.delete(y);
                        setForm({
                          ...form,
                          assignment: {
                            ...form.assignment,
                            year: Array.from(set),
                          },
                        });
                      }}
                    />
                    <span>{y}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department(s)
              </label>
              <input
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="Comma separated e.g. CSE,EEE"
                value={form.assignment.department.join(", ")}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setForm({
                    ...form,
                    assignment: { ...form.assignment, department: arr },
                  });
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Section(s)
              </label>
              <div className="flex flex-wrap gap-3">
                {sections.map((s) => (
                  <label
                    key={s}
                    className={`inline-flex items-center gap-2 px-2 py-1 rounded border text-sm ${
                      form.assignment.section.includes(s)
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-emerald-600"
                      checked={form.assignment.section.includes(s)}
                      onChange={(e) => {
                        const set = new Set(form.assignment.section);
                        e.target.checked ? set.add(s) : set.delete(s);
                        setForm({
                          ...form,
                          assignment: {
                            ...form.assignment,
                            section: Array.from(set),
                          },
                        });
                      }}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Questions
              </h2>
              <p className="text-sm text-slate-600">
                Create text or choice questions and assign points.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addQuestionOfType("single")}
                className="px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-800"
              >
                Single choice
              </button>
              <button
                type="button"
                onClick={() => addQuestionOfType("mcq")}
                className="px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-800"
              >
                Multiple choice
              </button>
              <button
                type="button"
                onClick={() => addQuestionOfType("text")}
                className="px-3 py-2 rounded-md bg-emerald-600 text-slate-900 font-semibold hover:bg-emerald-500 transition-colors"
              >
                Text
              </button>
            </div>
          </div>
          {form.questions.map((q, idx) => {
            const isChoice = q.type === "single" || q.type === "mcq";
            const multi = q.type === "mcq";
            return (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-slate-900 text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <select
                      className="w-auto px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      value={q.type}
                      onChange={(e) => {
                        const nextType = e.target.value;
                        if (nextType === "text") {
                          updateQuestion(idx, {
                            type: nextType,
                            options: [],
                            correctAnswers: [],
                          });
                        } else if (nextType === "single") {
                          const opts =
                            q.options && q.options.length
                              ? q.options
                              : ["", ""];
                          updateQuestion(idx, {
                            type: nextType,
                            options: opts,
                            correctAnswers: [0],
                          });
                        } else {
                          const opts =
                            q.options && q.options.length
                              ? q.options
                              : ["", ""];
                          updateQuestion(idx, {
                            type: nextType,
                            options: opts,
                            correctAnswers: [],
                          });
                        }
                      }}
                    >
                      <option value="single">Single choice</option>
                      <option value="mcq">Multiple choice</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateQuestion(idx)}
                      className="px-2 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                      title="Duplicate"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M7.5 3A2.25 2.25 0 0 0 5.25 5.25v9A2.25 2.25 0 0 0 7.5 16.5h6A2.25 2.25 0 0 0 15.75 14.25v-9A2.25 2.25 0 0 0 13.5 3h-6Z" />
                        <path d="M7.5 18.75A3.75 3.75 0 0 1 3.75 15V7.5a.75.75 0 0 1 1.5 0V15a2.25 2.25 0 0 0 2.25 2.25h7.5a.75.75 0 0 1 0 1.5h-7.5Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478V5.25h3.375a.75.75 0 0 1 0 1.5h-.62l-.76 11.083A3.75 3.75 0 0 1 14.757 21H9.243a3.75 3.75 0 0 1-3.738-3.167L4.745 6.75h-.62a.75.75 0 0 1 0-1.5H7.5v-.772A2.25 2.25 0 0 1 9.75 2.25h4.5A2.25 2.25 0 0 1 16.5 4.478Zm-6.75 0V5.25h4.5v-.772a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75ZM9.75 9a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6A.75.75 0 0 1 9.75 9Zm4.5 0a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6A.75.75 0 0 1 14.25 9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    className="border rounded-md flex-1 px-3 py-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    placeholder="Enter the question text"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(idx, { text: e.target.value })
                    }
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-700">Points</label>
                    <input
                      type="number"
                      min="0"
                      className="border rounded-md w-24 px-3 py-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      value={q.points}
                      onChange={(e) =>
                        updateQuestion(idx, { points: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {isChoice && (
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        {multi ? (
                          <input
                            type="checkbox"
                            className="accent-emerald-600"
                            checked={(q.correctAnswers || []).includes(oi)}
                            onChange={() => toggleCorrect(idx, oi, true)}
                          />
                        ) : (
                          <input
                            type="radio"
                            name={`q-${idx}-correct`}
                            className="accent-emerald-600"
                            checked={(q.correctAnswers || [])[0] === oi}
                            onChange={() => toggleCorrect(idx, oi, false)}
                          />
                        )}
                        <input
                          className="border rounded-md flex-1 px-3 py-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                          placeholder={`Option ${oi + 1}`}
                          value={opt}
                          onChange={(e) => setOption(idx, oi, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(idx, oi)}
                          className="text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(idx)}
                      className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      + Add option
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="pt-2 flex items-center gap-3">
          <button
            disabled={saving}
            className="bg-emerald-600 text-slate-900 font-semibold px-4 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
          >
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create exam"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/faculty/exams")}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamEditor;
