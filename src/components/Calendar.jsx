import React, { useMemo } from "react";
import { daysOfMonthMatrix, isSameDay, monthLabel, toISO } from "../lib/date";

export default function Calendar({
  cursor,
  onPrev,
  onNext,
  selectedDates,
  onToggle,
  meetings,
}) {
  const grid = useMemo(() => daysOfMonthMatrix(cursor), [cursor]);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button className="btn" onClick={onPrev}>
            ◀
          </button>
          <div className="font-semibold">{monthLabel(cursor)}</div>
          <button className="btn" onClick={onNext}>
            ▶
          </button>
        </div>
        <div className="badge">Selected {selectedDates.length}</div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2 text-slate-500 font-semibold">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {grid.map((d, i) => {
          const iso = toISO(d);
          const isSelected = selectedDates.includes(iso);
          const chips = meetings.filter((m) => m.date === iso).slice(0, 3);
          const today = isSameDay(d, new Date());
          return (
            <button
              key={i}
              className={`rounded-2xl border p-2 min-h-[110px] text-left ${
                isSelected
                  ? "outline outline-[3px] outline-blue-500/40 border-slate-300"
                  : "border-slate-200"
              } ${
                today
                  ? "outline outline-1 outline-dashed outline-slate-400"
                  : ""
              }`}
              onClick={() => onToggle(iso)}
            >
              <div className="text-xs text-slate-500">{d.getDate()}</div>
              <div className="mt-1 flex gap-1 flex-wrap">
                {chips.map((c) => (
                  <span key={c.id} className="chip">
                    {c.student_name.split(" ")[0]} • {c.class_name}
                  </span>
                ))}
                {meetings.filter((m) => m.date === iso).length > 3 && (
                  <span className="chip">
                    +{meetings.filter((m) => m.date === iso).length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
