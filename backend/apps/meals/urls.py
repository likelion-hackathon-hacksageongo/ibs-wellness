from django.urls import path
from .views import ConditionRecordCreateUpdateView, MealRecordDetailView, MealRecordListCreateView

urlpatterns = [
    path("meals/", MealRecordListCreateView.as_view(), name="meal-list-create"),
    path("meals/<int:pk>/", MealRecordDetailView.as_view(), name="meal-detail"),
    path("meals/<int:meal_id>/condition/", ConditionRecordCreateUpdateView.as_view(), name="condition-create-update"),
]
