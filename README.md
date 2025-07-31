# 이음 - 경계선지능 청소년을 위한 AI 맞춤 학습 서비스

Vue.js + Django 기반 경계선지능 청소년 학습 지원 서비스의 풀스택 MVP입니다.

> **"혼자가 아닌 함께, 고립이 아닌 연결"**  
> 피우다 프로젝트를 통해 개발된 경계선지능 청소년(약 80만명)을 위한 AI 맞춤형 학습 지원 플랫폼

## 🎯 서비스 개요

### 타겟 사용자
- **주 사용자**: 경계선지능 청소년 (11-19세 특수학급 학생, 약 80만명)
- **부 사용자**: 특수교사, 학부모

### 핵심 솔루션
**이음(IEUM)**: AI 기반 맞춤형 학습 지원 서비스
- **쉬운말 번역** (챗봇 & 문제)
- **수준별 문제 생성**
- **즉각적 피드백 제공**
- **맞춤형 실시간 학습 지원**

## 🚀 주요 기능

### 📱 구현된 페이지
1. **로그인 페이지** - 실제 사용자 인증 (JWT 토큰)
2. **학습자 메인 페이지** - 자료 업로드 + 퀴즈 시작 + 학습 대시보드
3. **퀴즈 게임 페이지** - 다양한 유형의 문제 + 힌트 시스템
4. **AI 튜터 챗봇** - 실시간 학습 지원 및 쉬운말 번역

### 🎮 핵심 학습 기능

#### 1. 강의 자료 업로드 & AI 자동 처리
- 교사가 강의 자료와 간단한 지시사항만 입력
- AI가 핵심 내용을 분석·요약
- 학생 수준별 적절한 문제 자동 생성
- 완성된 자료는 바로 배포하거나 저장 후 활용

#### 2. 학습자 수준에 맞춘 쉬운말 번역
- **어려운 개념 → AI 번역 → 쉬운 표현**
- 복잡한 내용을 학습자 수준에 맞게 자동 번역
- 인지적 부담 감소로 이해도·몰입도 향상

#### 3. 다양한 유형의 문제 생성
- **이미지 기반 선택형 문제** (과일, 동물, 색상 구분 등)
- **빈칸 채우기 문제**
- **연결형 문제**
- **4번째 선택지**: "잘 모르겠어요" (힌트 시스템 연동)

#### 4. 즉각적 피드백 시스템
- **문제 풀이 직후 즉시 피드백 제공**
- **오답 시 대응**: 
  - 격려 메시지: "아쉬워! 다음엔 맞출 수 있을거야!"
  - 이해하기 쉬운 해설 제공
  - 좌절 → 동기로 전환하여 포기하지 않는 학습 습관 형성
- **학습 완료 후**: 정답/오답 관계없이 전체 문제 해설 제공

#### 5. 학습 진도 관리 대시보드
- 학생의 활동을 한 눈에 볼 수 있는 종합 대시보드
- 학습 통계 및 진도 추적
- 개인별 학습 패턴 분석

#### 6. AI 튜터 챗봇 (24시간 지원)
- 화면 우측 하단 챗봇으로 언제든 대화
- **학습 질문 + 일상 고민 모두 지원**
- 쉬운 말로 친절하게 답변
- 후속 질문 자동 추천
- 질문이 어려운 학생도 쉽게 대화 가능

### 🎨 UI/UX 특징
- **접근성 우선**: 큰 버튼, 명확한 색상 구분
- **직관적 UI**: 이모지와 아이콘으로 이해도 향상
- **단순함**: 복잡한 기능 배제, 핵심 기능에 집중
- **친근함**: 따뜻한 색상과 부드러운 디자인
- **Tailwind CSS** 기반 반응형 디자인

## 🛠 기술 스택 & 개발 진척도

### Frontend (진척도: 85%)
- **Vue.js 3** (Composition API)
- **Pinia** (상태 관리)
- **Vue Router** (라우팅)
- **Tailwind CSS** (스타일링)
- **Vite** (빌드 도구)
- **Axios** (HTTP 클라이언트)

### Backend (진척도: 60%)
- **Django 4.2+** (웹 프레임워크) ✅ 구축 완료
- **Django REST Framework** (API 서버) ✅ 기본 연동 완료
- **SQLite/PostgreSQL** (데이터베이스) ✅ 연동 완료
- **Pillow** (이미지 처리) 🚧 일부 기능 비활성화
- **django-cors-headers** (CORS 설정) ✅ 설정 완료
- **JWT Authentication** (인증) 🚧 일부 기능 개발 중

### AI 기술 (진척도: 70%)
- **Google Gemini** (텍스트 처리 + 쉬운말 번역)
- **OpenAI GPT** (이미지 생성 및 문제 생성)
- **맞춤형 프롬프트 엔지니어링**

### 현재 구현 상태
- **화면 구성**: Vue 3 기반 반응형 웹 (PC/태블릿/모바일 모두 지원)
- **백엔드 연동**: Django 서버와 기본 통신 구축 완료
- **데이터 저장**: Django 모델과 데이터베이스 연동 (일부 API 엔드포인트는 개발 중)
- **AI 기술**: 프론트엔드에서 직접 API 호출 (백엔드 경유 예정)

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── views/              # 페이지 컴포넌트
│   │   ├── LoginView.vue   # 로그인 페이지
│   │   ├── DashboardView.vue # 메인 대시보드
│   │   └── QuizView.vue    # 퀴즈 게임 페이지
│   ├── stores/             # Pinia 스토어
│   │   ├── auth.js         # 인증 상태 관리
│   │   ├── quiz.js         # 퀴즈 게임 상태 관리
│   │   └── api.js          # API 서비스 클래스
│   └── router/             # 라우터 설정
│       └── index.ts        # 라우트 정의 및 가드

backend/
├── apps/
│   ├── accounts/           # 사용자 관리
│   ├── learning/           # 학습 자료 관리
│   ├── quiz/              # 퀴즈 시스템
│   ├── chatbot/           # AI 튜터 챗봇
│   └── progress/          # 학습 진도 추적
├── config/                # Django 설정
├── media/                 # 업로드된 파일
└── requirements.txt       # Python 패키지 목록
```

## 🗄️ 데이터베이스 구조

### 주요 모델
- **User**: 사용자 정보 (학습자/교사 구분)
- **Material**: 업로드된 학습 자료
- **Quiz**: 퀴즈 정보 및 문제
- **QuizAttempt**: 퀴즈 시도 기록
- **Progress**: 개인별 학습 진도
- **ChatHistory**: AI 튜터 대화 기록

## 🔗 API 엔드포인트

> **현재 상태**: Django 백엔드는 구축되었으나 일부 API는 개발 중입니다.

### 구현 완료된 API
- `GET /api/health/` - 서버 상태 확인
- `POST /api/auth/login/` - 기본 로그인 (개발 중)

### 개발 중인 API
- `POST /api/auth/refresh/` - 토큰 갱신
- `POST /api/auth/logout/` - 로그아웃
- `POST /api/materials/upload/` - 자료 업로드
- `GET /api/materials/` - 자료 목록 조회
- `POST /api/materials/translate/` - 쉬운말 번역

### 계획된 API (미구현)
- `GET /api/quiz/list/` - 퀴즈 목록 조회
- `GET /api/quiz/{id}/` - 특정 퀴즈 상세 정보
- `POST /api/quiz/attempt/` - 퀴즈 시도 결과 제출
- `POST /api/quiz/generate/` - AI 기반 문제 생성
- `POST /api/chatbot/ask/` - AI 튜터 질문
- `GET /api/chatbot/history/` - 대화 기록 조회
- `GET /api/progress/` - 개인 학습 진도 조회
- `GET /api/progress/stats/` - 학습 통계

**참고**: 현재 주요 기능들은 프론트엔드에서 직접 외부 AI API를 호출하여 구현되어 있습니다.

## 🚀 실행 방법

### Backend 실행

```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에 Google Gemini, OpenAI API 키 설정

# 데이터베이스 마이그레이션
python manage.py makemigrations
python manage.py migrate

# 슈퍼유저 생성 (선택사항)
python manage.py createsuperuser

# 개발 서버 실행
python manage.py runserver
```

**참고**: 현재 일부 API 엔드포인트는 개발 중이므로, 주요 기능은 프론트엔드에서 직접 처리됩니다.

### Frontend 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 API URL 설정

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## ⚙️ 환경 설정

### Backend 환경변수 (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173

# AI API Keys
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

### Frontend 환경변수 (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📋 로드맵 및 발전 계획

### 🎯 피우다 프로젝트 이후 로드맵

#### STEP 1: 이루다학교 협의
- 서비스 시범 도입 요청 및 학교 요구사항 수집·분석

#### STEP 2: 시범 적용 계획 수립  
- 적용 대상과 적용 범위 논의

#### STEP 3: 필요 기능 구현
- 요청사항을 반영하여 필요 기능 구현 및 LMS 시스템 구축

#### STEP 4: 도입 및 피드백 수집
- 일부 수업에 서비스를 도입하고 이용자들의 피드백 수집

#### STEP 5: 완료 및 평가
- 프로젝트 결과를 분석하여 향후 개선점 도출

### 📈 단계별 확장 전략

#### 2025 하반기 - 기반 구축
- **이루다학교 시범 운영**
- **서비스 검증 및 개선**

#### 2026년 - 확산
- **전국 10개 대안학교 도입**
- **모바일 앱 출시**

#### 2027년 - 성장
- **전국 30개교 도입**
- **B2G 사업 본격화**

### 🌟 커뮤니티 플랫폼 "함께 이음"
- **부모 커뮤니티**: 양육 정보 공유
- **교사 네트워크**: 우수 사례 확산  
- **학생 소셜**: 또래 친구 연결

### 🔧 핵심 보완 계획
- **AI 고도화**: 음성 인식으로 문해력 문제 해결
- **개인 맞춤**: 개인별 난이도 및 문제 수 조절
- **성과 측정**: 데이터 기반 학습 효과 검증

## 📊 기대 효과

### (3년 내) 정량적 목표
- **경계선지능 청소년 3만명 지원** (전체 78만명 중 4%)
- **부모 스트레스 50% 감소**
- **교사 업무시간 70% 절감**

### 사회적 가치
> **"혼자가 아닌 함께, 고립이 아닌 연결"**

## 👥 팀 소개

### 이호진 - Backend & AI
### 홍진표 - Backend & DB  
### 이강산 - PM & Frontend

## 🔧 배포 준비사항

### Production 설정
- **Environment Variables**: 보안키, 데이터베이스 설정, AI API 키
- **Static Files**: Django collectstatic 실행
- **CORS 설정**: 프로덕션 도메인 추가
- **SSL/HTTPS**: 보안 연결 설정

### 권장 배포 환경
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3
- **Database**: PostgreSQL (프로덕션)

## 📋 개발 현황

### ✅ 완료된 기능
- ✅ **Django 백엔드 기본 구조** (서버 연동 완료)
- ✅ **Vue.js 프론트엔드** (주요 페이지 구현)
- ✅ **기본 사용자 인터페이스** (로그인, 대시보드, 퀴즈)
- ✅ **퀴즈 게임 로직** (문제 생성, 힌트 시스템, 결과 표시)
- ✅ **AI 기반 쉬운말 번역** (프론트엔드 구현)
- ✅ **파일 업로드 UI** (자료 업로드 인터페이스)
- ✅ **반응형 디자인** (모바일/태블릿/PC 지원)

### 🚧 개발 중인 기능 (백엔드 연동 대기)
- 🚧 **사용자 인증 시스템** (JWT 토큰 처리)
- 🚧 **학습 진도 추적** (데이터베이스 저장)
- 🚧 **퀴즈 결과 저장** (백엔드 API 연동)
- 🚧 **AI 튜터 챗봇** (백엔드 경유 AI API 호출)
- 🚧 **파일 업로드 처리** (서버 저장 및 처리)
- 🚧 **학습 통계 대시보드** (데이터 분석)

### 🔄 임시 비활성화된 기능
- 🔄 **실시간 데이터 동기화** (현재 로컬 스토리지 사용)
- 🔄 **사용자별 데이터 관리** (계정별 진도 저장)
- 🔄 **이미지 처리 API** (업로드된 자료 분석)
- 🔄 **고급 AI 기능** (개인 맞춤 문제 생성)

### 📋 향후 개발 계획
1. **커뮤니티 플랫폼 "함께 이음"**
2. **접근성 개선** (스크린 리더 지원)
3. **실시간 알림 시스템**
4. **학습 분석 대시보드 고도화**
5. **모바일 앱 버전**
6. **다국어 지원**

## 📞 문의사항
프로젝트 관련 문의사항이나 협업 제안은 다음으로 연락해 주세요:
- **이호진**: [researcherhojin@gmail.com]
- **홍진표**: [hongdune@gmail.com]  
- **이강산**: [hope22rest@gmail.com]

## 📄 라이선스
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

> **이음** - 경계선지능 청소년과 세상을 연결하는 다리가 되겠습니다.
