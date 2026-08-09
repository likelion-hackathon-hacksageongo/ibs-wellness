from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GuideFeedback
from .serializers import GuideFeedbackSerializer, GuideRequestSerializer, GuideResponseSerializer
from .services import create_guide


@extend_schema(tags=["Guides"], summary="일정 전 식사 가이드 생성", request=GuideRequestSerializer, responses=GuideResponseSerializer)
class GuideCreateView(APIView):
    def post(self, request):
        serializer = GuideRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(create_guide(serializer.validated_data))


@extend_schema(tags=["Guides"], summary="식사 가이드 피드백 저장", request=GuideFeedbackSerializer)
class GuideFeedbackCreateView(APIView):
    def post(self, request):
        serializer = GuideFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        GuideFeedback.objects.create(**serializer.validated_data)
        return Response({"message": "피드백을 저장했어요."}, status=201)
