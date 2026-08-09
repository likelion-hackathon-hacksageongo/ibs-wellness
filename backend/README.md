# Backend

Django + Django REST Framework 기반 API 서버입니다.

## Setup

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

가상환경을 아직 만들지 않았다면 `python -m venv .venv` 후 `pip install -r requirements.txt`를 실행합니다.

## API documentation

서버 실행 후 [Swagger UI](http://localhost:8000/api/docs/swagger/)에서 API를 확인하고 요청을 테스트할 수 있습니다.

- `GET /api/meals/` — 최신 식사 기록 목록 조회
- `POST /api/meals/` — 식사 기록 생성
- `GET /api/schema/` — OpenAPI 스키마

## Current Django apps

```text
apps/
  meals/      # 식사 기록 (구현됨), 식후 상태 기록 (다음 단계)
  guides/     # 일정 전 식사 가이드 (예정)
  insights/   # 개인 패턴 분석 (예정)
```
