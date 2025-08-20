export async function exportScheduleExcel(meetings) {
  try {
    const XLSX = await import("xlsx");
    const byDate = meetings.reduce((acc, m) => {
      (acc[m.date] ??= []).push(m);
      return acc;
    }, {});
    const wb = XLSX.utils.book_new();
    const classes = Array.from(
      new Set(meetings.map((m) => m.class_name))
    ).sort();

    // Overview
    const dates = Object.keys(byDate).sort();
    const header = ["Date", ...classes, "Present", "Absent", "Late", "Total"];
    const rows = dates.map((d) => {
      const list = byDate[d];
      const perClass = classes.map(
        (c) => list.filter((x) => x.class_name === c).length
      );
      const present = list.filter((x) => x.attendance === "Present").length;
      const absent = list.filter((x) => x.attendance === "Absent").length;
      const late = list.filter((x) => x.attendance === "Late").length;
      return [d, ...perClass, present, absent, late, list.length];
    });
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([header, ...rows]),
      "Overview"
    );

    for (const d of dates) {
      const list = byDate[d];
      const aoa = [
        [
          "Date",
          "Student Name",
          "Class Name",
          "Age",
          "Meeting Link",
          "Attendance Status",
        ],
        ...list.map((m) => [
          m.date,
          m.student_name,
          m.class_name,
          m.age,
          m.meeting_link,
          m.attendance,
        ]),
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), d);
    }
    XLSX.writeFile(wb, "meeting-schedule.xlsx");
  } catch (e) {
    // Fallback CSV per date
    const byDate = meetings.reduce((acc, m) => {
      (acc[m.date] ??= []).push(m);
      return acc;
    }, {});
    const parts = [];
    for (const d of Object.keys(byDate).sort()) {
      parts.push(`Date: ${d}`);
      parts.push("Student Name,Class Name,Age,Meeting Link,Attendance");
      for (const m of byDate[d]) {
        const row = [
          m.student_name,
          m.class_name,
          m.age,
          m.meeting_link,
          m.attendance,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",");
        parts.push(row);
      }
      parts.push("");
    }
    const blob = new Blob([parts.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meeting-schedule.csv";
    a.click();
  }
}
