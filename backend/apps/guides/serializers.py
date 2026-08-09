from rest_framework import serializers


class GuideRequestSerializer(serializers.Serializer):
    schedule_type = serializers.ChoiceField(choices=["시험", "면접", "발표", "출근", "약속", "여행"])
    current_condition = serializers.ChoiceField(choices=["괜찮음", "조금 예민함", "많이 예민함"])
    dining_context = serializers.ChoiceField(choices=["집밥", "외식", "배달"])


class GuideResponseSerializer(serializers.Serializer):
    headline = serializers.CharField()
    recommendations = serializers.ListField(child=serializers.DictField())
    portion_tip = serializers.CharField()
    evidence = serializers.DictField()
    disclaimer = serializers.CharField()


class GuideFeedbackSerializer(serializers.Serializer):
    rating = serializers.ChoiceField(choices=["helpful", "not_relevant", "other_menu"])
