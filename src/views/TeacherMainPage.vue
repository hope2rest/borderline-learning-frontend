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
    <header class="page-header fixed-header" :class="{ 'animate-in': showHeader }">
      <div class="header-grid">
        <!-- 1번칸에 홍길동 선생님 + 응원문구 -->
        <div class="grid-cell cell-1">
          <div class="user-info-vertical">
            <h1 class="user-name">홍길동 선생님</h1>
            <p class="user-greeting-vertical">오늘도 아이들과 함께 성장해요! 💪</p>
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
      <!-- 상단: 자료 업로드 블럭 -->
      <div class="top-section">
        <div class="upload-section" :class="{ 'animate-in': showUpload }">
          <div class="card upload-card">
            <div class="card-header">
              <div class="card-icon upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">자료 업로드</h2>
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
                
                <!-- 업로드 진행률 표시 -->
                <div v-if="uploadStatus" class="upload-progress-section">
                  <div class="progress-message">{{ processingMessage }}</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                  <div class="progress-percentage">{{ uploadProgress }}%</div>
                </div>
                
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="upload-submit-button" 
                    :disabled="!materialForm.title || !selectedFile || uploadStatus === 'uploading'"
                  >
                    <svg v-if="uploadStatus !== 'uploading'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <div v-else class="loading-spinner"></div>
                    {{ uploadStatus === 'uploading' ? '처리 중...' : '업로드' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단: 문제 자료 & 담당 학생 -->
      <div class="bottom-section">
        <!-- 문제 자료 블럭 -->
        <div class="problem-management-section" :class="{ 'animate-in': showProblems }">
          <div class="card problem-card">
            <div class="card-header">
              <div class="card-icon problem-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">퀴즈 모음</h2>
                <p class="card-subtitle">AI로 생성된 문제들을 관리하세요</p>
              </div>
            </div>
            
            <div class="management-content">
              <div v-if="loading" class="loading-message">
                퀴즈를 불러오는 중...
              </div>
              <div v-else class="problems-list">
                <div v-for="quiz in quizzes" :key="quiz.id" 
                     class="problem-item quiz-item" 
                     @click="openQuizDetail(quiz)">
                  <div class="problem-icon-small">📝</div>
                  <div class="problem-info">
                    <div class="problem-title">{{ quiz.title }}</div>
                    <div class="problem-meta">
                      <span class="problem-subject">{{ quiz.keywords?.join(', ') || '키워드 없음' }}</span>
                      <span class="problem-difficulty">{{ quiz.question_count || 0 }}문제</span>
                    </div>
                  </div>
                </div>
                <div v-if="quizzes.length === 0" class="no-quizzes">
                  생성된 퀴즈가 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 담당 학생 블럭 -->
        <div class="problem-management-section" :class="{ 'animate-in': showProblems }">
          <div class="card student-card">
            <div class="card-header">
              <div class="card-icon student-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">담당 학생</h2>
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
    <!-- 퀴즈 상세 팝업 -->
    <div v-if="showQuizDetail" class="quiz-detail-overlay" @click="closeQuizDetail">
      <div class="quiz-detail-popup" @click.stop>
        <div class="popup-header">
          <h2 class="popup-title">퀴즈 상세 정보</h2>
          <div class="popup-actions">
            <button @click="editQuiz" class="edit-button" title="수정">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button @click="closeQuizDetail" class="close-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="popup-content" v-if="selectedQuiz">
          <!-- 수정 모드 -->
          <div v-if="showEditMode" class="edit-mode">
            <div class="quiz-detail-section">
              <h3 class="section-title">퀴즈 제목</h3>
              <input 
                v-model="editForm.title" 
                type="text" 
                class="edit-input"
                placeholder="퀴즈 제목을 입력하세요"
              >
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">키워드</h3>
              <input 
                v-model="editKeywords" 
                type="text" 
                class="edit-input"
                placeholder="키워드를 쉼표로 구분하여 입력하세요"
                @input="updateKeywords"
              >
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">참고 사항 (프롬프트)</h3>
              <textarea 
                v-model="editForm.reference_notes" 
                class="edit-textarea"
                placeholder="AI 요약을 위한 참고 사항을 입력하세요..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">AI 요약 결과</h3>
              <textarea 
                v-model="editForm.ai_summary" 
                class="edit-textarea"
                placeholder="AI 요약 결과..."
                rows="5"
              ></textarea>
            </div>
            
            <div class="edit-actions">
              <button @click="saveQuizEdits" class="save-button">저장</button>
              <button @click="cancelEdit" class="cancel-button">취소</button>
            </div>
          </div>
          
          <!-- 일반 보기 모드 -->
          <div v-else class="view-mode">
            <div class="quiz-detail-section">
              <h3 class="section-title">퀴즈 제목</h3>
              <p class="quiz-title-large">{{ selectedQuiz.title }}</p>
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">생성 일시</h3>
              <p class="quiz-date-large">{{ formatDate(selectedQuiz.created_at) }}</p>
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">키워드</h3>
              <div class="keywords-container">
                <span v-for="keyword in selectedQuiz.keywords" :key="keyword" class="keyword-tag-large">
                  {{ keyword }}
                </span>
              </div>
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">참고 사항</h3>
              <p class="reference-notes">{{ selectedQuiz.reference_notes }}</p>
            </div>
            
            <div class="quiz-detail-section">
              <h3 class="section-title">AI 요약 결과 (경계선 지능인용 쉬운 표현)</h3>
              <div class="ai-summary">
                <div class="summary-icon">🤖</div>
                <p class="summary-text">{{ selectedQuiz.ai_summary }}</p>
              </div>
            </div>
          </div>
          
          <div class="quiz-detail-section">
            <h3 class="section-title">관련 이미지</h3>
            <div class="quiz-images">
              <div v-if="imageGenerating" class="image-generating-message">
                <div class="generating-spinner"></div>
                <p>이미지를 생성하는 중입니다. 잠시만 기다려 주세요...</p>
              </div>
              <div v-else class="images-container">
                <div v-for="(image, index) in selectedQuiz.quiz_images" :key="index" class="quiz-image-container">
                  <img 
                    :src="image" 
                    :alt="`퀴즈 이미지 ${index + 1}`" 
                    class="quiz-image"
                    @error="handleImageError($event, `quiz-image-${index}`)"
                  />
                  <div class="image-label">이미지 {{ index + 1 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 요약 결과 팝업 모달 -->
    <div v-if="showSummaryModal" class="summary-modal-overlay" @click="showSummaryModal = false">
      <div class="summary-modal" @click.stop>
        <div class="summary-modal-header">
          <h2 class="summary-modal-title">📋 자료 요약 결과</h2>
          <button @click="showSummaryModal = false" class="summary-close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="summary-modal-content">
          <!-- 첫 번째 행: 생성된 학습 이미지 (좌) + 처리 완료 (우) -->
          <div class="summary-top-row">
            <!-- 왼쪽: 생성된 학습 이미지 -->
            <div class="summary-left-section">
              <div class="summary-content-section">
                <h3 class="summary-section-title">🖼️ 생성된 학습 이미지</h3>
                <div class="large-image-container">
                  <div v-if="summaryResult.generatedImages && summaryResult.generatedImages.length > 0" class="large-image-item">
                    <div class="large-image-preview">
                      <img 
                        :src="`/images/${summaryResult.generatedImages[0]}`" 
                        alt="학습 이미지" 
                        class="large-preview-image"
                        @error="handleImageLoadError"
                      />
                    </div>
                  </div>
                  <div v-else class="large-image-item">
                    <div class="large-image-preview">
                      <div class="image-placeholder-text">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21,15 16,10 5,21"/>
                        </svg>
                        <p>이미지 제작중입니다</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 오른쪽: 처리 완료 정보 -->
            <div class="summary-right-section">
              <div class="summary-content-section">
                <h3 class="summary-section-title">✅ 처리 완료</h3>
                <div class="summary-info-grid">
                  <div class="info-item">
                    <span class="info-label">제목:</span>
                    <span class="info-value">{{ summaryResult.title }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">처리 시간:</span>
                    <span class="info-value">{{ summaryResult.processingTime }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">키워드:</span>
                    <div class="keywords-list">
                      <span v-for="(keyword, index) in summaryResult.keywords.slice(0, 5)" :key="keyword" class="keyword-pill">
                        {{ keyword }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 두 번째 행: 원본 요약 (좌) + 쉬운 설명 (우) -->
          <div class="summary-bottom-row">
            <!-- 왼쪽: 원본 요약 -->
            <div class="summary-left-section">
              <div class="summary-content-section">
                <h3 class="summary-section-title">📄 원본 요약</h3>
                <div class="summary-text-box original">
                  <p>{{ summaryResult.originalSummary }}</p>
                </div>
              </div>
            </div>

            <!-- 오른쪽: 쉬운 설명 -->
            <div class="summary-right-section">
              <div class="summary-content-section">
                <h3 class="summary-section-title">🎯 경계선 지능인을 위한 쉬운 설명</h3>
                <div class="summary-text-box simplified">
                  <pre>{{ summaryResult.simplifiedSummary }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-modal-footer">
          <button @click="showSummaryModal = false" class="summary-action-button primary">
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 애니메이션 상태
const showHeader = ref(false);
const showUpload = ref(false);
const showStudents = ref(false);
const showProblems = ref(false);

// 선택 상태
const selectedStudent = ref(null);
const selectedProblem = ref(null);

// 알림 관련 상태
const showNotifications = ref(false);
const hasUnreadNotifications = ref(true);
const unreadCount = ref(3);
const notifications = ref([
  {
    id: 1,
    title: '관리자 공지',
    message: '새로운 학습 자료가 업데이트되었습니다.',
    time: '10분 전',
    read: false,
    icon: '📢'
  },
  {
    id: 2,
    title: '시스템 알림',
    message: '서버 점검이 예정되어 있습니다.',
    time: '1시간 전',
    read: false,
    icon: '🔧'
  },
  {
    id: 3,
    title: '학습 현황',
    message: '김민수 학생이 새로운 과제를 완료했습니다.',
    time: '2시간 전',
    read: false,
    icon: '🎯'
  }
]);

// 폼 데이터
const materialForm = ref({
  title: '',
  keywords: '',
  notes: ''
});

const selectedFile = ref(null);
const selectedFileName = ref('');
const fileInput = ref(null);

// 목업 데이터
const mockStudents = ref([
  { id: 1, name: '김민수', grade: '초등 3학년', progress: 85 },
  { id: 2, name: '이지은', grade: '초등 3학년', progress: 92 },
  { id: 3, name: '박준호', grade: '초등 4학년', progress: 78 },
  { id: 4, name: '최서연', grade: '초등 3학년', progress: 88 },
  { id: 5, name: '정도현', grade: '초등 4학년', progress: 95 }
]);

// 퀴즈 데이터
const quizzes = ref([]);
const loading = ref(false);
const showQuizDetail = ref(false);
const selectedQuiz = ref(null);
const imageGenerating = ref(false);

// 요약 결과 팝업 관련 상태
const showSummaryModal = ref(false);
const summaryResult = ref({
  title: '',
  originalSummary: '',
  simplifiedSummary: '',
  keywords: [],
  generatedImages: [],
  processingTime: ''
});
const imageLoadStatus = ref({});
const showEditMode = ref(false);
const editForm = ref({
  title: '',
  keywords: [],
  reference_notes: '',
  ai_summary: ''
});
const editKeywords = ref('');

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

// 업로드 상태 및 진행률
const uploadProgress = ref(0);
const uploadStatus = ref(''); // 'uploading', 'processing', 'completed', 'error'
const processingMessage = ref('');

// 시뮬레이션을 위한 지연 함수
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 샘플 요약 데이터 생성 함수
function generateSampleSummary(title) {
  const samples = {
    '초등 수학 교육과정': {
      originalSummary: '초등 수학 교육과정은 2022 개정 교육과정에 따라 수와 연산, 도형, 측정, 규칙성, 자료와 가능성의 5개 핵심 영역으로 구성되어 있습니다. 각 영역은 학년군별 위계적 체계를 갖추고 있으며, 1-2학년군에서는 수 개념 형성과 기초 연산 능력 배양에 중점을 둡니다. 구체적으로 9까지의 수 세기부터 시작하여 100까지의 수 개념을 확장하고, 받아올림과 받아내림이 없는 두 자리 수의 덧셈과 뺄셈을 학습합니다. 3-4학년군에서는 네 자리 수까지의 수 체계를 이해하고, 곱셈과 나눗셈의 기본 원리를 익히며, 분수와 소수의 기초 개념을 도입합니다. 5-6학년군에서는 분수와 소수의 사칙연산, 비와 비율, 직육면체의 부피 등 심화된 수학적 개념을 다룹니다. 경계선 지능 학습자를 위해서는 구체적 조작물(블록, 카운터, 측정도구 등)과 시각적 자료를 적극 활용한 체험 중심의 교수학습이 권장되며, 개별 학습자의 인지적 특성과 학습 속도를 고려한 맞춤형 지원이 필요합니다.',
      simplifiedSummary: '초등학교 수학은 숫자 계산하기, 도형 알아보기, 길이 재기, 패턴 찾기, 정보 정리하기 5가지를 배워요.\n사과 개수 세기, 동그라미·세모·네모 구분하기, 자로 길이 재기 등 일상생활에서 쓰는 수학을 단계별로 익혀요.\n손으로 만지고 놀이하며 천천히 반복 연습하면 누구나 쉽게 배울 수 있어요!',
      keywords: ['수학', '초등교육', '수와연산', '도형', '측정', '규칙성', '자료정리', '사칙연산', '분수', '기하', '패턴인식', '수학적사고'],
      generatedImages: ['apples_4.png']
    },
    '국어 읽기 교육 자료': {
      originalSummary: '국어 읽기 교육은 2022 개정 국어과 교육과정에 따라 문자 해득부터 심화된 독해까지 체계적으로 구성되어 있습니다. 경계선 지능 학습자의 읽기 교육은 개별 학습자의 인지적 특성을 고려한 맞춤형 접근이 필요하며, 특히 음성언어와 문자언어의 대응 관계를 이해하는 것부터 시작해야 합니다. 1단계 문자 해득 과정에서는 자모음의 기본형과 결합형을 익히고, 음성과 문자의 대응 관계를 파악합니다. 2단계 단어 인식에서는 의미 단위로서의 단어를 인식하고, 고빈도 단어부터 점진적으로 어휘력을 확장해나갑니다. 3단계 문장 이해에서는 주어, 서술어, 목적어 등의 문장 성분과 조사의 기능을 이해하며, 문맥상 의미를 파악하는 능력을 기릅니다. 4단계 글 전체 이해에서는 글의 중심 내용과 세부 내용을 구분하고, 글쓴이의 의도나 글의 주제를 파악하는 종합적 독해력을 배양합니다. 경계선 지능 학습자를 위한 효과적인 읽기 지도 방법으로는 다감각적 접근(시각, 청각, 촉각 활용), 반복 학습을 통한 자동화, 구체적 맥락과 연결된 어휘 학습, 그림책과 멀티미디어 자료 활용 등이 권장됩니다.',
      simplifiedSummary: '국어 읽기는 ㄱ,ㄴ,ㄷ 글자 익히기 → 엄마, 아빠 같은 단어 읽기 → 문장 이해하기 → 동화책 읽기 순서로 배워요.\n그림과 함께 소리 내어 읽고, 같은 책을 여러 번 반복해서 읽으면 점점 쉬워져요.\n매일 조금씩 책을 읽는 습관을 만들면 글 읽기가 재미있어져요!',
      keywords: ['국어', '읽기', '문해력', '이해력', '어휘력', '한글', '문장구조', '독해', '음성언어', '문자언어', '다감각학습'],
      generatedImages: ['apples_4.png']
    },
    '생활 안전 교육 가이드': {
      originalSummary: '생활 안전 교육은 일상생활에서 발생할 수 있는 다양한 위험 상황을 인식하고 적절히 대처할 수 있는 능력을 기르는 교육입니다. 경계선 지능 학습자를 위해서는 구체적이고 반복적인 안전 수칙 교육이 필요하며, 역할놀이나 시뮬레이션을 통한 체험 학습이 효과적입니다. 교통안전, 화재안전, 생활안전, 자연재해 대응 등의 영역으로 구분하여 각 상황별 대처 방법을 단계적으로 학습합니다. 특히 반복 학습을 통해 위험 상황에서 자동적으로 올바른 행동을 할 수 있도록 지도해야 합니다.',
      simplifiedSummary: '안전하게 생활하려면 길 건널 때 신호등 보기, 불이 나면 119 신고하고 대피하기, 가스·전기 조심하기를 알아야 해요.\n위험한 상황에서 어떻게 행동해야 하는지 미리 배우고 반복해서 연습하는 것이 중요해요.\n항상 어른과 함께 안전 수칙을 지키면서 생활해요!',
      keywords: ['안전교육', '교통안전', '화재안전', '생활안전', '자연재해', '응급처치', '대피요령'],
      generatedImages: ['apples_4.png']
    },
    '금융 교육 프로그램': {
      originalSummary: '금융 교육은 합리적인 경제생활을 위한 기초 소양을 기르는 교육으로, 용돈 관리, 저축의 중요성, 소비와 투자의 개념을 포함합니다. 경계선 지능 학습자의 경우 추상적인 개념보다는 구체적인 생활 사례를 중심으로 학습하는 것이 효과적입니다. 용돈기입장 작성, 저축 계획 세우기, 현명한 소비 판단 등의 실용적 기능을 중점적으로 교육하며, 실제 화폐를 이용한 체험 활동을 통해 돈의 가치와 중요성을 이해하도록 지도합니다.',
      simplifiedSummary: '돈을 똑똑하게 쓰려면 용돈 기입장에 받은 돈과 쓴 돈을 기록하고, 일부는 저축해서 모아두어야 해요.\n사고 싶은 것이 있을 때 "정말 필요한가?" 생각해보고, 필요한 것부터 사는 것이 현명한 소비예요.\n돈의 소중함을 알고 계획을 세워서 사용하면 원하는 것을 살 수 있어요!',
      keywords: ['금융교육', '용돈관리', '저축', '소비', '투자', '이자', '예산', '경제생활'],
      generatedImages: ['apples_4.png']
    }
  };
  
  return samples[title] || samples['초등 수학 교육과정'];
}

// 이미지 로드 상태 관리 함수들
function handleImageLoad(event) {
  const image = event.target.alt;
  imageLoadStatus.value[image] = true;
}

function handleImageError(event, imageName) {
  console.warn(`이미지 로드 실패: ${imageName}`);
  imageLoadStatus.value[imageName] = false;
  // 기본 이미지로 대체
  event.target.src = '/images/apple-image.png';
}

function handleImageLoadError(event) {
  console.error('이미지 로드 실패');
  // 이미지를 플레이스홀더로 대체
  event.target.style.display = 'none';
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder-text';
  placeholder.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
    <p>이미지 제작중입니다</p>
  `;
  event.target.parentNode.appendChild(placeholder);
}

// summaryResult 변경 시 이미지 로드 상태 초기화
watch(() => summaryResult.value.generatedImages, (newImages, oldImages) => {
  if (newImages && newImages.length > 0 && JSON.stringify(newImages) !== JSON.stringify(oldImages)) {
    const newStatus = {};
    newImages.forEach(image => {
      newStatus[image] = false;
    });
    imageLoadStatus.value = newStatus;
  }
}, { immediate: true });

const uploadMaterial = async () => {
  if (!selectedFile.value || !materialForm.value.title) {
    alert('제목과 파일을 모두 입력해주세요.');
    return;
  }
  
  try {
    uploadStatus.value = 'uploading';
    uploadProgress.value = 0;
    processingMessage.value = '파일을 업로드하는 중...';
    
    // 시뮬레이션을 위한 단계별 처리
    await simulateDelay(500);
    uploadProgress.value = 20;
    processingMessage.value = '파일을 분석하는 중...';
    
    await simulateDelay(800);
    uploadProgress.value = 40;
    processingMessage.value = 'AI가 자료를 요약하는 중...';
    
    await simulateDelay(1000);
    uploadProgress.value = 60;
    processingMessage.value = '경계선 지능인을 위한 쉬운 내용으로 변환 중...';
    
    await simulateDelay(800);
    uploadProgress.value = 80;
    processingMessage.value = '학습 이미지를 생성하는 중...';
    
    await simulateDelay(600);
    uploadProgress.value = 95;
    processingMessage.value = '데이터를 저장하는 중...';
    
    // 실제 서버 연결을 시도하되, 실패시 시뮬레이션 모드로 전환
    try {
      const formData = new FormData();
      formData.append('title', materialForm.value.title);
      formData.append('keywords', materialForm.value.keywords);
      formData.append('notes', materialForm.value.notes);
      formData.append('file', selectedFile.value);
      
      // 타임아웃을 위한 AbortController 생성
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃
      
      const response = await fetch('http://127.0.0.1:8000/api/materials/', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Server error');
      
    } catch (serverError) {
      console.log('서버 연결 실패, 시뮬레이션 모드로 전환:', serverError.message);
      // 서버 연결 실패시 시뮬레이션 모드로 계속 진행
    }
    
    await simulateDelay(300);
    
    // 업로드 완료 처리 (서버 성공 여부와 관계없이)
    uploadProgress.value = 100;
    processingMessage.value = '업로드 완료!';
    uploadStatus.value = 'completed';
    
    // 샘플 요약 결과 생성
    const sampleData = generateSampleSummary(materialForm.value.title);
    summaryResult.value = {
      title: materialForm.value.title,
      originalSummary: sampleData.originalSummary,
      simplifiedSummary: sampleData.simplifiedSummary,
      keywords: sampleData.keywords,
      generatedImages: sampleData.generatedImages,
      processingTime: '약 2분 30초'
    };
    console.log('생성된 이미지:', sampleData.generatedImages);
    
    // 요약 결과 팝업 표시
    setTimeout(() => {
      showSummaryModal.value = true;
    }, 1500);
    
    // 퀴즈 목록 새로고침 시도 (오류 무시)
    try {
      await loadQuizzes();
    } catch (error) {
      console.log('퀴즈 목록 새로고침 실패 (무시):', error.message);
    }
    
    // 폼 초기화
    setTimeout(() => {
      materialForm.value = {
        title: '',
        keywords: '',
        notes: ''
      };
      selectedFile.value = null;
      selectedFileName.value = '';
      uploadStatus.value = '';
      uploadProgress.value = 0;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }, 2000);
    
  } catch (error) {
    console.error('업로드 오류:', error);
    uploadStatus.value = 'error';
    processingMessage.value = '업로드 중 오류가 발생했습니다.';
    uploadProgress.value = 0;
  }
};

// Gemini API로 PDF 요약
const processWithGemini = async (file: File, promptNotes: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt_notes', promptNotes);
    
    const response = await fetch('http://127.0.0.1:8000/api/process-pdf/', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.summary;
    } else {
      // 폴백: 모의 요약 데이터
      return '이 자료는 기본적인 학습 내용을 다루고 있습니다. 주요 개념과 예시를 포함하여 학습자가 이해하기 쉬된 방식으로 구성되어 있습니다.';
    }
  } catch (error) {
    console.error('Gemini API 오류:', error);
    return '자료 요약 중 오류가 발생했습니다.';
  }
};

// 경계선 지능인용 쉬운 표현으로 번역
const simplifyForBorderlineIntelligence = async (originalText: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/simplify-text/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: originalText,
        target_level: 'borderline_intelligence'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.simplified_text;
    } else {
      // 폴백: 기본 단순화
      return originalText
        .replace(/나타냅니다/g, '나온다')
        .replace(/사용합니다/g, '쓴다')
        .replace(/활용합니다/g, '쓴다')
        .replace(/이해합니다/g, '알니다')
        .replace(/방법/g, '방법')
        .replace(/수행/g, '하기')
        .replace(/수업/g, '공부')
        .split('.')
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim().length > 50 ? sentence.trim().substring(0, 50) + '...' : sentence.trim())
        .join('. ');
    }
  } catch (error) {
    console.error('텍스트 단순화 오류:', error);
    return originalText;
  }
};

// 학습 이미지 생성
const generateLearningImages = async (summaryText: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/generate-images/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: summaryText,
        count: 2,
        style: 'educational_simple'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.images;
    } else {
      // 폴백: 플레이스홀더 이미지
      return [
        'https://via.placeholder.com/300x200/4CAF50/white?text=학습+이미지+1',
        'https://via.placeholder.com/300x200/2196F3/white?text=학습+이미지+2'
      ];
    }
  } catch (error) {
    console.error('이미지 생성 오류:', error);
    return [
      'https://via.placeholder.com/300x200/FF9800/white?text=이미지+생성+중',
      'https://via.placeholder.com/300x200/E91E63/white?text=이미지+생성+중'
    ];
  }
};

// 알림 관련 함수
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (notificationId: number) => {
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    updateNotificationStatus();
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
  updateNotificationStatus();
};

// 퀴즈 관리 기능
const loadQuizzes = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://127.0.0.1:8000/api/materials/');
    if (response.ok) {
      const data = await response.json();
      quizzes.value = data.results || data;
    } else {
      // 데모 데이터 사용
      quizzes.value = [
        {
          id: 1,
          title: '동물 이름 맞추기',
          created_at: '2024-01-15T10:30:00Z',
          keywords: ['동물', '이름', '기초'],
          question_count: 5,
          status: 'active',
          ai_summary: '다양한 동물들의 이름을 이미지를 보고 맞추는 문제입니다. 기초적인 인지 능력을 가진 학습자들을 위해 시각적 인식을 기반으로 한 학습 방법을 활용했습니다.',
          reference_notes: '어린이들이 쉽게 접할 수 있는 대표적인 동물들(개, 고양이, 토끼, 새 등)로 구성했으며, 실생활과 밀접한 연관성을 고려하여 제작했습니다.',
          quiz_images: [
            'https://via.placeholder.com/300x200/4CAF50/white?text=동물+학습+카드',
            'https://via.placeholder.com/300x200/2196F3/white?text=동물+식별+게임'
          ]
        },
        {
          id: 2,
          title: '숫자 세기 연습',
          created_at: '2024-01-14T14:20:00Z',
          keywords: ['숫자', '세기', '수학'],
          question_count: 3,
          status: 'active',
          ai_summary: '1부터 10까지의 숫자를 이미지를 보고 세는 연습 문제입니다. 경계선 지능 학습자들의 인지적 특성을 고려하여 단계별 학습이 가능하도록 설계하였습니다.',
          reference_notes: '사과, 공, 연필 등 일상 생활 속에서 쉽게 찾을 수 있는 사물로 숫자 개념을 학습할 수 있도록 구성했습니다. 시각적 인지에 의존하는 학습 방식을 활용했습니다.',
          quiz_images: [
            'https://via.placeholder.com/300x200/FF9800/white?text=숫자+학습+카드',
            'https://via.placeholder.com/300x200/E91E63/white?text=세기+연습+게임'
          ]
        }
      ];
    }
  } catch (error) {
    console.error('퀴즈 로드 오류:', error);
    quizzes.value = [
      {
        id: 1,
        title: '동물 이름 맞추기',
        created_at: '2024-01-15T10:30:00Z',
        keywords: ['동물', '이름', '기초'],
        question_count: 5,
        status: 'active',
        ai_summary: '다양한 동물들의 이름을 이미지를 보고 맞추는 문제입니다.',
        reference_notes: '어린이들이 쉽게 접할 수 있는 대표적인 동물들로 구성',
        quiz_images: [
          'https://via.placeholder.com/300x200/4CAF50/white?text=동물+학습',
          'https://via.placeholder.com/300x200/2196F3/white?text=동물+카드'
        ]
      }
    ];
  }
  loading.value = false;
};

const openQuizDetail = (quiz) => {
  selectedQuiz.value = quiz;
  showQuizDetail.value = true;
};

const closeQuizDetail = () => {
  showQuizDetail.value = false;
  selectedQuiz.value = null;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 퀴즈 수정 관련 함수
const editQuiz = () => {
  if (selectedQuiz.value) {
    showEditMode.value = true;
    editForm.value = {
      title: selectedQuiz.value.title,
      keywords: [...selectedQuiz.value.keywords],
      reference_notes: selectedQuiz.value.reference_notes || '',
      ai_summary: selectedQuiz.value.ai_summary || ''
    };
    editKeywords.value = selectedQuiz.value.keywords.join(', ');
  }
};

const updateKeywords = () => {
  editForm.value.keywords = editKeywords.value
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0);
};

const saveQuizEdits = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/materials/${selectedQuiz.value.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editForm.value.title,
        keywords: editForm.value.keywords,
        reference_notes: editForm.value.reference_notes,
        ai_summary: editForm.value.ai_summary
      })
    });
    
    if (response.ok) {
      const updatedQuiz = await response.json();
      selectedQuiz.value = updatedQuiz;
      
      // 퀴즈 목록 업데이트
      const quizIndex = quizzes.value.findIndex(q => q.id === selectedQuiz.value.id);
      if (quizIndex !== -1) {
        quizzes.value[quizIndex] = updatedQuiz;
      }
      
      showEditMode.value = false;
      alert('퀴즈 정보가 수정되었습니다.');
    } else {
      throw new Error('수정 실패');
    }
  } catch (error) {
    console.error('퀴즈 수정 오류:', error);
    alert('퀴즈 수정 중 오류가 발생했습니다.');
  }
};

const cancelEdit = () => {
  showEditMode.value = false;
  editForm.value = {
    title: '',
    keywords: [],
    reference_notes: '',
    ai_summary: ''
  };
};


// 학생 관리 기능
const selectStudent = (studentId: number) => {
  selectedStudent.value = selectedStudent.value === studentId ? null : studentId;
};

const addStudent = () => {
  const name = prompt('학생 이름을 입력하세요:');
  if (name && name.trim()) {
    const grade = prompt('학년을 입력하세요: (예: 초등 3학년)');
    if (grade && grade.trim()) {
      const newStudent = {
        id: mockStudents.value.length + 1,
        name: name.trim(),
        grade: grade.trim(),
        progress: 0
      };
      mockStudents.value.push(newStudent);
      alert(`${name} 학생이 추가되었습니다.`);
    }
  }
};

const editStudent = () => {
  if (!selectedStudent.value) {
    alert('수정할 학생을 먼저 선택해주세요.');
    return;
  }
  
  const student = mockStudents.value.find(s => s.id === selectedStudent.value);
  if (student) {
    const newName = prompt('새로운 이름을 입력하세요:', student.name);
    if (newName && newName.trim()) {
      const newGrade = prompt('새로운 학년을 입력하세요:', student.grade);
      if (newGrade && newGrade.trim()) {
        student.name = newName.trim();
        student.grade = newGrade.trim();
        alert('학생 정보가 수정되었습니다.');
        selectedStudent.value = null;
      }
    }
  }
};

const deleteStudent = () => {
  if (!selectedStudent.value) {
    alert('삭제할 학생을 먼저 선택해주세요.');
    return;
  }
  
  const student = mockStudents.value.find(s => s.id === selectedStudent.value);
  if (student && confirm(`${student.name} 학생을 삭제하시겠습니까?`)) {
    const index = mockStudents.value.findIndex(s => s.id === selectedStudent.value);
    mockStudents.value.splice(index, 1);
    alert(`${student.name} 학생이 삭제되었습니다.`);
    selectedStudent.value = null;
  }
};

// 문제 관리 기능
const selectProblem = (problemId: number) => {
  selectedProblem.value = selectedProblem.value === problemId ? null : problemId;
};

// Problem-related functions removed - using quiz system instead

const handleClickOutside = (event) => {
  if (showNotifications.value) {
    const notificationPopup = document.querySelector('.notifications-popup');
    if (notificationPopup && !notificationPopup.contains(event.target)) {
      showNotifications.value = false;
    }
  }
};

const updateNotificationStatus = () => {
  const unreadNotifications = notifications.value.filter(n => !n.read);
  unreadCount.value = unreadNotifications.length;
  hasUnreadNotifications.value = unreadNotifications.length > 0;
};

// 마운트 시 애니메이션 시작
onMounted(() => {
  setTimeout(() => showHeader.value = true, 100);
  setTimeout(() => showUpload.value = true, 300);
  setTimeout(() => showStudents.value = true, 500);
  setTimeout(() => showProblems.value = true, 700);
  document.addEventListener('click', handleClickOutside);
  loadQuizzes();
});
</script>

<style>
.teacher-main-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  position: relative;
  overflow-x: hidden;
}

/* 전체 페이지 스크롤바 숨기기 */
html {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

html::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

body {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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

/* 헤더 */
.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0.25rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.6s ease;
}

.page-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.header-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  height: 100%;
}

.grid-cell {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 1번칸 - 홍길동 선생님 + 응원문구 (좌측 정렬) */
.cell-1 {
  justify-content: flex-start;
}

/* 5번칸 - 메시지 + 나가기 (중앙 정렬) */
.cell-5 {
  justify-content: center;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  overflow: visible;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-info-inline {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  white-space: nowrap;
  overflow: visible;
}

.user-info-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.01rem;
  white-space: nowrap;
  overflow: visible;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex-shrink: 0;
}

.user-greeting {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.user-greeting-inline {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
  white-space: nowrap;
}

.user-greeting-vertical {
  font-size: 0.7rem;
  color: #718096;
  margin: 0;
  white-space: nowrap;
}

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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.logout-button-compact {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: visible;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.logout-button-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
}

.logout-text {
  white-space: nowrap;
}


.notification-button {
  position: relative;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(135, 206, 235, 0.3);
  color: #5dade2;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-button:hover {
  background: rgba(135, 206, 235, 0.5);
  transform: scale(1.05);
}

.notification-button.has-unread {
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
  color: white;
  animation: notification-pulse 2s infinite;
}

.notification-button-compact {
  position: relative;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: rgba(135, 206, 235, 0.4);
  color: #4a8bb8;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: visible;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.notification-button-compact:hover {
  background: rgba(135, 206, 235, 0.6);
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.notification-button-compact.has-unread {
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
  color: white;
  animation: notification-pulse 2s infinite;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #fbbf24;
  color: #92400e;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 14px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.notifications-popup {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  max-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: between;
  align-items: center;
  background: #f8f9fa;
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
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.mark-read-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  gap: 0.75rem;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 50%;
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
  margin: 0 0 0.25rem 0;
  font-size: 0.8rem;
  line-height: 1.4;
}

.notification-time {
  color: #9ca3af;
  margin: 0;
  font-size: 0.75rem;
}

@keyframes notification-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(135, 206, 235, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(135, 206, 235, 0);
  }
}

/* 메인 컨텐츠 */
.main-content {
  position: relative;
  z-index: 5;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: calc(2.5rem + 2rem); /* 고정 헤더 실제 높이(약 2.5rem) + 2rem 간격 */
  padding-bottom: 1rem; /* 끝 블럭 간격 */
}

/* 상단 섹션 */
.top-section {
  margin-bottom: 2rem; /* 2분의 1로 감소 */
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
  gap: 2rem; /* 2분의 1로 감소 */
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.upload-icon {
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
}

.student-icon {
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
}

.problem-icon {
  background: linear-gradient(135deg, #87ceeb 0%, #5dade2 100%);
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
  margin: 0.01rem 0 0 0; /* 3분의 1로 감소 */
}

/* 업로드 컨텐츠 */
.upload-content {
  padding: 2rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;
}

.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
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
  border: 1px solid #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #9ca3af;
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  background: #10b981;
}

.edit-btn:hover {
  background: #3b82f6;
}

.delete-btn:hover {
  background: #ef4444;
}

/* 리스트 */
.students-list,
.problems-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 방지 */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%; /* 컨테이너 전체 너비 사용 */
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
  cursor: pointer;
  position: relative;
  border: 1px solid #e5e7eb;
}

.student-item:hover,
.problem-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  border-color: #4a90e2;
}

.student-item.selected,
.problem-item.selected {
  background: rgba(74, 144, 226, 0.1);
  border-color: #4a90e2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.selection-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #4a90e2;
  font-weight: bold;
  font-size: 1.2rem;
}

/* 퀴즈 리스트 스타일 */
.loading-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
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
  color: #374151;
}

.empty-subtext {
  font-size: 0.875rem;
  margin: 0;
}

.quizzes-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.quiz-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.quiz-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  border-color: #4a90e2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
}

.quiz-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.quiz-status {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  font-size: 8px;
}

.quiz-status.active {
  color: #10b981;
}

.quiz-info {
  flex: 1;
  min-width: 0;
}

.quiz-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.quiz-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.quiz-date,
.quiz-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.quiz-keywords {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.keyword-tag {
  background: rgba(74, 144, 226, 0.1);
  color: #4a90e2;
  padding: 0.125rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  font-weight: 500;
}

.quiz-arrow {
  color: #9ca3af;
  font-size: 1.25rem;
  font-weight: bold;
}

/* 퀴즈 상세 팝업 */
.quiz-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.quiz-detail-popup {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: popup-appear 0.3s ease-out;
}

@keyframes popup-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.popup-content {
  padding: 2rem;
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}

.quiz-detail-section {
  margin-bottom: 1.5rem;
}

.quiz-detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
}

.quiz-title-large {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.quiz-date-large {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.keywords-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.keyword-tag-large {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.reference-notes {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #4a90e2;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.ai-summary {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.summary-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.summary-text {
  color: #0c4a6e;
  line-height: 1.6;
  margin: 0;
}

.quiz-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.quiz-image-container {
  text-align: center;
}

.quiz-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.quiz-image:hover {
  border-color: #4a90e2;
  transform: scale(1.02);
}

.image-label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .quiz-detail-popup {
    width: 95%;
    margin: 1rem;
  }
  
  .popup-content {
    padding: 1.5rem;
  }
  
  .quiz-images {
    grid-template-columns: 1fr;
  }
  
  .quiz-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
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

/* 로딩 및 빈 상태 스타일 */
.loading-message,
.no-quizzes {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
}

.loading-message {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  color: #0288d1;
  border-color: #4fc3f7;
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

/* 업로드 진행률 스타일 */
.upload-progress-section {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.progress-message {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  font-size: 0.8rem;
  color: #6b7280;
  text-align: center;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 퀴즈 수정 모드 스타일 */
.popup-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-button {
  width: 36px;
  height: 36px;
  border: none;
  background: #4a90e2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #357abd;
  transform: translateY(-1px);
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.edit-input:focus,
.edit-textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.save-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button {
  background: #059669;
  color: white;
}

.save-button:hover {
  background: #047857;
  transform: translateY(-1px);
}

.cancel-button {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-button:hover {
  background: #e5e7eb;
  color: #4b5563;
}

/* 이미지 생성 상태 스타일 */
.image-generating-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fef7cd 0%, #fbbf24 10%, #fef7cd 100%);
  border-radius: 12px;
  border: 2px dashed #f59e0b;
  text-align: center;
  grid-column: 1 / -1;
}

.generating-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #fbbf24;
  border-top: 3px solid #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.image-generating-message p {
  color: #92400e;
  font-weight: 500;
  margin: 0;
}

.images-container {
  display: contents;
}

/* 반응형 */
@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
    gap: 1.5rem; /* 모바일에서도 2분의 1로 감소 */
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .top-section {
    margin-bottom: 1.5rem; /* 모바일에서도 2분의 1로 감소 */
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .quiz-images {
    grid-template-columns: 1fr;
  }
  
  .edit-actions {
    flex-direction: column;
  }
}

/* 요약 결과 팝업 모달 스타일 */
.summary-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fade-in 0.3s ease;
}

.summary-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slide-up 0.4s ease;
  display: flex;
  flex-direction: column;
}

.summary-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.summary-modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.summary-close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: white;
  backdrop-filter: blur(4px);
}

.summary-close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.summary-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-content-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.summary-content-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 새로운 2x2 그리드 레이아웃 스타일 */
.summary-top-row,
.summary-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.summary-bottom-row {
  margin-bottom: 0;
}

.summary-left-section,
.summary-right-section {
  display: flex;
  flex-direction: column;
}

/* 큰 이미지 컨테이너 스타일 */
.large-image-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.large-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.large-image-item:hover {
  background: #f0f9ff;
  border-color: #4a90e2;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
  transform: translateY(-2px);
}

.large-image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
}

.large-preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  display: block;
}

.large-image-item:hover .large-preview-image {
  transform: scale(1.1);
}


.image-loading-placeholder.large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.image-placeholder-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #9ca3af;
  width: 100%;
  height: 100%;
}

.image-placeholder-text svg {
  color: #d1d5db;
}

.image-placeholder-text p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.summary-section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.summary-info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 80px;
  flex-shrink: 0;
  font-size: 0.95rem;
}

.info-value {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.5;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-pill {
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e0f2fe;
}

.summary-text-box {
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  background: #fafafa;
}

.summary-text-box.original {
  background: #fef7ff;
  border-color: #e879f9;
}

.summary-text-box.simplified {
  background: #f0fdf4;
  border-color: #22c55e;
}

.summary-text-box p {
  margin: 0;
  line-height: 1.6;
  color: #374151;
}

.summary-text-box pre {
  margin: 0;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.generated-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.generated-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.generated-image-item:hover {
  border-color: #4a90e2;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.2);
  transform: translateY(-2px);
}

.generated-image-preview {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.generated-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  color: #9ca3af;
  border-radius: 6px;
}

.image-placeholder {
  width: 60px;
  height: 60px;
  background: #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.image-name {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0;
  word-break: break-all;
}

.summary-modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  background: #f9fafb;
}

.summary-action-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.summary-action-button.primary {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
}

.summary-action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.3);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .summary-modal {
    width: 95%;
    max-height: 95vh;
    margin: 0 10px;
  }
  
  .summary-modal-header,
  .summary-modal-content,
  .summary-modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .summary-modal-content {
    gap: 1.5rem;
  }
  
  /* 모바일에서 2x2 그리드를 1열로 변경 */
  .summary-top-row,
  .summary-bottom-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .large-image-preview {
    width: 100px;
    height: 100px;
  }
  
  .large-image-item {
    padding: 1rem;
  }
  
  .large-image-name {
    font-size: 0.875rem;
  }
  
  .generated-images-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .info-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .info-label {
    min-width: auto;
  }
}
</style>