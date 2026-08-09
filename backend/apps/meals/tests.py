from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import MealRecord


class MealRecordApiTests(APITestCase):
    def test_creates_and_lists_a_meal_record(self):
        payload = {"menu_name": "비빔밥", "meal_type": "lunch", "portion_size": "medium", "meal_time": "2026-08-09T12:30:00+09:00", "tags": ["매운 음식", "밥 중심"], "note": "고추장을 조금만 넣었어요."}
        response = self.client.post(reverse("meal-list-create"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MealRecord.objects.count(), 1)
        self.assertEqual(response.data["menu_name"], "비빔밥")
        self.assertEqual(len(self.client.get(reverse("meal-list-create")).data), 1)
