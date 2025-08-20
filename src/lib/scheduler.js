function makeLink(seed, n) {
  const code = Math.abs(Math.imul(seed ^ n, 2654435761))
    .toString(36)
    .slice(0, 6);
  return `https://meet.example.com/${code}`;
}

/**
 * Age-priority + class-balanced round-robin with light per-day balancing
 */
export function schedule({ selectedDates, inputs, seed = 42 }) {
  const dates = [...new Set(selectedDates.filter(Boolean))];
  if (dates.length === 0) return [];

  // Expand by meeting count & prioritize by age desc
  const expanded = [];
  for (const s of inputs) {
    for (let i = 0; i < s.meetings; i++) expanded.push({ ...s, nth: i + 1 });
  }
  expanded.sort((a, b) => b.age - a.age);

  const perClassCounter = new Map();
  const perDateCounts = new Map();
  const out = [];
  let n = 1;

  const nextDateIndexByClass = (cls) => {
    const idx = perClassCounter.get(cls) ?? 0;
    perClassCounter.set(cls, (idx + 1) % Math.max(1, dates.length));
    return idx;
  };

  for (const row of expanded) {
    const idx = nextDateIndexByClass(row.class_name);
    const base = dates[idx];

    // choose least-loaded day among cyclic candidates starting at idx
    let pick = base;
    for (let hop = 0; hop < dates.length; hop++) {
      const cand = dates[(idx + hop) % dates.length];
      const count = perDateCounts.get(cand) ?? 0;
      const best = perDateCounts.get(pick) ?? 0;
      if (count < best) pick = cand;
    }

    perDateCounts.set(pick, (perDateCounts.get(pick) ?? 0) + 1);

    out.push({
      id: `${row.student_name}-${row.nth}-${pick}`,
      date: pick,
      student_name: row.student_name,
      class_name: row.class_name,
      age: row.age,
      instructor_name: row.instructor_name,
      meeting_link: makeLink(seed, n++),
      attendance: "Present",
    });
  }
  return out;
}
