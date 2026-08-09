from django.contrib import admin
from .models import MealRecord


@admin.register(MealRecord)
class MealRecordAdmin(admin.ModelAdmin):
    list_display = ("menu_name", "meal_type", "portion_size", "meal_time", "created_at")
