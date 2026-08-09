import { NavLink } from "react-router-dom";
const items = [["/", "홈"], ["/meals", "기록"], ["/insights", "분석"], ["/guide", "가이드"]];

export default function AppNavigation() {
  return (
    <nav className="app-nav" aria-label="주요 메뉴">
      {items.map(([path, name]) => (
        <NavLink key={path} to={path} end={path === "/"}>
          {name}
        </NavLink>
      ))}
    </nav>
  );
}
