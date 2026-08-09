import { useEffect, useState } from "react";
import {
  createMealRecord,
  getInsights,
  getMealRecords,
  saveConditionRecord,
} from "./services/meals";

const TAGS = [
  "매운 음식",
  "기름진 음식",
  "유제품",
  "밀가루",
  "카페인",
  "자극 적음",
  "국물",
  "밥 중심",
];
const TYPES = [
  ["breakfast", "아침"],
  ["lunch", "점심"],
  ["dinner", "저녁"],
  ["snack", "간식"],
];
const PORTIONS = [
  ["small", "소량"],
  ["medium", "보통"],
  ["large", "많음"],
];
const COMFORTS = [
  ["comfortable", "편안함"],
  ["slightly_uncomfortable", "약간 불편함"],
  ["very_uncomfortable", "많이 불편함"],
];
const SYMPTOMS = ["복통", "팽만", "가스", "설사", "변비", "메스꺼움"];
const now = () => {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const label = (values, value) => values.find((x) => x[0] === value)?.[1];

export default function App() {
  const [records, setRecords] = useState([]),
    [insights, setInsights] = useState(null),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false),
    [selected, setSelected] = useState(null);
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
  const load = () => {
    getMealRecords()
      .then(setRecords)
      .catch((e) => setMessage(e.message));
    getInsights()
      .then(setInsights)
      .catch((e) => setMessage(e.message));
  };
  useEffect(load, []);
  const toggle = (key, value, setter) =>
    setter((v) => ({
      ...v,
      [key]: v[key].includes(value)
        ? v[key].filter((x) => x !== value)
        : [...v[key], value],
    }));
  async function addMeal(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createMealRecord({
        ...meal,
        meal_time: new Date(meal.meal_time).toISOString(),
      });
      setMeal({
        menu_name: "",
        meal_type: "lunch",
        portion_size: "medium",
        meal_time: now(),
        tags: [],
        note: "",
      });
      setMessage("식사 기록을 저장했어요.");
      load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function addCondition(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveConditionRecord(selected.id, condition);
      setSelected(null);
      setMessage("식후 상태를 저장했고 분석 결과를 갱신했어요.");
      load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">IBS WELLNESS · MVP</p>
        <h1>
          오늘 먹은 식사를
          <br />
          가볍게 남겨보세요.
        </h1>
        <p>기록이 쌓이면 나에게 편안한 식사 패턴을 함께 찾아드릴게요.</p>
      </header>
      <section className="card">
        <div className="section-heading">
          <span>01</span>
          <h2>식사 기록</h2>
        </div>
        <form onSubmit={addMeal}>
          <label>
            메뉴명 <b>*</b>
            <input
              value={meal.menu_name}
              onChange={(e) => setMeal({ ...meal, menu_name: e.target.value })}
              placeholder="예: 비빔밥"
              required
            />
          </label>
          <div className="field-grid">
            <label>
              식사 유형
              <select
                value={meal.meal_type}
                onChange={(e) =>
                  setMeal({ ...meal, meal_type: e.target.value })
                }
              >
                {TYPES.map((x) => (
                  <option key={x[0]} value={x[0]}>
                    {x[1]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              식사 시간
              <input
                type="datetime-local"
                value={meal.meal_time}
                onChange={(e) =>
                  setMeal({ ...meal, meal_time: e.target.value })
                }
              />
            </label>
          </div>
          <fieldset>
            <legend>섭취량</legend>
            <div className="choice-row">
              {PORTIONS.map((x) => (
                <label className="choice" key={x[0]}>
                  <input
                    type="radio"
                    checked={meal.portion_size === x[0]}
                    onChange={() => setMeal({ ...meal, portion_size: x[0] })}
                  />
                  <span>{x[1]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              음식 특성 <em>선택</em>
            </legend>
            <div className="tag-list">
              {TAGS.map((x) => (
                <button
                  type="button"
                  key={x}
                  className={meal.tags.includes(x) ? "tag selected" : "tag"}
                  onClick={() => toggle("tags", x, setMeal)}
                >
                  {x}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="submit-button" disabled={saving}>
            식사 기록 저장하기
          </button>
        </form>
      </section>
      <section className="card records">
        <div className="section-heading">
          <span>분석</span>
          <h2>나의 식사 경향</h2>
        </div>
        {!insights ? (
          <p>분석을 불러오는 중이에요.</p>
        ) : insights.status === "insufficient_data" ? (
          <p className="empty-state">
            식후 상태 기록이 {insights.completed_record_count}회 있어요.{" "}
            {insights.minimum_record_count}회 이상 쌓이면 나만의 식사 경향을
            보여드릴게요.
          </p>
        ) : (
          <div>
            {insights.insights.map((x) => (
              <article key={x.category} className="insight-card">
                <p className="eyebrow">
                  {x.category === "food_tag" ? "음식 특성" : "섭취량"}
                </p>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
                <small>{x.evidence}</small>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="card records">
        <div className="section-heading">
          <span>최근</span>
          <h2>나의 식사 기록</h2>
        </div>
        {records.length === 0 ? (
          <p className="empty-state">첫 식사를 기록해보세요.</p>
        ) : (
          <ul>
            {records.map((r) => (
              <li key={r.id}>
                <strong>{r.menu_name}</strong>
                <p>
                  {new Date(r.meal_time).toLocaleString("ko-KR")} ·{" "}
                  {label(PORTIONS, r.portion_size)}
                </p>
                <p>
                  {r.condition
                    ? label(COMFORTS, r.condition.comfort_level)
                    : "식후 상태 미기록"}
                </p>
                <button
                  className="text-button"
                  onClick={() => {
                    setSelected(r);
                    setCondition(
                      r.condition ?? {
                        comfort_level: "comfortable",
                        symptoms: [],
                        symptom_timing: "unknown",
                        note: "",
                      },
                    );
                  }}
                >
                  {r.condition ? "상태 수정" : "상태 기록"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {selected && (
        <section className="card records">
          <h2>{selected.menu_name} 식후 상태</h2>
          <form onSubmit={addCondition}>
            <fieldset>
              <legend>지금 속은 어떠세요?</legend>
              <div className="choice-row">
                {COMFORTS.map((x) => (
                  <label className="choice" key={x[0]}>
                    <input
                      type="radio"
                      checked={condition.comfort_level === x[0]}
                      onChange={() =>
                        setCondition({ ...condition, comfort_level: x[0] })
                      }
                    />
                    <span>{x[1]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>
                세부 증상 <em>선택</em>
              </legend>
              <div className="tag-list">
                {SYMPTOMS.map((x) => (
                  <button
                    type="button"
                    key={x}
                    className={
                      condition.symptoms.includes(x) ? "tag selected" : "tag"
                    }
                    onClick={() => toggle("symptoms", x, setCondition)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="submit-button" disabled={saving}>
              상태 저장하기
            </button>
          </form>
        </section>
      )}
      {message && <p className="message">{message}</p>}
      <footer>
        기록상 관찰된 경향은 참고용 정보이며 의료적 진단을 대체하지 않습니다.
      </footer>
    </main>
  );
}
