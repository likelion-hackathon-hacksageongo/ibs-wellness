from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import build_insights


@extend_schema(tags=["Insights"], summary="개인 식사 패턴 분석 조회", responses=OpenApiTypes.OBJECT)
class InsightListView(APIView):
    def get(self, request):
        return Response(build_insights())
