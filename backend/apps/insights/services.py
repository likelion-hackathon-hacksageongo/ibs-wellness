from collections import defaultdict

from apps.meals.models import MealRecord


MINIMUM_RECORD_COUNT = 3


def _summary(count, uncomfortable_count, subject):
    return {
        "record_count": count,
        "uncomfortable_count": uncomfortable_count,
        "title": f"{subject}이 포함된 식사 후 불편함이 자주 기록됐어요." if uncomfortable_count / count >= 0.6 else f"{subject}이 포함된 식사에서는 비교적 편안한 기록도 있었어요.",
        "description": f"최근 상태 기록 {count}회 중 {uncomfortable_count}회에서 약간 또는 많이 불편함이 기록됐어요.",
        "evidence": "최근 기록 기준 · 원인을 단정하는 결과가 아닌 참고용 경향입니다.",
    }


def build_insights():
    meals = list(MealRecord.objects.select_related("condition").exclude(condition__isnull=True))
    if len(meals) < MINIMUM_RECORD_COUNT:
        return {"status": "insufficient_data", "minimum_record_count": MINIMUM_RECORD_COUNT, "completed_record_count": len(meals), "insights": []}

    tag_stats = defaultdict(lambda: {"count": 0, "uncomfortable": 0})
    portion_stats = defaultdict(lambda: {"count": 0, "uncomfortable": 0})
    for meal in meals:
        uncomfortable = meal.condition.comfort_level != "comfortable"
        for tag in meal.tags:
            tag_stats[tag]["count"] += 1
            tag_stats[tag]["uncomfortable"] += uncomfortable
        portion_stats[meal.portion_size]["count"] += 1
        portion_stats[meal.portion_size]["uncomfortable"] += uncomfortable

    insights = []
    if tag_stats:
        tag, values = max(tag_stats.items(), key=lambda item: (item[1]["count"], item[1]["uncomfortable"]))
        insights.append({"category": "food_tag", "subject": tag, **_summary(values["count"], values["uncomfortable"], tag)})
    portion_labels = {"small": "소량 섭취", "medium": "보통 섭취", "large": "많은 양 섭취"}
    portion, values = max(portion_stats.items(), key=lambda item: (item[1]["count"], -item[1]["uncomfortable"]))
    insights.append({"category": "portion", "subject": portion, **_summary(values["count"], values["uncomfortable"], portion_labels[portion])})
    return {"status": "ready", "minimum_record_count": MINIMUM_RECORD_COUNT, "completed_record_count": len(meals), "insights": insights}
