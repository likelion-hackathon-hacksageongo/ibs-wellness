from django.urls import path
from .views import GuideCreateView

urlpatterns = [path("guides/", GuideCreateView.as_view(), name="guide-create")]
