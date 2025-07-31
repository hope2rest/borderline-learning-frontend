#!/bin/bash

# 경계선 지능인 학습 지원 서비스 서버 실행 스크립트
# 사용법: ./start-server.sh [포트번호]

PORT=${1:-9000}
DIST_DIR="dist"

echo "🚀 경계선 지능인 학습 지원 서비스 서버 시작..."
echo "📁 디렉토리: $(pwd)/$DIST_DIR"
echo "🌐 포트: $PORT"
echo "🔗 접속 주소: http://localhost:$PORT"
echo ""

# 이전 프로세스 종료
pkill -f "python.*http.server.*$PORT" 2>/dev/null || true

# 빌드 확인
if [ ! -d "$DIST_DIR" ]; then
    echo "⚠️  빌드 파일이 없습니다. 빌드를 실행합니다..."
    npm run build
fi

# 서버 시작
cd $DIST_DIR
echo "✅ 서버 시작 완료!"
echo "🔗 브라우저에서 http://localhost:$PORT 로 접속하세요"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"
echo "----------------------------------------"

python3 -m http.server $PORT