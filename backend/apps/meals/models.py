from django.db import models


class MealRecord(models.Model):
    class MealType(models.TextChoices):
        BREAKFAST = "breakfast", "아침"
        LUNCH = "lunch", "점심"
        DINNER = "dinner", "저녁"
        SNACK = "snack", "간식"

    class PortionSize(models.TextChoices):
        SMALL = "small", "소량"
        MEDIUM = "medium", "보통"
        LARGE = "large", "많음"

    menu_name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20, choices=MealType.choices)
    portion_size = models.CharField(max_length=20, choices=PortionSize.choices)
    meal_time = models.DateTimeField()
    tags = models.JSONField(default=list, blank=True)
    note = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-meal_time", "-created_at"]


class ConditionRecord(models.Model):
    class ComfortLevel(models.TextChoices):
        COMFORTABLE = "comfortable", "편안함"
        SLIGHTLY_UNCOMFORTABLE = "slightly_uncomfortable", "약간 불편함"
        VERY_UNCOMFORTABLE = "very_uncomfortable", "많이 불편함"

    class SymptomTiming(models.TextChoices):
        WITHIN_30_MINUTES = "within_30_minutes", "식후 30분 이내"
        WITHIN_3_HOURS = "within_3_hours", "식후 1~3시간 후"
        UNKNOWN = "unknown", "잘 모르겠음"

    meal = models.OneToOneField(MealRecord, on_delete=models.CASCADE, related_name="condition")
    comfort_level = models.CharField(max_length=30, choices=ComfortLevel.choices)
    symptoms = models.JSONField(default=list, blank=True)
    symptom_timing = models.CharField(max_length=30, choices=SymptomTiming.choices, blank=True)
    note = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
