from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import MealRecord
from .serializers import ConditionRecordSerializer, MealRecordSerializer


@extend_schema(tags=["Meals"], summary="식사 기록 목록 조회 및 생성")
class MealRecordListCreateView(generics.ListCreateAPIView):
    queryset = MealRecord.objects.select_related("condition")
    serializer_class = MealRecordSerializer


@extend_schema(tags=["Meals"], summary="식후 상태 생성 또는 수정", request=ConditionRecordSerializer, responses=ConditionRecordSerializer)
class ConditionRecordCreateUpdateView(APIView):
    def post(self, request, meal_id):
        meal = get_object_or_404(MealRecord, pk=meal_id)
        serializer = ConditionRecordSerializer(getattr(meal, "condition", None), data=request.data)
        serializer.is_valid(raise_exception=True)
        created = not hasattr(meal, "condition")
        serializer.save(meal=meal)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
