# IBS Wellness MVP

민감한 장을 가진 사용자가 식사와 식후 상태를 기록하고, 자신의 경험을 바탕으로 다음 식사를 더 편하게 선택하도록 돕는 개인화 웰니스 서비스입니다.

이 서비스는 음식이나 식당을 `안전 / 위험`으로 단정하지 않습니다. 대신 사용자의 과거 기록에서 관찰된 경향과, 양·양념·주문 방식처럼 시도할 수 있는 조절 방법을 제공합니다.

> 의료적 진단·치료를 제공하지 않는 웰니스 참고 서비스입니다.

## 해결하려는 순간

- 외식 메뉴를 골라야 할 때
- 새로운 음식을 먹기 전
- 시험, 면접, 발표, 여행 등 중요한 일정 전
- 최근 반복된 장 불편과 식사 경험을 되돌아보고 싶을 때

## 현재 MVP 기능

| 영역           | 구현 내용                                                        |
| -------------- | ---------------------------------------------------------------- |
| 홈             | 서비스 소개, 첫 기록 안내, 식사 기록·일정 전 가이드 진입점       |
| 식사 기록      | 메뉴, 식사 유형, 섭취량, 시간, 음식 특성 태그 기록               |
| 식후 상태      | 편안함 정도와 세부 상태 기록·수정                                |
| 기록 관리      | 식사 기록 수정·삭제, 오늘 식사 요약, 이전 기록 달력 탐색         |
| 개인 경향      | 음식 특성·섭취량과 식후 상태를 바탕으로 한 간단한 규칙 기반 분석 |
| 일정 전 가이드 | 일정·현재 컨디션·식사 상황에 맞는 메뉴, 섭취량, 주문 팁 제안     |
| 가이드 피드백  | 도움이 됐는지 선택 후 확인해 저장                                |

## 사용자 흐름

```text
홈
 ├─ 식사 기록 → 식후 상태 기록 → 오늘/이전 기록 확인 → 개인 경향 분석
 └─ 일정 전 식사 가이드 → 메뉴·섭취량·주문 팁 확인 → 피드백 남기기
```

## 기술 구성

- Frontend: React + Vite + React Router
- Backend: Django + Django REST Framework
- API 문서: drf-spectacular Swagger UI
- DB: 개발 환경 SQLite (배포 환경 PostgreSQL 또는 Supabase PostgreSQL 검토)
- 배포: AWS 예정

## AI와 목 데이터

MVP에서는 실제 AI API를 호출하지 않습니다.

- `ai/mock_data/menu-catalog.json`: 메뉴별 음식 특성·대체 메뉴·주문 팁
- `ai/mock_data/guide-scenarios.json`: 일정·컨디션별 가이드
- `ai/mock_data/insights.json`: 개인 경향 예시

백엔드는 목 데이터와 간단한 규칙을 사용합니다. 이후에도 동일한 API 응답 형태를 유지한 채 AI 기반 메뉴·재료 추정, 개인 패턴 분석, 상황별 식사 가이드로 확장할 수 있습니다.

## 실행 방법

### Backend

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py runserver
```

- API: `http://localhost:8000/api/`
- Swagger UI: `http://localhost:8000/api/docs/swagger/`

### Frontend

```powershell
cd frontend
npm.cmd run dev
```

- Web: `http://localhost:5173/`

## 프로젝트 구조

```text
frontend/
  src/pages/          # 홈, 식사 기록, 분석, 일정 전 가이드
  src/components/     # 상단 탭, 오늘 식사 표, 기록 달력
backend/
  apps/meals/         # 식사·식후 상태 API
  apps/insights/      # 개인 경향 분석 API
  apps/guides/        # 일정 전 가이드·피드백 API
ai/
  mock_data/          # AI 대체용 목 데이터
```
