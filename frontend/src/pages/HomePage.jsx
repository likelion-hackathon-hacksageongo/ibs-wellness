import { Link } from "react-router-dom";

export default function HomePage() {
  return <main className="page-shell"><header><p className="eyebrow">IBS WELLNESS</p><h1>내 몸의 신호를 이해하고,<br />다음 식사를 더 편하게.</h1><p>민감한 장을 위한 식사 기록과 개인화된 일상 식사 가이드입니다.</p></header><section className="card"><h2>이렇게 사용해요</h2><ol><li><strong>식사 기록</strong><p>먹은 메뉴와 섭취량을 간단히 남겨요.</p></li><li><strong>식후 상태 기록</strong><p>편안함 또는 불편함을 체크해요.</p></li><li><strong>나만의 식사 경향 확인</strong><p>기록에서 관찰된 경향을 다음 선택에 참고해요.</p></li></ol><Link className="submit-button" to="/meals">첫 식사 기록 시작하기</Link></section><section className="card records"><h2>중요한 일정이 있다면</h2><p>발표나 면접 전, 현재 컨디션에 맞는 메뉴·양·주문 팁을 받아보세요.</p><Link className="text-button" to="/guide">일정 전 식사 가이드 보기</Link></section><footer>의료적 진단이 아닌 기록 기반의 웰니스 참고 정보입니다.</footer></main>;
}
