import React, { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("App context missing");
  return v;
};

export const AppProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [filters, setFilters] = useState({});
  const value = useMemo(
    () => ({
      selectedDates,
      setSelectedDates,
      meetings,
      setMeetings,
      filters,
      setFilters,
    }),
    [selectedDates, meetings, filters]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
