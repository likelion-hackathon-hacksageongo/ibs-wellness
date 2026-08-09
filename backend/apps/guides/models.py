from django.db import models


class GuideFeedback(models.Model):
    class Rating(models.TextChoices):
        HELPFUL = "helpful", "도움이 됐어요"
        NOT_RELEVANT = "not_relevant", "내 상황과 달라요"
        OTHER_MENU = "other_menu", "다른 메뉴가 필요해요"

    rating = models.CharField(max_length=20, choices=Rating.choices)
    created_at = models.DateTimeField(auto_now_add=True)
