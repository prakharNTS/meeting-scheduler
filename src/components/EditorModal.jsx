import React, { useEffect, useRef, useState } from "react";

/**
 * Modal with dropdowns for Student and Class.
 * - studentOptions: string[] of all student names
 * - classOptions: string[] of all classes
 * - studentLookup: { [name]: { age, class_name, instructor_name } }
 */
export default function EditorModal({
  open,
  initial,
  onClose,
  onSave,
  studentOptions = [],
  classOptions = [],
  studentLookup = {},
}) {
  const [state, setState] = useState(initial ?? null);
  const studentSelectRef = useRef(null);

  useEffect(() => setState(initial ?? null), [initial, open]);

  // Focus the student dropdown when modal opens (cannot reliably "open" native select)
  useEffect(() => {
    if (open && studentSelectRef.current) {
      studentSelectRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const onStudentChange = (name) => {
    const base = studentLookup[name];
    if (base) {
      setState((prev) => ({
        ...prev,
        student_name: name,
        age: base.age,
        class_name: base.class_name,
        instructor_name: base.instructor_name,
      }));
    } else {
      setState((prev) => ({ ...prev, student_name: name }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-2">Edit Meeting</h3>
        {state && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              Date
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.date}
                onChange={(e) => setState({ ...state, date: e.target.value })}
              />
            </label>

            <label className="block">
              Student
              <select
                ref={studentSelectRef}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.student_name}
                onChange={(e) => onStudentChange(e.target.value)}
              >
                {studentOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Class
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.class_name}
                onChange={(e) =>
                  setState({ ...state, class_name: e.target.value })
                }
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Age
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.age}
                onChange={(e) =>
                  setState({ ...state, age: Number(e.target.value) })
                }
              />
            </label>

            <label className="block">
              Attendance
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.attendance}
                onChange={(e) =>
                  setState({ ...state, attendance: e.target.value })
                }
              >
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              Instructor
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.instructor_name || ""}
                onChange={(e) =>
                  setState({ ...state, instructor_name: e.target.value })
                }
              />
            </label>

            <label className="block md:col-span-2">
              Meeting Link
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={state.meeting_link}
                onChange={(e) =>
                  setState({ ...state, meeting_link: e.target.value })
                }
              />
            </label>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button
            className="btn bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
            onClick={() => onSave(state)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
