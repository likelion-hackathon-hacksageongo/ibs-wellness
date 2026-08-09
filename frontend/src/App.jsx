import { useEffect, useState } from "react";
import {
  createMealRecord,
  createScheduleGuide,
  getInsights,
  getMealRecords,
  saveConditionRecord,
  sendGuideFeedback,
} from "./services/meals";
import "./guide.css";
import "./home.css";
import "./onboarding.css";

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
const schedules = ["시험", "면접", "발표", "출근", "약속", "여행"];
const localNow = () => {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const label = (options, value) => options.find((x) => x[0] === value)?.[1];

export default function App() {
  const [records, setRecords] = useState([]),
    [insights, setInsights] = useState(),
    [guide, setGuide] = useState(),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false),
    [selected, setSelected] = useState(),
    [feedback, setFeedback] = useState();
  const [meal, setMeal] = useState({
    menu_name: "",
    meal_type: "lunch",
    portion_size: "medium",
    meal_time: localNow(),
    tags: [],
    note: "",
  });
  const [condition, setCondition] = useState({
    comfort_level: "comfortable",
    symptoms: [],
    symptom_timing: "unknown",
    note: "",
  });
  const [guideForm, setGuideForm] = useState({
    schedule_type: "발표",
    current_condition: "조금 예민함",
    dining_context: "외식",
  });
  const today = new Date().toDateString();
  const todayMealCount = records.filter((record) => new Date(record.meal_time).toDateString() === today).length;
  const completedConditionCount = records.filter((record) => record.condition).length;
  const load = () => {
    getMealRecords().then(setRecords);
    getInsights().then(setInsights);
  };
  useEffect(load, []);
  const toggle = (key, value, setter) =>
    setter((v) => ({
      ...v,
      [key]: v[key].includes(value)
        ? v[key].filter((x) => x !== value)
        : [...v[key], value],
    }));
  async function submitMeal(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createMealRecord({
        ...meal,
        meal_time: new Date(meal.meal_time).toISOString(),
      });
      setMeal({ ...meal, menu_name: "", meal_time: localNow(), tags: [] });
      setMessage("식사 기록을 저장했어요.");
      load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function submitCondition(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveConditionRecord(selected.id, condition);
      setSelected();
      setMessage("식후 상태를 저장했어요.");
      load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function submitGuide(e) {
    e.preventDefault();
    setSaving(true);
    try {
      setGuide(await createScheduleGuide(guideForm));
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }
  async function submitFeedback() {
    try {
      await sendGuideFeedback(feedback);
      setMessage("의견을 남겨주셔서 감사해요. 다음 가이드를 더 잘 만들게요.");
      setFeedback();
    } catch (e) {
      setMessage(e.message);
    }
  }
  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">IBS WELLNESS · MVP</p>
        <h1>
          오늘의 컨디션에 맞는
          <br />
          식사를 찾아보세요.
        </h1>
        <p>기록을 바탕으로 다음 선택을 더 편하게 도와드릴게요.</p>
      </header>
      <section className="home-summary" aria-label="오늘의 기록 요약">
        <div>
          <span>오늘 식사 기록</span>
          <strong>{todayMealCount}회</strong>
        </div>
        <div>
          <span>식후 상태 기록</span>
          <strong>{completedConditionCount}회</strong>
        </div>
        <a href="#guide">일정 전 가이드 보기</a>
        <a href="#meal-record">식사 기록하기</a>
      </section>
      {records.length === 0 && (
        <section className="onboarding-card" aria-labelledby="onboarding-title">
          <p className="eyebrow">처음이라면</p>
          <h2 id="onboarding-title">3번의 기록으로 나만의 경향을 확인해보세요.</h2>
          <ol>
            <li><span>1</span> 먹은 메뉴와 양을 짧게 기록해요.</li>
            <li><span>2</span> 식후 속 상태를 남겨요.</li>
            <li><span>3</span> 기록에서 관찰된 식사 경향을 확인해요.</li>
          </ol>
          <a className="onboarding-cta" href="#meal-record">첫 식사 기록 시작하기</a>
        </section>
      )}
      <section className="card" id="guide">
        <div className="section-heading">
          <span>가이드</span>
          <h2>중요한 일정 전 식사</h2>
        </div>
        <form onSubmit={submitGuide}>
          <label>
            일정
            <select
              value={guideForm.schedule_type}
              onChange={(e) =>
                setGuideForm({ ...guideForm, schedule_type: e.target.value })
              }
            >
              {schedules.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <div className="field-grid">
            <label>
              현재 컨디션
              <select
                value={guideForm.current_condition}
                onChange={(e) =>
                  setGuideForm({
                    ...guideForm,
                    current_condition: e.target.value,
                  })
                }
              >
                {["괜찮음", "조금 예민함", "많이 예민함"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              식사 상황
              <select
                value={guideForm.dining_context}
                onChange={(e) =>
                  setGuideForm({ ...guideForm, dining_context: e.target.value })
                }
              >
                {["집밥", "외식", "배달"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="submit-button" disabled={saving}>
            오늘의 식사 가이드 받기
          </button>
        </form>
        {guide && (
          <div className="guide-result">
            <h3>{guide.headline}</h3>
            {guide.recommendations.map((x) => (
              <article className="insight-card" key={x.menu_id}>
                <strong>{x.name}</strong>
                <p>{x.order_tips.join(" ")}</p>
              </article>
            ))}
            <p>
              <b>섭취량 팁</b> {guide.portion_tip}
            </p>
            <small>{guide.evidence.message}</small>
            <div className="feedback">
              <strong>이 가이드가 도움이 됐나요?</strong>
              <div className="tag-list">
                {[
                  ["helpful", "도움이 됐어요"],
                  ["not_relevant", "내 상황과 달라요"],
                  ["other_menu", "다른 메뉴가 필요해요"],
                ].map((x) => (
                  <button
                    type="button"
                    key={x[0]}
                    className={feedback === x[0] ? "tag selected" : "tag"}
                    onClick={() => setFeedback(x[0])}
                  >
                    {x[1]}
                  </button>
                ))}
              </div>
              {feedback && (
                <button
                  type="button"
                  className="text-button"
                  onClick={submitFeedback}
                >
                  확인
                </button>
              )}
            </div>
          </div>
        )}
      </section>
      <section className="card records">
        <div className="section-heading">
          <span>분석</span>
          <h2>나의 식사 경향</h2>
        </div>
        {!insights ? (
          <p>불러오는 중이에요.</p>
        ) : insights.status === "insufficient_data" ? (
          <p className="empty-state">
            식후 상태 기록 {insights.completed_record_count}회가 있어요.{" "}
            {insights.minimum_record_count}회부터 경향을 보여드려요.
          </p>
        ) : (
          insights.insights.map((x) => (
            <article className="insight-card" key={x.category}>
              <h3>{x.title}</h3>
              <p>{x.description}</p>
              <small>{x.evidence}</small>
            </article>
          ))
        )}
      </section>
      <section className="card" id="meal-record">
        <div className="section-heading">
          <span>기록</span>
          <h2>식사 기록</h2>
        </div>
        <form onSubmit={submitMeal}>
          <label>
            메뉴명
            <input
              value={meal.menu_name}
              onChange={(e) => setMeal({ ...meal, menu_name: e.target.value })}
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
                {types.map((x) => (
                  <option value={x[0]} key={x[0]}>
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
          <div className="tag-list">
            {tags.map((x) => (
              <button
                type="button"
                className={meal.tags.includes(x) ? "tag selected" : "tag"}
                onClick={() => toggle("tags", x, setMeal)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <button className="submit-button" disabled={saving}>
            식사 기록 저장하기
          </button>
        </form>
      </section>
      <section className="card records">
        <h2>최근 식사</h2>
        <ul>
          {records.map((r) => (
            <li key={r.id}>
              <strong>{r.menu_name}</strong>
              <p>
                {label(portions, r.portion_size)} ·{" "}
                {r.condition
                  ? label(comforts, r.condition.comfort_level)
                  : "식후 상태 미기록"}
              </p>
              <button
                className="text-button"
                onClick={() => {
                  setSelected(r);
                  setCondition(r.condition ?? condition);
                }}
              >
                {r.condition ? "상태 수정" : "상태 기록"}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selected && (
        <section className="card">
          <h2>{selected.menu_name} 식후 상태</h2>
          <form onSubmit={submitCondition}>
            <div className="choice-row">
              {comforts.map((x) => (
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
            <button className="submit-button" disabled={saving}>
              상태 저장하기
            </button>
          </form>
        </section>
      )}
      {message && <p className="message">{message}</p>}
      <footer>의료적 진단이 아닌 기록 기반의 웰니스 참고 정보입니다.</footer>
    </main>
  );
}
