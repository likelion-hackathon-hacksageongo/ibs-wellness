from django.urls import path
from .views import MealRecordListCreateView

urlpatterns = [path("meals/", MealRecordListCreateView.as_view(), name="meal-list-create")]
