import { useMemo, useState } from "react";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const keyOf = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export default function MealCalendar({ records, onSelectDate }) {
  const [month, setMonth] = useState(() => new Date());
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return Array.from({ length: first.getDay() + last.getDate() }, (_, index) => index < first.getDay() ? null : new Date(month.getFullYear(), month.getMonth(), index - first.getDay() + 1));
  }, [month]);
  const datesWithRecords = new Set(records.map((record) => keyOf(new Date(record.meal_time))));
  return <section className="meal-calendar"><div className="calendar-header"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><h2>{month.getFullYear()}년 {month.getMonth() + 1}월</h2><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></div><div className="calendar-grid weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map((day, index) => day ? <button key={keyOf(day)} className={datesWithRecords.has(keyOf(day)) ? "has-record" : ""} onClick={() => onSelectDate(day)}>{day.getDate()}</button> : <span key={`empty-${index}`} />)}</div></section>;
}
