from rest_framework import serializers
from .models import ConditionRecord, MealRecord


class ConditionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConditionRecord
        fields = ["id", "comfort_level", "symptoms", "symptom_timing", "note", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class MealRecordSerializer(serializers.ModelSerializer):
    condition = ConditionRecordSerializer(read_only=True)

    class Meta:
        model = MealRecord
        fields = ["id", "menu_name", "meal_type", "portion_size", "meal_time", "tags", "note", "created_at", "condition"]
        read_only_fields = ["id", "created_at"]

    def validate_tags(self, value):
        if not isinstance(value, list) or not all(isinstance(tag, str) for tag in value):
            raise serializers.ValidationError("음식 특성 태그는 문자열 배열이어야 합니다.")
        return value
