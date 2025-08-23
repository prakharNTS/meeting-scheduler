import React, { useMemo, useState } from "react";
import Calendar from "./components/Calendar";
import EditorModal from "./components/EditorModal";
import ScheduleOverview from "./components/ScheduleOverview";
import { addDays, addMonths, toISO } from "./lib/date";
import { schedule } from "./lib/scheduler";
import { DUMMY_API_DATA } from "./data/dummy.js";
import "./styles.css";

export default function App() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDates, setSelectedDates] = useState([]); // ISO strings
  const [meetings, setMeetings] = useState([]);
  const [filters, setFilters] = useState({});

  // Build options and lookup from the canonical source (DUMMY_API_DATA)
  const studentOptions = useMemo(
    () => Array.from(new Set(DUMMY_API_DATA.map((s) => s.student_name))).sort(),
    []
  );
  const classOptions = useMemo(
    () => Array.from(new Set(DUMMY_API_DATA.map((s) => s.class_name))).sort(),
    []
  );
  const studentLookup = useMemo(() => {
    const map = {};
    for (const s of DUMMY_API_DATA) {
      map[s.student_name] = {
        age: s.age,
        class_name: s.class_name,
        instructor_name: s.instructor_name,
      };
    }
    return map;
  }, []);

  const toggle = (iso) =>
    setSelectedDates((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso]
    );

  const autoSeed = () => {
    const out = Array.from({ length: 5 }, (_, i) =>
      toISO(addDays(new Date(), i))
    );
    setSelectedDates(out);
  };

  const autoSchedule = () => {
    const next = schedule({ selectedDates, inputs: DUMMY_API_DATA });
    setMeetings(next);
    // Scroll to overview
    setTimeout(() => {
      const el = document.getElementById("overview-top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState();

  const onEditMeeting = (m) => {
    setEditing(m);
    setModalOpen(true);
  };

  const onSaveEdit = (m) => {
    setModalOpen(false);
    if (!m) return;
    setMeetings((prev) => prev.map((x) => (x.id === m.id ? m : x)));
  };

  console.log({ selectedDates });
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Meeting Scheduler</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Calendar
            cursor={cursor}
            onPrev={() => setCursor((c) => addMonths(c, -1))}
            onNext={() => setCursor((c) => addMonths(c, 1))}
            selectedDates={selectedDates}
            onToggle={toggle}
            meetings={meetings}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="btn" onClick={autoSeed}>
              Quick-Select 5 days
            </button>
            <button
              className="btn bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
              onClick={autoSchedule}
              disabled={selectedDates.length === 0}
            >
              Auto-Schedule
            </button>
            <button className="btn" onClick={() => setSelectedDates([])}>
              Clear Dates
            </button>
            <button
              className="btn"
              onClick={() => setMeetings([])}
              disabled={meetings.length === 0}
            >
              Clear Schedule
            </button>
          </div>
        </div>
        <div>
          <ScheduleOverview
            meetings={meetings}
            filters={filters}
            setFilters={setFilters}
            selectedDates={selectedDates}
            onEdit={onEditMeeting}
          />
        </div>
      </div>

      <EditorModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={onSaveEdit}
        studentOptions={studentOptions}
        classOptions={classOptions}
        studentLookup={studentLookup}
      />
    </div>
  );
}
