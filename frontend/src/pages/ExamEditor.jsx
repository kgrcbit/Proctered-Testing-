import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExam, getExam, updateExam } from "../utils/api";

const emptyQuestion = () => ({
  type: "single",
  text: "",
  options: ["", ""],
  correctAnswers: [0],
  points: 1,
});

const ExamEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if present => edit mode
  const isEdit = Boolean(id && id !== "new");

  const [user, setUser] = useState(null);
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
    setUser(u);
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

  const removeQuestion = (idx) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== idx),
    }));

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
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Exam" : "Create Exam"}
        </h1>
        <button
          onClick={() => navigate("/faculty/exams")}
          className="text-indigo-600"
        >
          Back to list
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="bg-white rounded shadow p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="border rounded w-full px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration (mins)</label>
            <input
              type="number"
              min="1"
              className="border rounded w-full px-3 py-2"
              value={form.durationMins}
              onChange={(e) =>
                setForm({ ...form, durationMins: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Window start</label>
            <input
              type="datetime-local"
              className="border rounded w-full px-3 py-2"
              value={form.windowStart}
              onChange={(e) =>
                setForm({ ...form, windowStart: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Window end</label>
            <input
              type="datetime-local"
              className="border rounded w-full px-3 py-2"
              value={form.windowEnd}
              onChange={(e) => setForm({ ...form, windowEnd: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="border rounded w-full px-3 py-2"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Assignment criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">College</label>
              <input
                className="border rounded w-full px-3 py-2"
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
              <label className="block text-sm font-medium">Year</label>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <label key={y} className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
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
              <label className="block text-sm font-medium">Department(s)</label>
              <input
                className="border rounded w-full px-3 py-2"
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
              <label className="block text-sm font-medium">Section(s)</label>
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <label key={s} className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Add question
            </button>
          </div>

          {form.questions.map((q, idx) => {
            const isChoice = q.type === "single" || q.type === "mcq";
            const multi = q.type === "mcq";
            return (
              <div key={idx} className="border rounded p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(idx, { type: e.target.value })
                    }
                  >
                    <option value="single">Single choice</option>
                    <option value="mcq">Multiple choice</option>
                    <option value="text">Text</option>
                  </select>
                  <input
                    className="border rounded flex-1 px-3 py-2"
                    placeholder="Question text"
                    value={q.text}
                    onChange={(e) =>
                      updateQuestion(idx, { text: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    className="border rounded w-28 px-3 py-2"
                    value={q.points}
                    onChange={(e) =>
                      updateQuestion(idx, { points: Number(e.target.value) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {isChoice && (
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        {multi ? (
                          <input
                            type="checkbox"
                            checked={(q.correctAnswers || []).includes(oi)}
                            onChange={() => toggleCorrect(idx, oi, true)}
                          />
                        ) : (
                          <input
                            type="radio"
                            name={`q-${idx}-correct`}
                            checked={(q.correctAnswers || [])[0] === oi}
                            onChange={() => toggleCorrect(idx, oi, false)}
                          />
                        )}
                        <input
                          className="border rounded flex-1 px-3 py-2"
                          placeholder={`Option ${oi + 1}`}
                          value={opt}
                          onChange={(e) => setOption(idx, oi, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(idx, oi)}
                          className="text-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(idx)}
                      className="text-indigo-600"
                    >
                      + Add option
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamEditor;
