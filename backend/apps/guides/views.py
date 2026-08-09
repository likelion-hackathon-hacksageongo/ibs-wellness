from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import GuideRequestSerializer, GuideResponseSerializer
from .services import create_guide


@extend_schema(tags=["Guides"], summary="일정 전 식사 가이드 생성", request=GuideRequestSerializer, responses=GuideResponseSerializer)
class GuideCreateView(APIView):
    def post(self, request):
        serializer = GuideRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(create_guide(serializer.validated_data))
