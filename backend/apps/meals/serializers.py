from rest_framework import serializers
from .models import MealRecord


class MealRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealRecord
        fields = ["id", "menu_name", "meal_type", "portion_size", "meal_time", "tags", "note", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_tags(self, value):
        if not isinstance(value, list) or not all(isinstance(tag, str) for tag in value):
            raise serializers.ValidationError("음식 특성 태그는 문자열 배열이어야 합니다.")
        if len(value) > 8:
            raise serializers.ValidationError("음식 특성 태그는 최대 8개까지 선택할 수 있습니다.")
        return value
