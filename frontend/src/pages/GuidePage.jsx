import { useState } from "react";
import { createScheduleGuide, sendGuideFeedback } from "../services/meals";

const schedules = ["시험", "면접", "발표", "출근", "약속", "여행"];

export default function GuidePage() {
  const [form, setForm] = useState({ schedule_type: "발표", current_condition: "조금 예민함", dining_context: "외식" });
  const [guide, setGuide] = useState();
  const [feedback, setFeedback] = useState();
  async function submit(event) { event.preventDefault(); setGuide(await createScheduleGuide(form)); setFeedback(); }
  async function saveFeedback() { await sendGuideFeedback(feedback); setFeedback(); }
  return <main className="page-shell"><h1>일정 전 식사 가이드</h1><section className="card"><form onSubmit={submit}><label>일정<select value={form.schedule_type} onChange={(e) => setForm({ ...form, schedule_type: e.target.value })}>{schedules.map((item) => <option key={item}>{item}</option>)}</select></label><label>현재 컨디션<select value={form.current_condition} onChange={(e) => setForm({ ...form, current_condition: e.target.value })}>{["괜찮음", "조금 예민함", "많이 예민함"].map((item) => <option key={item}>{item}</option>)}</select></label><label>식사 상황<select value={form.dining_context} onChange={(e) => setForm({ ...form, dining_context: e.target.value })}>{["집밥", "외식", "배달"].map((item) => <option key={item}>{item}</option>)}</select></label><button className="submit-button">오늘의 식사 가이드 받기</button></form>{guide && <div className="guide-result"><h2>{guide.headline}</h2>{guide.recommendations.map((item) => <article className="insight-card" key={item.menu_id}><strong>{item.name}</strong><p>{item.order_tips.join(" ")}</p></article>)}<p><b>섭취량 팁</b> {guide.portion_tip}</p><small>{guide.evidence.message}</small><div className="feedback"><strong>이 가이드가 도움이 됐나요?</strong>{[["helpful", "도움이 됐어요"], ["not_relevant", "내 상황과 달라요"], ["other_menu", "다른 메뉴가 필요해요"]].map(([value, label]) => <button type="button" className={feedback === value ? "tag selected" : "tag"} onClick={() => setFeedback(value)} key={value}>{label}</button>)}{feedback && <button type="button" className="text-button" onClick={saveFeedback}>이 의견으로 확인하기</button>}</div></div>}</section></main>;
}
