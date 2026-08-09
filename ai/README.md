# AI mock layer

MVP에서는 외부 AI를 호출하지 않습니다. 백엔드는 이 디렉터리의 JSON을 읽어 사용자에게 설명 가능한 고정 응답을 제공합니다.

추후 AI API로 전환할 때에도 `contracts/guide-response.schema.json`의 응답 형태를 유지합니다.

## Data files

- `mock_data/menu-catalog.json`: 메뉴별 음식 특성 태그·대체 메뉴·주문 팁
- `mock_data/guide-scenarios.json`: 일정·컨디션 기준 목 가이드
- `mock_data/insights.json`: 기록량에 따른 개인 경향 예시
