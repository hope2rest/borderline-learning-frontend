<template>
  <div class="parent-main-page">
    <!-- 토스 스타일 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 8" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>

    <!-- 고정 헤더 -->
    <header class="page-header fixed-header" :class="{ 'animate-in': showHeader }">
      <div class="header-grid">
        <!-- 1번칸에 최영호님 + 응원문구 -->
        <div class="grid-cell cell-1">
          <div class="user-info-vertical">
            <h1 class="user-name">{{ authStore.currentUser?.username || '최영호' }}님</h1>
            <p class="user-greeting-vertical">자녀의 성장을 응원합니다! 🎆</p>
          </div>
        </div>
        
        <!-- 2번칸 빈 공간 -->
        <div class="grid-cell cell-2"></div>
        
        <!-- 3번칸 빈 공간 -->
        <div class="grid-cell cell-3"></div>
        
        <!-- 4번칸 빈 공간 -->
        <div class="grid-cell cell-4"></div>
        
        <!-- 5번칸에 메시지 + 나가기 -->
        <div class="grid-cell cell-5">
          <div class="action-buttons-group">
            <button @click="toggleNotifications" class="notification-button-compact" :class="{ 'has-unread': hasUnreadNotifications }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
            <button @click="handleLogout" class="logout-button-compact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span class="logout-text">나가기</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 알림 팝업 -->
      <div v-if="showNotifications" class="notifications-popup" @click.stop>
        <div class="notifications-header">
          <h3>알림</h3>
          <button @click="markAllAsRead" class="mark-read-button">모두 읽음</button>
        </div>
        <div class="notifications-list">
          <div v-if="notifications.length === 0" class="no-notifications">
            새로운 알림이 없습니다
          </div>
          <div v-else v-for="notification in notifications" 
               :key="notification.id" 
               class="notification-item"
               :class="{ 'unread': !notification.read }"
               @click="markAsRead(notification.id)">
            <div class="notification-icon">{{ notification.icon }}</div>
            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <p class="notification-time">{{ notification.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <!-- 자녀 선택 섹션 -->
      <div class="children-selector" :class="{ 'animate-in': showSelector }">
        <div class="selector-card">
          <h2 class="selector-title">👨‍👩‍👧‍👦 자녀 선택</h2>
          <div class="children-tabs">
            <button 
              v-for="child in mockChildren" 
              :key="child.id"
              @click="selectChild(child)"
              :class="['child-tab', { 'active': selectedChild?.id === child.id }]"
            >
              <div class="child-avatar">{{ child.name.charAt(0) }}</div>
              <div class="child-info">
                <span class="child-name">{{ child.name }}</span>
                <span class="child-grade">{{ child.grade }}</span>
              </div>
              <div v-if="child.hasNewActivity" class="activity-indicator"></div>
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedChild" class="child-dashboard">
        <!-- 연결된 선생님 정보 -->
        <div class="teacher-info-section" :class="{ 'animate-in': showTeacherInfo }">
          <div class="card teacher-info-card">
            <div class="card-header">
              <div class="card-icon teacher-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">👨‍🏫 담당 선생님</h2>
                <p class="card-subtitle">{{ selectedChild.name }}의 학습을 지도하는 선생님입니다</p>
              </div>
              <button @click="contactTeacher" class="contact-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                연락하기
              </button>
            </div>

            <div class="teacher-profile">
              <div class="teacher-details">
                <div class="teacher-avatar-large">{{ selectedChild.teacher.name.charAt(0) }}</div>
                <div class="teacher-info-details">
                  <div class="teacher-name">{{ selectedChild.teacher.name }}</div>
                  <div class="teacher-subject">{{ selectedChild.teacher.subject }}</div>
                  <div class="teacher-experience">경력 {{ selectedChild.teacher.experience }}년</div>
                </div>
              </div>
              <div class="teaching-stats">
                <div class="teaching-stat">
                  <div class="teaching-stat-value">{{ selectedChild.teacher.studentsCount }}</div>
                  <div class="teaching-stat-label">담당 학생</div>
                </div>
                <div class="teaching-stat">
                  <div class="teaching-stat-value">{{ selectedChild.teacher.averageScore }}점</div>
                  <div class="teaching-stat-label">평균 점수</div>
                </div>
                <div class="teaching-stat">
                  <div class="teaching-stat-value">{{ selectedChild.teacher.successRate }}%</div>
                  <div class="teaching-stat-label">성공률</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 학습 현황 요약 -->
        <div class="summary-section" :class="{ 'animate-in': showSummary }">
          <div class="card summary-card">
            <div class="card-header">
              <div class="card-icon summary-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📊 {{ selectedChild.name }}의 학습 현황</h2>
                <p class="card-subtitle">최근 7일간 활동 요약</p>
              </div>
              <button @click="refreshChildData" class="refresh-button" :disabled="refreshing">
                <svg v-if="!refreshing" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <div v-else class="loading-spinner small"></div>
              </button>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ selectedChild.weeklyStats.quizzesPlayed }}</div>
                <div class="stat-label">퀴즈 플레이</div>
                <div class="stat-trend" :class="selectedChild.weeklyStats.quizTrend">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  {{ selectedChild.weeklyStats.quizTrend === 'up' ? '+' : '-' }}{{ Math.abs(selectedChild.weeklyStats.quizChange) }}
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ selectedChild.weeklyStats.averageScore }}점</div>
                <div class="stat-label">평균 점수</div>
                <div class="stat-trend" :class="selectedChild.weeklyStats.scoreTrend">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  {{ selectedChild.weeklyStats.scoreTrend === 'up' ? '+' : '-' }}{{ Math.abs(selectedChild.weeklyStats.scoreChange) }}점
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ selectedChild.weeklyStats.studyTime }}분</div>
                <div class="stat-label">학습 시간</div>
                <div class="stat-trend" :class="selectedChild.weeklyStats.timeTrend">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  {{ selectedChild.weeklyStats.timeTrend === 'up' ? '+' : '-' }}{{ Math.abs(selectedChild.weeklyStats.timeChange) }}분
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ selectedChild.weeklyStats.streak }}일</div>
                <div class="stat-label">연속 학습</div>
                <div class="streak-badge" :class="getStreakBadgeClass(selectedChild.weeklyStats.streak)">
                  {{ getStreakText(selectedChild.weeklyStats.streak) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 최근 활동 내역 -->
        <div class="activities-section" :class="{ 'animate-in': showActivities }">
          <div class="card activities-card">
            <div class="card-header">
              <div class="card-icon activities-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📚 최근 활동 내역</h2>
                <p class="card-subtitle">{{ selectedChild.name }}의 학습 활동을 확인하세요</p>
              </div>
            </div>

            <div v-if="selectedChild.recentActivities.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <p class="empty-text">아직 학습 활동이 없습니다.</p>
              <p class="empty-subtext">자녀가 퀴즈를 풀면 여기에 기록이 나타납니다!</p>
            </div>

            <div v-else class="activities-list">
              <div 
                v-for="activity in selectedChild.recentActivities" 
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-icon">{{ activity.icon }}</div>
                <div class="activity-info">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-details">
                    <span class="activity-time">{{ formatActivityTime(activity.timestamp) }}</span>
                    <span v-if="activity.score !== undefined" class="activity-score" :class="getScoreColor(activity.score)">
                      {{ activity.score }}점
                    </span>
                  </div>
                  <div v-if="activity.description" class="activity-description">
                    {{ activity.description }}
                  </div>
                  
                  <!-- 퀴즈 상세 정보 -->
                  <div v-if="activity.type === 'quiz'" class="quiz-details">
                    <div class="quiz-result">
                      <div class="quiz-stats">
                        <span class="quiz-stat">
                          <span class="quiz-stat-icon">⏱️</span>
                          {{ activity.timeSpent }}초
                        </span>
                        <span v-if="activity.hintUsed" class="quiz-stat hint-used">
                          <span class="quiz-stat-icon">💡</span>
                          힌트 사용
                        </span>
                      </div>
                      <div class="quiz-answers">
                        <div class="answer-row">
                          <span class="answer-label">선택한 답:</span>
                          <span class="answer-value" :class="activity.selectedAnswer === activity.correctAnswer ? 'correct' : 'incorrect'">
                            {{ activity.selectedAnswer }}
                          </span>
                        </div>
                        <div v-if="activity.selectedAnswer !== activity.correctAnswer" class="answer-row">
                          <span class="answer-label">정답:</span>
                          <span class="answer-value correct">{{ activity.correctAnswer }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="activity-badge" :class="activity.type">
                  {{ getActivityTypeText(activity.type) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 학습 권장사항 -->
        <div class="recommendations-section" :class="{ 'animate-in': showRecommendations }">
          <div class="card recommendations-card">
            <div class="card-header">
              <div class="card-icon recommendations-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11H1l2-2-2-2 8 0a4 4 0 1 1 0 8H9"/>
                  <path d="M22 12h-6"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">💡 학습 권장사항</h2>
                <p class="card-subtitle">{{ selectedChild.name }}에게 맞는 학습 조언</p>
              </div>
            </div>

            <div class="recommendations-list">
              <div 
                v-for="recommendation in selectedChild.recommendations" 
                :key="recommendation.id"
                class="recommendation-item"
                :class="recommendation.priority"
              >
                <div class="recommendation-icon">{{ recommendation.icon }}</div>
                <div class="recommendation-content">
                  <div class="recommendation-title">{{ recommendation.title }}</div>
                  <div class="recommendation-description">{{ recommendation.description }}</div>
                </div>
                <div class="recommendation-priority">
                  <span class="priority-badge" :class="recommendation.priority">
                    {{ getPriorityText(recommendation.priority) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API 키 필요 알림 -->
      <div v-if="showApiNotice && !selectedChild" class="api-notice" :class="{ 'animate-in': showApiNotice }">
        <div class="notice-card">
          <div class="notice-icon">🔑</div>
          <h3 class="notice-title">더 자세한 분석을 원하시나요?</h3>
          <p class="notice-description">
            API 키를 설정하면 실시간 학습 분석, 맞춤형 추천, 상세한 진도 리포트를 받아볼 수 있습니다.
          </p>
          <div class="notice-actions">
            <button @click="openApiDocs" class="notice-button primary">
              API 키 설정하기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </button>
            <button @click="showApiNotice = false" class="notice-button secondary">
              나중에
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 에러 핸들러 -->
    <ErrorHandler
      :show="showError"
      :type="errorInfo.type || 'error'"
      :title="errorInfo.title || '오류'"
      :message="errorInfo.message || '알 수 없는 오류가 발생했습니다.'"
      @close="showError = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApiStatus } from '../composables/useApiStatus';
import ErrorHandler from '../components/ErrorHandler.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isDemoMode } = useApiStatus();

// 애니메이션 상태
const showHeader = ref(false);
const showSelector = ref(false);
const showSummary = ref(false);
const showActivities = ref(false);
const showRecommendations = ref(false);
const showApiNotice = ref(false);
const showTeacherInfo = ref(false);

// 알림 상태
const showNotifications = ref(false);
const hasUnreadNotifications = ref(true);
const unreadCount = ref(2);
const notifications = ref([
  {
    id: 1,
    icon: '📊',
    title: '자녀 학습 리포트',
    message: '이번 주 자녀의 학습 성과가 매우 좋습니다!',
    time: '1시간 전',
    read: false
  },
  {
    id: 2,
    icon: '📞',
    title: '선생님으로부터 메시지',
    message: '자녀의 학습 진도에 대한 상담 요청이 있어요.',
    time: '3시간 전',
    read: false
  }
]);

// 상태
const selectedChild = ref(null);
const refreshing = ref(false);
const showError = ref(false);
const errorInfo = ref({});

// 목업 자녀 데이터
const mockChildren = ref([
  {
    id: 1,
    name: '김아이',
    grade: '초등학교 3학년',
    hasNewActivity: true,
    teacher: {
      name: '박혜진 선생님',
      subject: '경계선 지능 특수교육',
      experience: 8,
      studentsCount: 12,
      averageScore: 82,
      successRate: 94
    },
    weeklyStats: {
      quizzesPlayed: 8,
      averageScore: 85,
      studyTime: 180,
      streak: 6,
      quizTrend: 'up',
      quizChange: 2,
      scoreTrend: 'up',
      scoreChange: 12,
      timeTrend: 'up',
      timeChange: 25
    },
    recentActivities: [
      {
        id: 1,
        icon: '🍎',
        title: '[수학] OX퀴즈 풀기',
        description: '사과가 5개 있어요 (정답: 아니요, 사과는 4개입니다)',
        score: 100,
        type: 'quiz',
        totalQuestions: 5,
        correctAnswers: 5,
        selectedAnswer: 'X',
        correctAnswer: 'X',
        timeSpent: 120,
        hintUsed: false,
        timestamp: Date.now() - 30 * 60 * 1000
      },
      {
        id: 2,
        icon: '📖',
        title: '[국어] 빈칸 채우기',
        description: '고양이가 ( )에 있어요',
        score: 100,
        type: 'quiz',
        totalQuestions: 3,
        correctAnswers: 3,
        selectedAnswer: '집',
        correctAnswer: '집',
        timeSpent: 95,
        hintUsed: false,
        timestamp: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        id: 3,
        icon: '🚨',
        title: '[생활] 안전한 생활이란?',
        description: '길을 건널 때는 어떻게 해야 할까요?',
        score: 67,
        type: 'quiz',
        totalQuestions: 3,
        correctAnswers: 2,
        selectedAnswer: '신호등을 봐요',
        correctAnswer: '신호등을 봐요',
        timeSpent: 142,
        hintUsed: true,
        timestamp: Date.now() - 4 * 60 * 60 * 1000
      },
      {
        id: 4,
        icon: '💰',
        title: '[금융] 용돈 관리 낱말 연결하기',
        description: '저축과 용돈기입장을 연결해보세요',
        score: 80,
        type: 'quiz',
        totalQuestions: 5,
        correctAnswers: 4,
        selectedAnswer: '저축 → 돈을 모아두기',
        correctAnswer: '저축 → 돈을 모아두기',
        timeSpent: 180,
        hintUsed: false,
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000
      },
      {
        id: 5,
        icon: '🏆',
        title: '[수학] 숫자 세기 OX퀴즈',
        description: '완료한 퀴즈 - 훌륭한 성과를 보였어요!',
        score: 80,
        type: 'quiz',
        totalQuestions: 5,
        correctAnswers: 4,
        selectedAnswer: 'O',
        correctAnswer: 'O',
        timeSpent: 150,
        hintUsed: false,
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
      }
    ],
    recommendations: [
      {
        id: 1,
        icon: '💰',
        title: '금융 교육 완료하기',
        description: '용돈 관리 낱말 연결하기를 잘 하고 있어요. 다른 금융 개념도 도전해보세요!',
        priority: 'medium'
      },
      {
        id: 2,
        icon: '🚨',
        title: '안전 교육 복습',
        description: '안전 퀴즈에서 일부 틀린 문제가 있어요. 안전 수칙을 다시 한번 복습해보세요.',
        priority: 'high'
      },
      {
        id: 3,
        icon: '🎉',
        title: '우수한 학습 성과',
        description: '6일 연속 학습 중이고 평균 85점을 유지하고 있어요! 정말 잘하고 있어요.',
        priority: 'low'
      }
    ]
  }
]);

onMounted(() => {
  startAnimations();
  
  // 첫 번째 자녀를 기본 선택
  if (mockChildren.value.length > 0) {
    selectChild(mockChildren.value[0]);
  }
  
  // 데모 모드면 API 안내 표시
  if (isDemoMode()) {
    setTimeout(() => {
      showApiNotice.value = true;
    }, 3000);
  }
  
  document.addEventListener('click', handleClickOutside);
});

const startAnimations = () => {
  setTimeout(() => showHeader.value = true, 200);
  setTimeout(() => showSelector.value = true, 600);
  setTimeout(() => showTeacherInfo.value = true, 800);
  setTimeout(() => showSummary.value = true, 1000);
  setTimeout(() => showActivities.value = true, 1400);
  setTimeout(() => showRecommendations.value = true, 1800);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/user-selection');
};

const selectChild = (child: any) => {
  selectedChild.value = child;
  // 새 활동 표시 제거
  child.hasNewActivity = false;
};

const refreshChildData = async () => {
  refreshing.value = true;
  
  try {
    if (!isDemoMode()) {
      // 실제 API 호출 로직
      // const response = await apiService.getChildData(selectedChild.value.id);
      // selectedChild.value = { ...selectedChild.value, ...response };
    }
    
    // 데모용 새로고침 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    showErrorModal('데이터 새로고침 실패', '자녀 학습 데이터를 불러올 수 없습니다.');
  } finally {
    refreshing.value = false;
  }
};

const openApiDocs = () => {
  window.open('https://ai.google.dev/gemini-api/docs/api-key', '_blank');
};

const showErrorModal = (title: string, message: string, type = 'error') => {
  errorInfo.value = { title, message, type };
  showError.value = true;
};

const formatActivityTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  return 'score-needs-improvement';
};

const getActivityTypeText = (type: string) => {
  const types = {
    'quiz': '퀴즈',
    'study': '학습',
    'achievement': '성취'
  };
  return types[type] || type;
};

const getPriorityText = (priority: string) => {
  const priorities = {
    'high': '중요',
    'medium': '보통',
    'low': '참고'
  };
  return priorities[priority] || priority;
};

const getStreakBadgeClass = (streak: number) => {
  if (streak >= 7) return 'excellent';
  if (streak >= 3) return 'good';
  return 'normal';
};

const getStreakText = (streak: number) => {
  if (streak >= 7) return '훌륭해요!';
  if (streak >= 3) return '좋아요!';
  return '시작해요!';
};

const contactTeacher = () => {
  alert(`${selectedChild.value.teacher.name} 선생님께 연락 요청이 전달되었습니다.`);
};

const getFloatingStyle = (index: number) => {
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 8;
  const duration = Math.random() * 5 + 6;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 알림 기능
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (notificationId: number) => {
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  updateUnreadCount();
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
  updateUnreadCount();
  showNotifications.value = false;
};

const updateUnreadCount = () => {
  const unreadNotifications = notifications.value.filter(n => !n.read);
  unreadCount.value = unreadNotifications.length;
  hasUnreadNotifications.value = unreadCount.value > 0;
};

// 외부 클릭으로 팝업 닫기
const handleClickOutside = (event: Event) => {
  if (showNotifications.value) {
    showNotifications.value = false;
  }
};
</script>

<style scoped>
.parent-main-page {
  min-height: 100vh;
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8f9fa;
}

/* 배경 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  animation: float-gentle infinite linear;
}

/* 고정 헤더 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fixed-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.header-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

.grid-cell {
  display: flex;
  align-items: center;
}

.cell-1 {
  justify-content: flex-start;
}

.cell-5 {
  justify-content: flex-end;
}

.user-info-vertical {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
}

.user-greeting-vertical {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  margin-top: -2px;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-button-compact,
.logout-button-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(135, 206, 235, 0.2);
  border: none;
  border-radius: 12px;
  color: #4a90e2;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.notification-button-compact:hover,
.logout-button-compact:hover {
  background: rgba(135, 206, 235, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.notification-button-compact.has-unread {
  background: rgba(74, 144, 226, 0.9);
  color: white;
}

.logout-text {
  font-size: 0.875rem;
  white-space: nowrap;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* 알림 팝업 */
.notifications-popup {
  position: absolute;
  top: calc(100% + 10px);
  right: 2rem;
  width: 320px;
  max-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1001;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.mark-read-button {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mark-read-button:hover {
  background: rgba(99, 102, 241, 0.1);
}

.notifications-list {
  max-height: 320px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem 1.25rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: rgba(99, 102, 241, 0.05);
  border-left: 3px solid #6366f1;
}

.notification-item.unread:hover {
  background: rgba(99, 102, 241, 0.1);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.25;
}

.notification-message {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  line-height: 1.3;
}

.notification-time {
  color: #9ca3af;
  margin: 0;
  font-size: 0.75rem;
}

/* 메인 컨텐츠 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem 2rem; /* 상단에 헤더 높이만큼 패딩 추가 */
}

/* 자녀 선택 섹션 */
.children-selector {
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.children-selector.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.selector-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.selector-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.children-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.child-tab {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 200px;
}

.child-tab:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.child-tab.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.child-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.child-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.child-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.child-grade {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  animation: pulse 2s infinite;
}

/* 카드 공통 스타일 */
.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.summary-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.activities-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.recommendations-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
  margin-left: auto;
}

.refresh-button:hover:not(:disabled) {
  background: #e5e7eb;
  color: #374151;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(107, 114, 128, 0.3);
  border-top: 2px solid #6b7280;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
}

/* 통계 섹션 */
.summary-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.summary-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #f9fafb;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend.up {
  color: #059669;
}

.stat-trend.down {
  color: #dc2626;
}

.streak-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.streak-badge.excellent {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.streak-badge.good {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.streak-badge.normal {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

/* 활동 섹션 */
.activities-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
}

.activities-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  margin: 0;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #f3f4f6;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.activity-info {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.activity-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-score {
  font-size: 0.875rem;
  font-weight: 600;
}

.activity-score.score-excellent {
  color: #059669;
}

.activity-score.score-good {
  color: #d97706;
}

.activity-score.score-needs-improvement {
  color: #dc2626;
}

.activity-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.activity-badge.quiz {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.activity-badge.study {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

.activity-badge.achievement {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

/* 권장사항 섹션 */
.recommendations-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
}

.recommendations-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.recommendation-item.high {
  background: rgba(239, 68, 68, 0.05);
  border-left-color: #ef4444;
}

.recommendation-item.medium {
  background: rgba(245, 158, 11, 0.05);
  border-left-color: #f59e0b;
}

.recommendation-item.low {
  background: rgba(16, 185, 129, 0.05);
  border-left-color: #10b981;
}

.recommendation-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.recommendation-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.high {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.priority-badge.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.priority-badge.low {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

/* API 안내 */
.api-notice {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.api-notice.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.notice-card {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  border-left: 4px solid #3b82f6;
}

.notice-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.notice-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 1rem 0;
}

.notice-description {
  color: #1e3a8a;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.notice-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.notice-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-button.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.notice-button.primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.notice-button.secondary {
  background: transparent;
  color: #1e40af;
  border: 2px solid #3b82f6;
}

.notice-button.secondary:hover {
  background: rgba(59, 130, 246, 0.1);
}

/* 애니메이션 */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-8px) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 선생님 정보 섹션 */
.teacher-info-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.teacher-info-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.teacher-profile {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.teacher-details {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
}

.teacher-avatar-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0064FF 0%, #0047B3 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.teacher-info-details {
  flex: 1;
}

.teacher-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.teacher-subject {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.teacher-experience {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.teacher-contact {
  font-size: 0.875rem;
  color: #0064FF;
  font-weight: 500;
}

.teaching-stats {
  display: flex;
  gap: 1.5rem;
}

.teaching-stat {
  text-align: center;
}

.teaching-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.teaching-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.contact-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

/* 퀴즈 상세 정보 스타일 */
.quiz-details {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.quiz-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.quiz-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: white;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.quiz-stat.hint-used {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border-color: #f59e0b;
}

.quiz-stat-icon {
  font-size: 0.875rem;
}

.quiz-answers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.answer-label {
  font-weight: 500;
  color: #6b7280;
  min-width: 80px;
}

.answer-value {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.answer-value.correct {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.answer-value.incorrect {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  color: #dc2626;
}

/* 반응형 */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .header-content {
    padding: 0 1rem;
  }

  .children-tabs {
    flex-direction: column;
  }

  .child-tab {
    min-width: unset;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    padding: 1.5rem;
  }

  .notice-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .activity-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .recommendation-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .children-selector,
  .summary-section,
  .activities-section,
  .recommendations-section,
  .api-notice,
  .card,
  .child-tab {
    transition: none;
  }
  
  .floating-element,
  .activity-indicator,
  .loading-spinner {
    animation: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .card,
  .selector-card,
  .notice-card {
    border: 2px solid #000000;
  }
  
  .notice-button.primary {
    background: #000080;
  }
}
</style>