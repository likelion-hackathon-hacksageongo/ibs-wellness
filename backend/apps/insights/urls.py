from django.urls import path
from .views import InsightListView

urlpatterns = [path("insights/", InsightListView.as_view(), name="insight-list")]
