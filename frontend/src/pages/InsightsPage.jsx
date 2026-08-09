import { useEffect, useState } from "react";
import { getInsights } from "../services/meals";

export default function InsightsPage() {
  const [data, setData] = useState();
  useEffect(() => { getInsights().then(setData); }, []);
  return <main className="page-shell"><h1>나의 식사 경향</h1>{!data ? <p>분석을 불러오는 중이에요.</p> : data.status === "insufficient_data" ? <section className="card"><p>식후 상태 기록이 {data.completed_record_count}회 있어요. {data.minimum_record_count}회 이상 쌓이면 경향을 보여드려요.</p></section> : <section className="card">{data.insights.map((insight) => <article className="insight-card" key={insight.category}><p className="eyebrow">{insight.category === "food_tag" ? "음식 특성" : "섭취량"}</p><h2>{insight.title}</h2><p>{insight.description}</p><small>{insight.evidence}</small></article>)}</section>}<footer>기록에서 관찰된 경향은 참고용 정보이며 의료적 진단을 대체하지 않습니다.</footer></main>;
}
