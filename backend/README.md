# Backend

Django + Django REST Framework 기반 API 서버입니다.

초기에는 `ai/mock_data`의 JSON을 읽어 규칙 기반 응답을 반환하고, 추후 같은 응답 계약을 유지한 채 AI API 호출로 교체합니다.

## Planned Django apps

```text
apps/
  meals/      # 식사 및 식후 상태 기록
  guides/     # 일정 전 식사 가이드
  insights/   # 개인 패턴 분석
```
