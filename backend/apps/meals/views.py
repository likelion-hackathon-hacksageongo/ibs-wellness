from drf_spectacular.utils import extend_schema
from rest_framework import generics
from .models import MealRecord
from .serializers import MealRecordSerializer


@extend_schema(tags=["Meals"], summary="식사 기록 목록 조회 및 생성", description="MVP에서는 인증 없이 단일 데모 사용자의 식사 기록을 관리합니다.")
class MealRecordListCreateView(generics.ListCreateAPIView):
    queryset = MealRecord.objects.all()
    serializer_class = MealRecordSerializer
