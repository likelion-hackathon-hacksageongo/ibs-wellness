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
