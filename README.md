# MVP

민감한 장을 가진 사용자가 중요한 일정 전에 더 편안한 식사를 선택하도록 돕는 개인화 웰니스 서비스의 MVP입니다.

## Workspace structure

- `frontend/`: React 사용자 인터페이스
- `backend/`: Django REST API 및 규칙 기반 목 추천 로직
- `ai/`: 실제 AI 연동 전 사용할 메뉴 사전·가이드·인사이트 목 데이터와 계약

## MVP development order

1. 일정 전 식사 가이드
2. 식사 기록
3. 식후 상태 기록
4. 홈 및 개인 패턴 분석

모든 추천과 분석은 의료적 진단이 아닌 사용자의 기록을 참고한 웰니스 가이드로 표현합니다.

## Implemented: meal records

- 메뉴명, 식사 유형, 섭취량, 식사 시간 기록
- 음식 특성 태그와 메모 입력
- 저장한 식사 기록 목록 조회
- Django REST API와 Swagger(OpenAPI) 문서
