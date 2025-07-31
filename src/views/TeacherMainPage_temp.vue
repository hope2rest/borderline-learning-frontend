<template>
  <div class="teacher-main-page">
    <!-- 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 10" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>

    <!-- 고정 헤더 -->
    <header class="page-header fixed-header">
      <div class="header-content">
        <div class="user-info">
          <h1 class="user-name">박혜진 선생님</h1>
        </div>
        <div class="header-actions">
          <button @click="toggleNotifications" class="notification-button" :class="{ 'has-unread': hasUnreadNotifications }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </button>
          <button @click="handleLogout" class="logout-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            나가기
          </button>
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
      <!-- 상단: 자료 업로드 블럭 -->
      <div class="top-section">
        <div class="upload-section" :class="{ 'animate-in': showUpload }">
          <div class="card upload-card">
            <div class="card-header">
              <div class="card-icon upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📚 자료 업로드</h2>
                <p class="card-subtitle">학습 자료를 업로드하고 관리하세요</p>
              </div>
            </div>
            
            <div class="upload-content">
              <form @submit.prevent="uploadMaterial" class="upload-form">
                <div class="form-group">
                  <label class="form-label">제목</label>
                  <input 
                    v-model="materialForm.title"
                    type="text" 
                    class="form-input"
                    placeholder="업로드할 자료의 제목을 입력하세요"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">키워드</label>
                  <input 
                    v-model="materialForm.keywords"
                    type="text" 
                    class="form-input"
                    placeholder="관련 키워드를 입력하세요 (쉼표로 구분)"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">참고사항</label>
                  <textarea 
                    v-model="materialForm.notes"
                    class="form-textarea"
                    placeholder="추가 참고사항이나 특이사항을 입력하세요"
                    rows="3"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label class="form-label">파일 선택</label>
                  <div class="file-upload-container">
                    <input 
                      ref="fileInput"
                      type="file" 
                      class="file-input"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      @change="handleFileSelect"
                    >
                    <div class="file-upload-area" @click="triggerFileInput">
                      <div class="file-upload-icon">📁</div>
                      <p class="file-upload-text">
                        {{ selectedFileName || '파일을 선택하거나 드래그하여 업로드' }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="upload-submit-button" :disabled="!materialForm.title || !selectedFile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    업로드
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단: 생성된 문제 관리 & 담당 학생 관리 -->
      <div class="bottom-section">
        <!-- 생성된 문제 관리 블럭 -->
        <div class="problem-management-section" :class="{ 'animate-in': showProblems }">
          <div class="card problem-card">
            <div class="card-header">
              <div class="card-icon problem-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">❓ 생성된 문제 관리</h2>
                <p class="card-subtitle">AI로 생성된 문제들을 관리하세요</p>
              </div>
            </div>
            
            <div class="management-content">
              <div class="management-actions">
                <button class="action-btn add-btn" title="문제 추가">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <button class="action-btn edit-btn" title="문제 수정">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="action-btn delete-btn" title="문제 삭제">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
              
              <div class="problems-list">
                <div v-for="problem in mockProblems" :key="problem.id" class="problem-item">
                  <div class="problem-icon-small">{{ problem.icon }}</div>
                  <div class="problem-info">
                    <div class="problem-title">{{ problem.title }}</div>
                    <div class="problem-meta">
                      <span class="problem-subject">{{ problem.subject }}</span>
                      <span class="problem-difficulty">{{ problem.difficulty }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 담당 학생 관리 블럭 -->
        <div class="student-management-section" :class="{ 'animate-in': showStudents }">
          <div class="card student-card">
            <div class="card-header">
              <div class="card-icon student-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">👥 담당 학생 관리</h2>
                <p class="card-subtitle">학생들의 학습 현황을 관리하세요</p>
              </div>
            </div>
            
            <div class="management-content">
              <div class="management-actions">
                <button class="action-btn add-btn" title="학생 추가">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <button class="action-btn edit-btn" title="학생 수정">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="action-btn delete-btn" title="학생 삭제">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
              
              <div class="students-list">
                <div v-for="student in mockStudents" :key="student.id" class="student-item">
                  <div class="student-avatar">{{ student.name.charAt(0) }}</div>
                  <div class="student-info">
                    <div class="student-name">{{ student.name }}</div>
                    <div class="student-grade">{{ student.grade }}</div>
                    <div class="student-progress">학습 진도: {{ student.progress }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 애니메이션 상태
const showHeader = ref(false);
const showUpload = ref(false);
const showStudents = ref(false);
const showProblems = ref(false);

// 폼 데이터
const materialForm = ref({
  title: '',
  keywords: '',
  notes: ''
});

const selectedFile = ref(null);
const selectedFileName = ref('');
const fileInput = ref(null);

// 알림 관련
const showNotifications = ref(false);
const notifications = ref([
  { id: 1, title: '관리자 공지', message: '이번 주 교육 자료가 업데이트되었습니다.', icon: '📢', time: '10분 전', read: false },
  { id: 2, title: '학생 알림', message: '김민수 학생이 과제를 완료했습니다.', icon: '✅', time: '1시간 전', read: false },
  { id: 3, title: '시스템 알림', message: '새로운 기능이 추가되었습니다.', icon: '🆕', time: '어제', read: true }
]);

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);
const hasUnreadNotifications = computed(() => unreadCount.value > 0);

// 목업 데이터
const mockStudents = ref([
  { id: 1, name: '김민수', grade: '초등 3학년', progress: 85 },
  { id: 2, name: '이지은', grade: '초등 3학년', progress: 92 },
  { id: 3, name: '박준호', grade: '초등 4학년', progress: 78 },
  { id: 4, name: '최서연', grade: '초등 3학년', progress: 88 },
  { id: 5, name: '정도현', grade: '초등 4학년', progress: 95 }
]);

const mockProblems = ref([
  { id: 1, title: '수와 연산 기초 문제', subject: '수학', difficulty: '기초', icon: '🔢' },
  { id: 2, title: '한글 읽기 문제', subject: '국어', difficulty: '기초', icon: '📝' },
  { id: 3, title: '도형 인식 문제', subject: '수학', difficulty: '중급', icon: '🔺' },
  { id: 4, title: '동물 분류 문제', subject: '과학', difficulty: '기초', icon: '🐱' },
  { id: 5, title: '시간 개념 문제', subject: '수학', difficulty: '중급', icon: '⏰' }
]);

// 배경 애니메이션
const getFloatingStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${index * 0.5}s`,
    animationDuration: `${3 + Math.random() * 2}s`
  };
};

// 로그아웃
const handleLogout = () => {
  authStore.logout();
  router.push('/user-selection');
};

// 알림 관련 함수
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

// 파일 업로드 관련 함수
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    selectedFileName.value = file.name;
  }
};

const uploadMaterial = () => {
  if (!selectedFile.value || !materialForm.value.title) {
    alert('제목과 파일을 모두 입력해주세요.');
    return;
  }
  
  console.log('업로드 데이터:', {
    title: materialForm.value.title,
    keywords: materialForm.value.keywords,
    notes: materialForm.value.notes,
    file: selectedFile.value
  });
  
  // 실제 업로드 로직은 여기에 구현
  alert('업로드가 완료되었습니다!');
  
  // 폼 초기화
  materialForm.value = {
    title: '',
    keywords: '',
    notes: ''
  };
  selectedFile.value = null;
  selectedFileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 외부 클릭 시 알림창 닫기
onMounted(() => {
  setTimeout(() => showHeader.value = true, 100);
  setTimeout(() => showUpload.value = true, 300);
  setTimeout(() => showProblems.value = true, 500);
  setTimeout(() => showStudents.value = true, 700);
  
  // 외부 클릭 이벤트 리스너
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.notification-button') && !target.closest('.notifications-popup')) {
      showNotifications.value = false;
    }
  });
});
</script>

<style scoped>
.teacher-main-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* 배경 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(118, 75, 162, 0.1) 100%);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 고정 헤더 */
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 알림 버튼 */
.notification-button {
  position: relative;
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
}

.notification-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.notification-button.has-unread {
  color: #3b82f6;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 18px;
  text-align: center;
}

/* 알림 팝업 */
.notifications-popup {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 50;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
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
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.mark-read-button:hover {
  color: #2563eb;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 3rem 2rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.notification-message {
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
}

/* 로그아웃 버튼 */
.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.logout-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* 메인 컨텐츠 */
.main-content {
  position: relative;
  z-index: 5;
  padding: 6rem 2rem 2rem 2rem; /* 상단 패딩 증가 for fixed header */
  max-width: 1200px;
  margin: 0 auto;
}

/* 상단 섹션 */
.top-section {
  margin-bottom: 2rem;
}

.upload-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.upload-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 하단 섹션 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.student-management-section,
.problem-management-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.student-management-section.animate-in,
.problem-management-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 카드 스타일 */
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.upload-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.student-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.problem-icon {
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

/* 업로드 컨텐츠 */
.upload-content {
  padding: 2rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  background: white;
}

.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.file-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-upload-area {
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-area:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.file-upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.file-upload-text {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

/* 중앙 정렬된 업로드 버튼 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.upload-submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.upload-submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 관리 섹션 */
.management-content {
  padding: 1.5rem;
}

.management-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 리스트 */
.students-list,
.problems-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-item,
.problem-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.student-item:hover,
.problem-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.problem-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.student-info,
.problem-info {
  flex: 1;
}

.student-name,
.problem-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.student-grade,
.problem-meta {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.student-progress {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
}

.problem-subject,
.problem-difficulty {
  margin-right: 0.5rem;
  padding: 0.125rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  font-weight: 500;
}

/* 스크롤바 스타일 */
.students-list::-webkit-scrollbar,
.problems-list::-webkit-scrollbar {
  width: 6px;
}

.students-list::-webkit-scrollbar-track,
.problems-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.students-list::-webkit-scrollbar-thumb,
.problems-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

/* 반응형 */
@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .main-content {
    padding: 5rem 1rem 1rem 1rem;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .notifications-popup {
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>