from django.urls import path
from .views import GuideCreateView, GuideFeedbackCreateView

urlpatterns = [path("guides/", GuideCreateView.as_view(), name="guide-create"), path("guides/feedback/", GuideFeedbackCreateView.as_view(), name="guide-feedback-create")]
