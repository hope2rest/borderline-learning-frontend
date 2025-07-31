<template>
  <div class="user-selection-page">
    <!-- 배경 -->
    <div class="background-gradient">
      <div class="background-pattern"></div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="main-content">
      <!-- 헤더 -->
      <div class="header-section" :class="{ 'animate-in': showHeader }">
        <div class="logo-container">
          <div class="mini-logo">
            <img 
              src="/images/logo-character.png" 
              alt="이음 캐릭터 로고" 
              class="character-logo-mini"
            >
          </div>
          <h1 class="service-title">경계선 지능인 학습 지원 서비스 이음</h1>
        </div>
        <p class="welcome-text">사용자 유형을 선택해주세요</p>
      </div>

      <!-- 사용자 카드 컨테이너 -->
      <div class="user-cards-container" :class="{ 'animate-in': showCards }">
        <div class="cards-wrapper">
          <!-- 선생님 카드 -->
          <div 
            class="user-card teacher-card"
            @click="confirmSelection('teacher')"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="chick-icon">🐣</div>
              </div>
              <div class="card-info">
                <h3 class="card-title">선생님</h3>
                <p class="card-description">학생 관리 및 학습 진도 확인</p>
              </div>
            </div>
          </div>

          <!-- 학부모 카드 -->
          <div 
            class="user-card parent-card"
            @click="confirmSelection('parent')"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="chick-icon">🐣</div>
              </div>
              <div class="card-info">
                <h3 class="card-title">학부모</h3>
                <p class="card-description">자녀의 학습 현황 모니터링</p>
              </div>
            </div>
          </div>

          <!-- 학습자 카드 -->
          <div 
            class="user-card student-card"
            @click="confirmSelection('student')"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="chick-icon">🐣</div>
              </div>
              <div class="card-info">
                <h3 class="card-title">학습자</h3>
                <p class="card-description">재미있는 맞춤형 학습 경험</p>
              </div>
            </div>
          </div>

          <!-- 관리자 카드 -->
          <div 
            class="user-card admin-card"
            @click="confirmSelection('admin')"
          >
            <div class="card-content">
              <div class="card-icon">
                <div class="chick-icon">🐣</div>
              </div>
              <div class="card-info">
                <h3 class="card-title">관리자</h3>
                <p class="card-description">시스템 전체 관리</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 애니메이션 상태
const showHeader = ref(false);
const showCards = ref(false);
const showAction = ref(false);


// 사용자 유형 텍스트 매핑
const userTypeMap = {
  teacher: '선생님',
  parent: '학부모',
  admin: '관리자',
  student: '학습자'
};

onMounted(() => {
  startAnimationSequence();
});

const startAnimationSequence = () => {
  setTimeout(() => {
    showHeader.value = true;
  }, 200);

  setTimeout(() => {
    showCards.value = true;
  }, 600);

  setTimeout(() => {
    showAction.value = true;
  }, 1000);
};


const getUserTypeText = (userType: string) => {
  return userTypeMap[userType as keyof typeof userTypeMap] || '사용자';
};


const confirmSelection = (userType: string) => {
  if (!userType) return;

  // 관리자 선택 시 권한 없음 알림
  if (userType === 'admin') {
    showAdminAccessDenied();
    return;
  }

  // 역할별 사용자 ID 매핑
  const userIdMap = {
    teacher: 3,  // 박혜진 선생님
    parent: 4,   // 최영호 학부모  
    student: 1,  // 김민수 학습자
    admin: 5     // 관리자
  };

  const userId = userIdMap[userType as keyof typeof userIdMap] || 1;

  // 로그인 처리
  console.log('🔐 로그인 시도:', { userId, userType });
  authStore.login(userId);
  console.log('✅ 로그인 완료:', authStore.currentUser);
  
  // 역할별 라우팅
  const routeMap = {
    teacher: '/teacher',   // 선생님 → 선생님 페이지
    parent: '/parent',     // 학부모 → 학부모 페이지  
    student: '/student'    // 학습자 → 학습자 페이지
  };

  const targetRoute = routeMap[userType as keyof typeof routeMap] || '/dashboard';
  console.log('🚀 페이지 이동:', targetRoute);
  router.push(targetRoute);
};

const showAdminAccessDenied = () => {
  // 알림 표시 (실제로는 모달이나 토스트 메시지 사용)
  alert('🚫 관리자 권한이 필요합니다.\n\n현재는 선생님, 학부모, 학습자 계정만 이용 가능합니다.');
};
</script>

<style scoped>
.user-selection-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

/* 배경 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 100, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 100, 255, 0.05) 0%, transparent 50%);
  animation: pattern-shift 20s ease-in-out infinite;
}

/* 메인 컨텐츠 */
.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  text-align: center;
}

/* 헤더 섹션 */
.header-section {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mini-logo {
  animation: logo-float 3s ease-in-out infinite;
}

/* 캐릭터 로고 미니 */
.character-logo-mini {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  transition: transform 0.3s ease;
}

.mini-logo:hover .character-logo-mini {
  transform: scale(1.1);
}

.service-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.welcome-text {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* 사용자 카드 컨테이너 */
.user-cards-container {
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.user-cards-container.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 사용자 카드 */
.user-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  min-height: 120px;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 1rem;
  gap: 0.75rem;
  height: 100%;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 100, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.user-card:hover::before {
  left: 100%;
}

.user-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  border-color: #0064FF;
  z-index: 10;
}


.card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* 병아리 아이콘 */
.chick-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chick-icon-large {
  font-size: 48px;
  margin-bottom: 1rem;
}

.teacher-card .card-icon { 
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); 
  color: #d97706; 
}

.parent-card .card-icon { 
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); 
  color: #16a34a; 
}

.admin-card .card-icon { 
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); 
  color: #7c3aed; 
}

.student-card .card-icon { 
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); 
  color: #ec4899; 
}

.user-card.selected .card-icon {
  background: linear-gradient(135deg, #0064FF 0%, #0047B3 100%);
  color: white;
  transform: scale(1.05);
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}



/* 애니메이션 */
@keyframes pattern-shift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 반응형 */
@media (max-width: 1024px) {
  .cards-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .cards-wrapper {
    grid-template-columns: repeat(2, 1fr);
    max-width: 600px;
    gap: 1rem;
  }

  .card-content {
    padding: 1rem;
  }

  .card-icon {
    width: 48px;
    height: 48px;
  }

  .service-title {
    font-size: 1.25rem;
  }

  .welcome-text {
    font-size: 1rem;
  }

}

@media (max-width: 480px) {
  .logo-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .cards-wrapper {
    max-width: 100%;
    grid-template-columns: 1fr;
  }

  .card-content {
    padding: 1rem;
    gap: 0.75rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.8rem;
  }

}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .header-section,
  .user-cards-container,
  .action-section,
  .user-card,
  .confirm-button {
    transition: none;
  }

  .background-pattern,
  .mini-logo {
    animation: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .user-card {
    border: 2px solid #000000;
  }

  .user-card.selected {
    background: #000080;
    color: white;
  }

  .confirm-button.active {
    background: #000080;
  }
}
</style>