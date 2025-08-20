import React, { useMemo } from "react";
import { exportScheduleExcel } from "../lib/excel.js";

export default function ScheduleOverview({
  meetings,
  filters,
  setFilters,
  selectedDates,
  onEdit,
}) {
  const filtered = useMemo(
    () =>
      meetings.filter((m) => {
        if (filters.class_name && m.class_name !== filters.class_name)
          return false;
        if (
          filters.student_name &&
          !m.student_name
            .toLowerCase()
            .includes((filters.student_name || "").toLowerCase())
        )
          return false;
        return true;
      }),
    [meetings, filters]
  );

  const grouped = useMemo(
    () =>
      filtered.reduce((a, m) => {
        (a[m.date] ??= []).push(m);
        return a;
      }, {}),
    [filtered]
  );

  const dates = Object.keys(grouped).sort();
  const allPresent = filtered.filter((x) => x.attendance === "Present").length;
  const allAbsent = filtered.filter((x) => x.attendance === "Absent").length;
  const allLate = filtered.filter((x) => x.attendance === "Late").length;

  return (
    <div
      id="overview-top"
      className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            value={filters.class_name || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                class_name: e.target.value || undefined,
              }))
            }
          >
            <option value="">All Classes</option>
            {Array.from(new Set(meetings.map((m) => m.class_name)))
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
          <input
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            placeholder="Filter by student"
            value={filters.student_name || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                student_name: e.target.value || undefined,
              }))
            }
          />
        </div>
        <button
          className="btn bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
          onClick={() => exportScheduleExcel(filtered)}
        >
          Export to Excel
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
        <StatCard label="Selected Dates" value={selectedDates.length} />
        <StatCard label="All Rows" value={filtered.length} />
        <StatCard
          label="Present"
          value={allPresent}
          valueClass="text-emerald-600"
        />
        <StatCard label="Absent" value={allAbsent} valueClass="text-red-600" />
        <StatCard label="Late" value={allLate} valueClass="text-amber-600" />
      </div>

      {dates.length === 0 && (
        <div className="text-slate-500 mt-3">
          No meetings yet. Select dates and click “Auto-Schedule”.
        </div>
      )}

      {dates.map((d) => {
        const list = grouped[d];
        const present = list.filter((x) => x.attendance === "Present").length;
        const absent = list.filter((x) => x.attendance === "Absent").length;
        const late = list.filter((x) => x.attendance === "Late").length;
        return (
          <div key={d} className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{d}</h3>
              <div className="flex gap-2">
                <Pill> Total {list.length} </Pill>
                <Pill> Present {present} </Pill>
                <Pill> Absent {absent} </Pill>
                <Pill> Late {late} </Pill>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 font-semibold border-b border-slate-200">
                  <th className="text-left pb-2">Student</th>
                  <th className="text-left pb-2">Class</th>
                  <th className="text-left pb-2">Age</th>
                  <th className="text-left pb-2">Link</th>
                  <th className="text-left pb-2">Attendance</th>
                  <th className="text-left pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="py-2">{m.student_name}</td>
                    <td className="py-2">{m.class_name}</td>
                    <td className="py-2">{m.age}</td>
                    <td className="py-2">
                      <a
                        className="text-blue-600 underline"
                        href={m.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    </td>
                    <td className="py-2">{m.attendance}</td>
                    <td className="py-2">
                      <button className="btn" onClick={() => onEdit?.(m)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, valueClass = "" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-600 bg-white">
      {children}
    </span>
  );
}
