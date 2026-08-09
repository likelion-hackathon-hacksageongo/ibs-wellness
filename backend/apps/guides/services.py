import json
from pathlib import Path

from apps.meals.models import MealRecord


DATA_ROOT = Path(__file__).resolve().parents[3] / "ai" / "mock_data"


def _load(name):
    with (DATA_ROOT / name).open(encoding="utf-8") as file:
        return json.load(file)


def create_guide(data):
    scenarios = _load("guide-scenarios.json")
    menus = {menu["id"]: menu for menu in _load("menu-catalog.json")["menus"]}
    scenario = next((item for item in scenarios["scenarios"] if data["schedule_type"] in item["scheduleTypes"] and item["condition"] == data["current_condition"]), scenarios["scenarios"][0])
    comfortable = MealRecord.objects.filter(condition__comfort_level="comfortable").order_by("-meal_time").first()
    recommendations = [{"menu_id": menu_id, "name": menus[menu_id]["name"], "order_tips": menus[menu_id]["orderTips"]} for menu_id in scenario["recommendedMenuIds"]]
    evidence = {"type": "personal_record", "message": f"최근 편안함이 기록된 메뉴는 {comfortable.menu_name}이에요. 오늘의 선택에 참고해보세요."} if comfortable else {"type": "general_mock_guide", "message": scenario["generalEvidence"]}
    return {"headline": scenario["headline"], "recommendations": recommendations, "portion_tip": scenario["portionTip"], "evidence": evidence, "disclaimer": scenarios["disclaimer"]}
