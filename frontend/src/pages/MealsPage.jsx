import { useEffect, useState } from "react";
import {
  createMealRecord,
  deleteMealRecord,
  getMealRecords,
  saveConditionRecord,
  updateMealRecord,
} from "../services/meals";
import TodayMealsTable from "../components/TodayMealsTable";
import MealCalendar from "../components/MealCalendar";
import "./MealsPage.css";

const types = [
  ["breakfast", "아침"],
  ["lunch", "점심"],
  ["dinner", "저녁"],
  ["snack", "간식"],
];
const portions = [
  ["small", "소량"],
  ["medium", "보통"],
  ["large", "많음"],
];
const comforts = [
  ["comfortable", "편안함"],
  ["slightly_uncomfortable", "약간 불편함"],
  ["very_uncomfortable", "많이 불편함"],
];
const tags = [
  "매운 음식",
  "기름진 음식",
  "유제품",
  "밀가루",
  "카페인",
  "자극 적음",
  "국물",
  "밥 중심",
];
const now = () => {
  const date = new Date();
  return new Date(date - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export default function MealsPage() {
  const [records, setRecords] = useState([]),
    [editing, setEditing] = useState(),
    [selected, setSelected] = useState(),
    [selectedDate, setSelectedDate] = useState();
  const [meal, setMeal] = useState({
    menu_name: "",
    meal_type: "lunch",
    portion_size: "medium",
    meal_time: now(),
    tags: [],
    note: "",
  });
  const [condition, setCondition] = useState({
    comfort_level: "comfortable",
    symptoms: [],
    symptom_timing: "unknown",
    note: "",
  });
  const load = () => getMealRecords().then(setRecords);
  useEffect(() => {
    load();
  }, []);
  const toggleTag = (tag) =>
    setMeal((value) => ({
      ...value,
      tags: value.tags.includes(tag)
        ? value.tags.filter((item) => item !== tag)
        : [...value.tags, tag],
    }));
  async function submit(event) {
    event.preventDefault();
    const payload = {
      ...meal,
      meal_time: new Date(meal.meal_time).toISOString(),
    };
    if (editing) await updateMealRecord(editing.id, payload);
    else await createMealRecord(payload);
    setEditing();
    setMeal({
      menu_name: "",
      meal_type: "lunch",
      portion_size: "medium",
      meal_time: now(),
      tags: [],
      note: "",
    });
    load();
  }
  function startEdit(record) {
    const date = new Date(record.meal_time);
    setEditing(record);
    setMeal({
      ...record,
      meal_time: new Date(date - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16),
    });
  }
  async function remove(record) {
    if (window.confirm(`${record.menu_name} 기록을 삭제할까요?`)) {
      await deleteMealRecord(record.id);
      load();
    }
  }
  async function saveCondition(event) {
    event.preventDefault();
    await saveConditionRecord(selected.id, condition);
    setSelected();
    load();
  }
  const selectedDateRecords = selectedDate ? records.filter((record) => new Date(record.meal_time).toDateString() === selectedDate.toDateString()) : [];
  return (
    <main className="page-shell">
      <TodayMealsTable records={records} onEdit={startEdit} onDelete={remove} onCondition={(record) => { setSelected(record); setCondition(record.condition ?? condition); }} />
      <h1>{editing ? "식사 기록 수정" : "식사 기록"}</h1>
      <form onSubmit={submit}>
        <input
          value={meal.menu_name}
          onChange={(e) => setMeal({ ...meal, menu_name: e.target.value })}
          placeholder="메뉴명"
          required
        />
        <select
          value={meal.meal_type}
          onChange={(e) => setMeal({ ...meal, meal_type: e.target.value })}
        >
          {types.map((item) => (
            <option key={item[0]} value={item[0]}>
              {item[1]}
            </option>
          ))}
        </select>
        <select
          value={meal.portion_size}
          onChange={(e) => setMeal({ ...meal, portion_size: e.target.value })}
        >
          {portions.map((item) => (
            <option key={item[0]} value={item[0]}>
              {item[1]}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={meal.meal_time}
          onChange={(e) => setMeal({ ...meal, meal_time: e.target.value })}
        />
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={meal.tags.includes(tag) ? "tag selected" : "tag"}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <button className="submit-button">
          {editing ? "수정 저장" : "식사 기록 저장"}
        </button>
        {editing && (
          <button type="button" onClick={() => setEditing()}>
            수정 취소
          </button>
        )}
      </form>
      <section className="records calendar-history">
        <MealCalendar records={records} onSelectDate={setSelectedDate} />
        {selectedDate && <div className="selected-date-records"><h2>{selectedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} 기록</h2>{selectedDateRecords.length ? <ul>{selectedDateRecords.map((record) => <li key={record.id}><strong>{record.menu_name}</strong><span>{types.find((item) => item[0] === record.meal_type)?.[1]}</span></li>)}</ul> : <p>이 날은 식사 기록이 없어요.</p>}</div>}
      </section>
      {selected && (
        <form onSubmit={saveCondition}>
          <h2>{selected.menu_name} 식후 상태</h2>
          {comforts.map((item) => (
            <label key={item[0]}>
              <input
                type="radio"
                checked={condition.comfort_level === item[0]}
                onChange={() =>
                  setCondition({ ...condition, comfort_level: item[0] })
                }
              />
              {item[1]}
            </label>
          ))}
          <button>상태 저장</button>
        </form>
      )}
    </main>
  );
}
