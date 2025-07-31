<template>
  <div class="student-main-page">
    <!-- 토스 스타일 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 12" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>

    <!-- 고정 헤더 -->
    <header class="page-header fixed-header" :class="{ 'animate-in': showHeader }">
      <div class="header-grid">
        <!-- 1번칸에 김민수님 + 응원문구 -->
        <div class="grid-cell cell-1">
          <div class="user-info-vertical">
            <h1 class="user-name">{{ authStore.currentUser?.username || '민수' }}님</h1>
            <p class="user-greeting-vertical">오늘도 즐겁게 공부해요! 📚</p>
          </div>
        </div>
        
        <!-- 2번칸 빈 공간 -->
        <div class="grid-cell cell-2"></div>
        
        <!-- 3번칸 빈 공간 -->
        <div class="grid-cell cell-3"></div>
        
        <!-- 4번칸 빈 공간 -->
        <div class="grid-cell cell-4"></div>
        
        <!-- 5번칸에 나가기 -->
        <div class="grid-cell cell-5">
          <div class="action-buttons-group">
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
      
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">

      <!-- 퀴즈 블럭 섹션 -->
      <div class="quiz-sections">
        <!-- 진행해야 할 퀴즈 (왼쪽) -->
        <div class="pending-quizzes-section">
          <div class="quiz-section-card" :class="{ 'animate-in': showHomeworkSection }">
            <div class="card-header">
              <div class="card-icon pending-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">풀어야 할 퀴즈</h2>
                <p class="card-subtitle">{{ pendingHomework.length }}개의 퀴즈가 기다리고 있어요</p>
              </div>
            </div>
            
            <div class="quiz-content">
              <div class="quiz-list">
                <div 
                  v-for="homework in pendingHomework" 
                  :key="homework.id"
                  class="quiz-item"
                  @click="startHomework(homework)"
                >
                  <div class="quiz-status">
                    <div class="status-circle pending"></div>
                  </div>
                  <div v-if="homework.previewImage" class="quiz-preview">
                    <img :src="`/images/${homework.previewImage}`" :alt="homework.title" class="quiz-preview-image" />
                  </div>
                  <div class="quiz-info">
                    <h4 class="quiz-title">{{ homework.title }}</h4>
                  </div>
                  <div class="quiz-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div v-if="pendingHomework.length === 0" class="no-quizzes">
                <div class="no-quizzes-icon">🎉</div>
                <h3>모든 퀴즈를 완료했어요!</h3>
                <p>정말 잘했어요!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 완료된 퀴즈 (오른쪽) -->
        <div class="completed-quizzes-section">
          <div class="quiz-section-card" :class="{ 'animate-in': showHomeworkSection }">
            <div class="card-header">
              <div class="card-icon completed-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11L12 14L22 4"/>
                  <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">완료한 퀴즈</h2>
                <p class="card-subtitle">{{ completedHomework.length }}개의 퀴즈를 완료했어요</p>
              </div>
            </div>
            
            <div class="quiz-content">
              <div class="quiz-list">
                <div 
                  v-for="homework in completedHomework" 
                  :key="homework.id"
                  class="quiz-item completed"
                  @click="viewCompletedQuiz(homework)"
                >
                  <div class="quiz-status">
                    <div class="status-icon completed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                      </svg>
                    </div>
                  </div>
                  <div v-if="homework.previewImage" class="quiz-preview">
                    <img :src="`/images/${homework.previewImage}`" :alt="homework.title" class="quiz-preview-image" />
                  </div>
                  <div class="quiz-info">
                    <div class="quiz-title-with-score">
                      <h4 class="quiz-title">{{ homework.title }}</h4>
                      <span class="quiz-score" v-if="homework.lastResult">
                        {{ homework.lastResult.correct }}/{{ homework.lastResult.total }}
                      </span>
                    </div>
                  </div>
                  <div class="quiz-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div v-if="completedHomework.length === 0" class="no-quizzes">
                <div class="no-quizzes-icon">📚</div>
                <h3>아직 완료한 퀴즈가 없어요</h3>
                <p>퀴즈를 풀고 결과를 확인해보세요!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
    

    <!-- 낱말 연결 게임 모달 -->
    <div v-if="showWordGame" class="game-modal-overlay" @click="closeWordGame">
      <div class="game-modal" @click.stop>
        <div class="game-modal-header">
          <h3>{{ currentGameData?.title }}</h3>
          <button @click="closeWordGame" class="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="game-modal-content">
          <WordConnectionGame
            v-if="currentGameData?.connections"
            :connections="currentGameData.connections"
            @exit="closeWordGame"
          />
        </div>
      </div>
    </div>

    <!-- 퀴즈 결과 모달 -->
    <div v-if="showQuizResult" class="quiz-result-modal-overlay" @click="closeQuizResult">
      <div class="quiz-result-modal" @click.stop>
        <div class="quiz-result-header">
          <h3>{{ selectedCompletedQuiz?.title }}</h3>
          <button @click="closeQuizResult" class="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="quiz-result-content" v-if="selectedCompletedQuiz?.lastResult">
          <!-- 결과 요약 -->
          <div class="result-summary">
            <div class="result-score">
              <div class="score-circle" :class="getScoreClass(selectedCompletedQuiz.lastResult)">
                <span class="score-text">{{ selectedCompletedQuiz.lastResult.correct }}/{{ selectedCompletedQuiz.lastResult.total }}</span>
              </div>
              <div class="score-label">
                {{ getScoreLabel(selectedCompletedQuiz.lastResult) }}
              </div>
            </div>
          </div>
          
          <!-- 문제별 결과 -->
          <div class="question-results">
            <h4>문제별 결과</h4>
            <div class="question-list">
              <div 
                v-for="(answer, index) in selectedCompletedQuiz.lastResult.answers" 
                :key="index"
                class="question-result-item"
              >
                <div class="question-number">{{ index + 1 }}</div>
                <div class="question-content">
                  <div class="question-text">{{ answer.question?.question || `문제 ${index + 1}` }}</div>
                  <div class="question-explanation">{{ answer.explanation }}</div>
                </div>
                <div class="question-result" :class="{ 'correct': answer.isCorrect, 'incorrect': !answer.isCorrect }">
                  {{ answer.isCorrect ? 'O' : 'X' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 플로팅 AI 튜터 버튼 -->
    <div 
      v-if="showFloatingButton" 
      class="floating-ai-button"
      @click="openAITutor"
      :class="{ 'animate-in': showFloatingButton }"
    >
      <div class="floating-button-content">
        <div class="ai-avatar">
          <img src="/images/ai-tutor-icon.png" alt="AI 튜터" class="ai-avatar-image" />
        </div>
        <div class="floating-tooltip">AI 튜터에게 질문하기</div>
      </div>
    </div>

    <!-- AI 튜터 모달 -->
    <AITutorModal
      :show="showAITutor"
      :userName="(authStore.currentUser?.username || '민수').replace('김', '')"
      @close="closeAITutor"
    />

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
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useQuizStore } from '../stores/quiz';
import { useHistoryStore } from '../stores/history';
import ErrorHandler from '../components/ErrorHandler.vue';
import WordConnectionGame from '../components/WordConnectionGame.vue';
import AITutorModal from '../components/AITutorModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const quizStore = useQuizStore();
const historyStore = useHistoryStore();

// 애니메이션 상태
const showHeader = ref(false);
const showQuestionSection = ref(false);
const showHomeworkSection = ref(false);

// AI 튜터 모달 상태
const showAITutor = ref(false);
const showFloatingButton = ref(false);


// 숙제 관련 상태
const homeworkList = ref([
  {
    id: 1,
    title: '[국어] OX퀴즈 풀기',
    subject: '국어',
    type: '퀴즈',
    completed: false,
    previewImage: 'cat_in_house.png',
    quizData: {
      questions: [
        {
          id: 1,
          image: 'reading_book.png',
          question: '아이가 책을 읽고 있어요',
          answer: true,
          explanation: '그림을 보면 아이가 책을 들고 읽고 있는 모습이에요. 그래서 정답은 O예요.'
        },
        {
          id: 2,
          image: 'writing_pencil.png',
          question: '연필로 그림을 그리고 있어요',
          answer: false,
          explanation: '연필을 사용하고 있지만 글자를 쓰고 있어요. 그림이 아니라서 정답은 X예요.'
        },
        {
          id: 3,
          image: 'packing_bag.png',
          question: '가방에 책을 넣고 있어요',
          answer: true,
          explanation: '학용품을 가방에 정리하고 있는 모습이에요. 책도 들어가고 있어서 정답은 O예요.'
        },
        {
          id: 4,
          image: 'drawing_picture.png',
          question: '연필로 그림을 그리고 있어요',
          answer: true,
          explanation: '연필로 예쁜 그림을 그리고 있어요. 정답은 O예요.'
        },
        {
          id: 5,
          image: 'listening_music.png',
          question: '아이가 음악을 듣고 있어요',
          answer: false,
          explanation: '아이가 책을 읽고 있어요. 음악을 듣는 게 아니라서 정답은 X예요.'
        }
      ]
    }
  },
  {
    id: 2,
    title: '[수학] OX퀴즈 풀기',
    subject: '수학',
    type: '퀴즈',
    completed: false,
    previewImage: 'apples_4.png',
    quizData: {
      questions: [
        {
          id: 1,
          image: 'apples_4.png',
          question: '사과가 5개 있어요',
          answer: false,
          explanation: '사과를 하나씩 세어보면 1, 2, 3, 4개예요. 5개가 아니라서 정답은 X예요.'
        },
        {
          id: 2,
          image: '<꽃 4개 이미지가 들어갈 예정>',
          question: '꽃이 4개 있어요',
          answer: true,
          explanation: '예쁜 꽃을 세어보면 1, 2, 3, 4개가 맞아요. 정답은 O예요.'
        },
        {
          id: 3,
          image: '<별 2개 이미지가 들어갈 예정>',
          question: '별이 3개 있어요',
          answer: false,
          explanation: '반짝이는 별을 세어보면 2개예요. 3개가 아니라서 정답은 X예요.'
        },
        {
          id: 4,
          image: '<연필 5개 이미지>',
          question: '연필이 5개 있어요',
          answer: true,
          explanation: '연필을 하나씩 세어보면 1, 2, 3, 4, 5개로 맞아요. 정답은 O예요.'
        },
        {
          id: 5,
          image: '<공 6개 이미지>',
          question: '공이 4개 있어요',
          answer: false,
          explanation: '둘근 공을 세어보면 6개예요. 4개가 아니라서 정답은 X예요.'
        }
      ]
    }
  },
  {
    id: 3,
    title: '[생활] 안전한 생활이란?',
    subject: '생활',
    type: '단어선택',
    completed: false,
    previewImage: 'quiz-3-snow.png',
    quizData: {
      questions: [
        {
          id: 1,
          image: 'safety_crosswalk.png',
          question: '길을 건널 때 차가 오는지 확인하는 이것은?',
          options: ['좌우 살피기', '빨리 뛰기', '눈 감기'],
          answer: '좌우 살피기',
          explanation: '좌우 살피기 - 길을 건널 때는 차가 오는지 좌우를 잘 살펴봐야 안전해요.'
        },
        {
          id: 2,
          image: 'safety_handwash.png',
          question: '밥 먹기 전에 깨끗하게 하는 이것은?',
          options: ['손 씻기', '양치하기', '머리 빗기'],
          answer: '손 씻기',
          explanation: '손 씻기 - 밥 먹기 전에는 깨끗하게 손을 씻어야 건강해요.'
        },
        {
          id: 3,
          image: 'safety_electricity.png',
          question: '젖은 손으로 절대 만지면 안 되는 이것은?',
          options: ['전기 콘센트', '수건', '비누'],
          answer: '전기 콘센트',
          explanation: '전기 콘센트 - 젖은 손으로 전기를 만지면 매우 위험해요. 절대 하면 안 돼요.'
        },
        {
          id: 4,
          image: 'safety_fire_exit.png',
          question: '불이 났을 때 안전하게 나가는 이곳은?',
          options: ['비상구', '엘리베이터', '창문'],
          answer: '비상구',
          explanation: '비상구 - 불이 나면 당황하지 말고 비상구를 통해 안전하게 대피해야 해요.'
        },
        {
          id: 5,
          image: 'safety_stairs.png',
          question: '계단에서 안전하게 이동하는 방법은?',
          options: ['천천히 걷기', '빨리 뛰기', '한 번에 뛰어내리기'],
          answer: '천천히 걷기',
          explanation: '천천히 걷기 - 계단에서는 뛰지 말고 천천히 걸어야 넘어지지 않아요.'
        }
      ]
    }
  },
  {
    id: 4,
    title: '[금융] 용돈 관리 낱말 연결하기',
    subject: '금융',
    type: '연결',
    completed: false,
    previewImage: 'apples_4.png',
    wordConnectionData: {
      title: '용돈 관리와 관련된 낱말들을 연결해보세요!',
      leftWords: [
        { id: 1, text: '저축', matched: false },
        { id: 2, text: '용돈기입장', matched: false },
        { id: 3, text: '이자', matched: false },
        { id: 4, text: '소비', matched: false },
        { id: 5, text: '예산', matched: false }
      ],
      rightWords: [
        { id: 1, text: '돈을 모아서 쌓아두기', matched: false },
        { id: 2, text: '돈 쓴 내역을 적는 장부', matched: false },
        { id: 3, text: '은행에 맡긴 돈에 붙는 추가 돈', matched: false },
        { id: 4, text: '돈을 주고 물건을 사는 것', matched: false },
        { id: 5, text: '돈 쓸 계획을 미리 세우기', matched: false }
      ],
      correctPairs: [
        { leftId: 1, rightId: 1 },
        { leftId: 2, rightId: 2 },
        { leftId: 3, rightId: 3 },
        { leftId: 4, rightId: 4 },
        { leftId: 5, rightId: 5 }
      ]
    }
  },
  {
    id: 5,
    title: '[국어] 빈칸 채우기',
    subject: '국어',
    type: '빈칸',
    completed: false,
    previewImage: 'cat_in_house.png',
    fillInData: {
      questions: [
        {
          id: 1,
          image: 'cat_in_house.png',
          question: '고양이는 ___에서 살아요.',
          sentence: '고양이는 ___에서 살아요.',
          options: ['집', '바다', '하늘'],
          answer: 0,
          explanation: '고양이는 집에서 사람과 함께 사는 동물이에요.'
        },
        {
          id: 2,
          sentence: '비가 오면 ___을 쓰어요.',
          options: ['모자', '우산', '안경'],
          answer: 1,
          explanation: '비가 오면 우산을 쓰고 다니면 비에 젖지 않아요.'
        },
        {
          id: 3,
          sentence: '오늘은 날씨가 매우 ___.',
          options: ['춥다', '덥다', '시원하다'],
          answer: 1,
          explanation: '여름에는 날씨가 매우 더워요.'
        },
        {
          id: 4,
          sentence: '나는 매일 학교에 ___.',
          options: ['놀아요', '자요', '가요'],
          answer: 2,
          explanation: '학생들은 매일 학교에 가서 공부해요.'
        },
        {
          id: 5,
          sentence: '밤에는 ___이 빛나요.',
          options: ['해', '별', '구름'],
          answer: 1,
          explanation: '밤하늘에는 많은 별들이 반짝반짝 빛나요.'
        }
      ]
    }
  },
  {
    id: 6,
    title: '[수학] 숫자 세기 OX퀴즈',
    subject: '수학',
    type: '퀴즈',
    completed: true,
    previewImage: 'apples_4.png',
    lastResult: {
      correct: 4,
      total: 5,
      answers: [
        {
          questionIndex: 0,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '사과가 4개 있어요' },
          explanation: '사과를 하나씩 세어보면 1, 2, 3, 4개가 맞아요. 정답은 O예요.'
        },
        {
          questionIndex: 1,
          userAnswer: false,
          correctAnswer: true,
          isCorrect: false,
          question: { question: '꽃이 4개 있어요' },
          explanation: '예쁜 꽃을 세어보면 1, 2, 3, 4개가 맞아요. 정답은 O예요.'
        },
        {
          questionIndex: 2,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '별이 3개 있어요' },
          explanation: '반짝이는 별을 세어보면 2개예요. 3개가 아니라서 정답은 X예요.'
        },
        {
          questionIndex: 3,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '연필이 5개 있어요' },
          explanation: '연필을 하나씩 세어보면 1, 2, 3, 4, 5개로 맞아요. 정답은 O예요.'
        },
        {
          questionIndex: 4,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '공이 4개 있어요' },
          explanation: '둥근 공을 세어보면 6개예요. 4개가 아니라서 정답은 X예요.'
        }
      ]
    }
  },
  {
    id: 7,
    title: '[생활] 건강한 습관 OX퀴즈',
    subject: '생활',
    type: '퀴즈',
    completed: true,
    lastResult: {
      correct: 5,
      total: 5,
      answers: [
        {
          questionIndex: 0,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '하루에 8시간은 잠을 자야 해요' },
          explanation: '충분한 잠은 건강에 아주 중요해요. 정답은 O예요.'
        },
        {
          questionIndex: 1,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '매일 양치질을 해야 해요' },
          explanation: '치아 건강을 위해 매일 양치질은 꼭 필요해요. 정답은 O예요.'
        },
        {
          questionIndex: 2,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '과자만 먹어도 괜찮아요' },
          explanation: '균형 잡힌 식사가 중요해요. 과자만 먹으면 안 돼요. 정답은 X예요.'
        },
        {
          questionIndex: 3,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '운동을 하면 건강해져요' },
          explanation: '규칙적인 운동은 몸과 마음을 건강하게 해줘요. 정답은 O예요.'
        },
        {
          questionIndex: 4,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '하루 종일 게임만 해도 돼요' },
          explanation: '적당한 휴식과 다양한 활동이 필요해요. 정답은 X예요.'
        }
      ]
    }
  },
  {
    id: 8,
    title: '[국어] 낱말 연결 퀴즈',
    subject: '국어',
    type: '퀴즈',
    completed: true,
    lastResult: {
      correct: 3,
      total: 5,
      answers: [
        {
          questionIndex: 0,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '사과는 과일이에요' },
          explanation: '사과는 맛있는 과일이 맞아요. 정답은 O예요.'
        },
        {
          questionIndex: 1,
          userAnswer: false,
          correctAnswer: true,
          isCorrect: false,
          question: { question: '고양이는 동물이에요' },
          explanation: '고양이는 동물이 맞아요. 정답은 O예요.'
        },
        {
          questionIndex: 2,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '책으로 공부해요' },
          explanation: '책은 공부하는 도구예요. 정답은 O예요.'
        },
        {
          questionIndex: 3,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '물고기가 하늘을 날아요' },
          explanation: '물고기는 바다에서 살아요. 하늘을 날지 않아요. 정답은 X예요.'
        },
        {
          questionIndex: 4,
          userAnswer: true,
          correctAnswer: false,
          isCorrect: false,
          question: { question: '달이 네모예요' },
          explanation: '달은 둥글어요. 네모가 아니에요. 정답은 X예요.'
        }
      ]
    }
  },
  {
    id: 9,
    title: '[생활] 교통안전 OX퀴즈',
    subject: '생활',
    type: '퀴즈',
    completed: true,
    lastResult: {
      correct: 5,
      total: 5,
      answers: [
        {
          questionIndex: 0,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '횡단보도에서 신호를 지켜요' },
          explanation: '횡단보도에서는 꼭 신호를 지켜야 안전해요. 정답은 O예요.'
        },
        {
          questionIndex: 1,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '차 앞에서 갑자기 뛰어나와도 돼요' },
          explanation: '차 앞에서 갑자기 뛰어나오면 매우 위험해요. 정답은 X예요.'
        },
        {
          questionIndex: 2,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '안전벨트를 매야 해요' },
          explanation: '차에 탈 때는 반드시 안전벨트를 매야 해요. 정답은 O예요.'
        },
        {
          questionIndex: 3,
          userAnswer: true,
          correctAnswer: true,
          isCorrect: true,
          question: { question: '자전거 탈 때 헬멧을 써야 해요' },
          explanation: '자전거를 탈 때는 안전을 위해 헬멧을 써야 해요. 정답은 O예요.'
        },
        {
          questionIndex: 4,
          userAnswer: false,
          correctAnswer: false,
          isCorrect: true,
          question: { question: '길에서 뛰어다녀도 괜찮아요' },
          explanation: '길에서 뛰어다니면 넘어지거나 사고가 날 수 있어요. 정답은 X예요.'
        }
      ]
    }
  }
]);


// 에러 상태
const showError = ref(false);
const errorInfo = ref({});

// 퀴즈 결과 모달 상태
const showQuizResult = ref(false);
const selectedCompletedQuiz = ref(null);

onMounted(async () => {
  console.log('🚀 StudentMainPage mounted');
  console.log('👤 Current user:', authStore.currentUser);
  console.log('🔒 Is logged in:', authStore.isLoggedIn);
  
  startAnimations();
  
  // 페이지 로드 후 플로팅 버튼 바로 표시
  setTimeout(() => {
    showFloatingButton.value = true;
  }, 1500); // 애니메이션 후 플로팅 버튼 표시
  
  // 쿼리 파라미터로 퀴즈 자동 시작 처리
  const route = router.currentRoute.value;
  if (route.query.startQuiz) {
    const subject = route.query.startQuiz as string;
    const quiz = homeworkList.value.find(hw => 
      hw.subject === subject && !hw.completed && hw.type === '퀴즈'
    );
    if (quiz) {
      setTimeout(() => {
        startHomework(quiz);
      }, 1000); // 애니메이션 후 시작
    }
    // 쿼리 파라미터 제거
    router.replace({ name: 'student' });
  }
});

const startAnimations = () => {
  setTimeout(() => showHeader.value = true, 200);
  setTimeout(() => showQuestionSection.value = true, 600);
  setTimeout(() => showHomeworkSection.value = true, 800);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/user-selection');
};

// AI 튜터 관련 함수들
const openAITutor = () => {
  showAITutor.value = true;
  showFloatingButton.value = false;
};

const closeAITutor = () => {
  showAITutor.value = false;
  // 플로팅 버튼을 즉시 다시 표시
  showFloatingButton.value = true;
};


// 숙제 관련 함수들
const getHomeworkTypeIcon = (type: string) => {
  const icons = {
    '퀴즈': '📝',
    '글쓰기': '✍️',
    '계산': '🔢',
    '연결': '🔗',
    '읽기': '📖'
  };
  return icons[type] || '📚';
};

// 낱말 연결 게임 상태
const showWordGame = ref(false);
const currentGameData = ref(null);

const startHomework = (homework: any) => {
  if (homework.completed) return;
  
  // 생활 단어 맞히기는 준비 중
  if (homework.id === 3 && homework.type === '단어선택') {
    showErrorModal('🚧 준비 중', '생활 단어 맞히기는 아직 준비 중입니다.\n곧 만나보실 수 있어요! 🚀', 'info');
    return;
  }
  
  if (homework.type === '퀴즈' && homework.quizData) {
    // 새로운 퀴즈 시스템으로 퀴즈 데이터를 quizStore에 설정
    quizStore.setCustomQuizData(homework.quizData);
    // 퀴즈 완료 시 콜백 설정
    quizStore.onQuizComplete = (result: any) => {
      // 퀴즈 완료 처리
      const homeworkIndex = homeworkList.value.findIndex(h => h.id === homework.id);
      if (homeworkIndex !== -1) {
        homeworkList.value[homeworkIndex].completed = true;
        homeworkList.value[homeworkIndex].lastResult = {
          correct: result.correctAnswers,
          total: result.totalQuestions,
          answers: result.answers
        };
      }
    };
    router.push('/quiz');
  } else if (homework.type === '계산') {
    // 계산 문제 풀이 페이지로 이동 (추후 구현)
    showErrorModal('준비 중', '계산 문제 풀이 페이지를 준비 중입니다. 곧 만나보실 수 있어요!', 'info');
  } else if (homework.type === '빈칸' && homework.fillInData) {
    // 빈칸 채우기 퀴즈 시작
    quizStore.setCustomQuizData(homework.fillInData);
    quizStore.onQuizComplete = (result: any) => {
      const homeworkIndex = homeworkList.value.findIndex(h => h.id === homework.id);
      if (homeworkIndex !== -1) {
        homeworkList.value[homeworkIndex].completed = true;
        homeworkList.value[homeworkIndex].lastResult = {
          correct: result.correctAnswers,
          total: result.totalQuestions,
          answers: result.answers
        };
      }
    };
    router.push('/quiz');
  } else if (homework.type === '연결' && homework.wordConnectionData) {
    // 낱말 연결 게임을 퀴즈 시스템으로 통합
    const connectionQuizData = {
      questions: [{
        id: 1,
        type: '연결',
        question: homework.wordConnectionData.title,
        wordConnectionData: homework.wordConnectionData,
        answer: true, // 연결 게임 완료시 정답으로 처리
        explanation: '모든 낱말을 올바르게 연결했습니다!'
      }]
    };
    
    quizStore.setCustomQuizData(connectionQuizData);
    quizStore.onQuizComplete = (result: any) => {
      const homeworkIndex = homeworkList.value.findIndex(h => h.id === homework.id);
      if (homeworkIndex !== -1) {
        homeworkList.value[homeworkIndex].completed = true;
        homeworkList.value[homeworkIndex].lastResult = {
          correct: result.correctAnswers,
          total: result.totalQuestions,
          answers: result.answers
        };
      }
    };
    router.push('/quiz');
  } else {
    // 다른 타입의 숙제는 추후 구현
    showErrorModal('준비 중', `${homework.type} 숙제 기능은 준비 중입니다.`, 'info');
  }
};

const closeWordGame = () => {
  showWordGame.value = false;
  currentGameData.value = null;
};

// 숙제 목록 정렬 (완료되지 않은 것이 먼저, 완료된 것이 나중에)
const sortedHomeworkList = computed(() => {
  return [...homeworkList.value].sort((a, b) => {
    if (a.completed === b.completed) {
      return a.id - b.id; // 같은 상태면 ID 순서로
    }
    return a.completed ? 1 : -1; // 완료되지 않은 것이 먼저
  });
});

// 완료된 퀴즈 관련 함수들
const completedHomework = computed(() => {
  return homeworkList.value.filter(homework => homework.completed);
});

const pendingHomework = computed(() => {
  return homeworkList.value.filter(homework => !homework.completed);
});


const viewCompletedQuiz = (homework: any) => {
  selectedCompletedQuiz.value = homework;
  showQuizResult.value = true;
};

const closeQuizResult = () => {
  showQuizResult.value = false;
  selectedCompletedQuiz.value = null;
};

const getScoreClass = (result: any) => {
  const percentage = (result.correct / result.total) * 100;
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  return 'needs-practice';
};

const getScoreLabel = (result: any) => {
  const percentage = (result.correct / result.total) * 100;
  if (percentage >= 80) return '정말 잘했어요!';
  if (percentage >= 60) return '잘했어요!';
  return '다음에 더 잘할 수 있어요!';
};

const showErrorModal = (title: string, message: string, type = 'error') => {
  errorInfo.value = { title, message, type };
  showError.value = true;
};

const getFloatingStyle = (index: number) => {
  const size = Math.random() * 6 + 3;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 15;
  const duration = Math.random() * 8 + 12;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};
</script>

<style scoped>
.student-main-page {
  min-height: 100vh;
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
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
  background: rgba(74, 144, 226, 0.1);
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.25rem 2rem;
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
  padding: 5rem 2rem 2rem 2rem;
}

/* 퀴즈 블럭 섹션 */
.quiz-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
}

/* 카드 공통 스타일 */
.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  color: #4a90e2;
  background: rgba(74, 144, 226, 0.1);
  animation: icon-float 3s ease-in-out infinite;
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


/* 숙제 섹션 */
.homework-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.homework-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.homework-card {
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
  border: 1px solid #86EFAC;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.homework-icon {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.homework-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.homework-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.homework-list::-webkit-scrollbar {
  width: 6px;
}

.homework-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.homework-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.homework-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.homework-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.3s ease;
}

.homework-item:hover {
  border-color: #10B981;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
}

.homework-item.completed {
  background: #F0FDF4;
  border-color: #BBF7D0;
  cursor: default;
}

.homework-item.completed:hover {
  transform: none;
  box-shadow: none;
}

.homework-status {
  flex-shrink: 0;
}

.status-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-icon.completed {
  background: #10B981;
  color: white;
}

.status-circle {
  width: 20px;
  height: 20px;
  border: 3px solid #E5E7EB;
  border-radius: 50%;
}

.homework-info {
  flex: 1;
}

.homework-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.25rem 0;
}

.homework-description {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.homework-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.homework-type {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #4B5563;
  font-weight: 500;
}

.type-icon {
  font-size: 1rem;
}

.homework-difficulty {
  color: #6B7280;
}

.homework-action {
  flex-shrink: 0;
}

.start-button {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.completed-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #DCFCE7;
  color: #059669;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}

.no-homework {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  border: 2px dashed #E5E7EB;
}

.no-homework-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-homework h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.no-homework p {
  font-size: 0.95rem;
  color: #6B7280;
  margin: 0;
}

/* 퀴즈 블럭 스타일 */
.quiz-section-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.quiz-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.quiz-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 70px;
}

.quiz-item:hover {
  border-color: #4A90E2;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.15);
}

.quiz-item.completed {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

.quiz-item.completed:hover {
  border-color: #10B981;
}

.quiz-status {
  flex-shrink: 0;
}

.quiz-preview {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.quiz-item:hover .quiz-preview-image {
  transform: scale(1.1);
}

.status-circle {
  width: 24px;
  height: 24px;
  border: 3px solid #E5E7EB;
  border-radius: 50%;
}

.status-circle.pending {
  border-color: #4A90E2;
}

.status-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-icon.completed {
  background: #10B981;
  color: white;
}

.quiz-info {
  flex: 1;
}

.quiz-title-with-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.quiz-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
  flex: 1;
}

.quiz-score {
  font-size: 0.9rem;
  font-weight: 600;
  color: #10B981;
  background: #F0FDF4;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid #BBF7D0;
}

.quiz-arrow {
  flex-shrink: 0;
  color: #9CA3AF;
  transition: all 0.3s ease;
}

.quiz-item:hover .quiz-arrow {
  color: #4A90E2;
  transform: translateX(2px);
}

.no-quizzes {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 16px;
  border: 2px dashed #E5E7EB;
}

.no-quizzes-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-quizzes h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.5rem 0;
}

.no-quizzes p {
  font-size: 0.95rem;
  color: #6B7280;
  margin: 0;
}

/* 완료된 퀴즈와 진행할 퀴즈 섹션을 동일한 높이로 */
.pending-quizzes-section,
.completed-quizzes-section {
  display: flex;
  flex-direction: column;
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

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .main-content {
    padding: 5rem 1rem 1rem 1rem;
  }

  .quiz-sections {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .header-grid {
    padding: 0 1rem;
  }

  .quiz-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .quiz-preview {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-subtitle {
    font-size: 0.8rem;
  }


  .quiz-title {
    font-size: 1rem;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .page-header,
  .quiz-section-card,
  .quiz-item,
  .floating-ai-button {
    transition: none;
  }
  
  .floating-element,
  .floating-pulse,
  .ai-avatar {
    animation: none;
  }
}

/* 게임 모달 스타일 */
.game-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.game-modal {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.game-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.game-modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.game-modal-content {
  padding: 2rem;
  max-height: calc(90vh - 100px);
  overflow-y: auto;
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .quiz-section-card {
    border: 2px solid #000000;
  }
}


/* 퀴즈 결과 모달 */
.quiz-result-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.quiz-result-modal {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.quiz-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.quiz-result-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.quiz-result-content {
  padding: 2rem;
  max-height: calc(80vh - 100px);
  overflow-y: auto;
}

.result-summary {
  text-align: center;
  margin-bottom: 2rem;
}

.result-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8px solid;
  position: relative;
}

.score-circle.excellent {
  border-color: #10B981;
  background: #F0FDF4;
}

.score-circle.good {
  border-color: #3B82F6;
  background: #EFF6FF;
}

.score-circle.needs-practice {
  border-color: #F59E0B;
  background: #FFFBEB;
}

.score-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
}

.score-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
}

.question-results {
  margin-top: 2rem;
}

.question-results h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 1rem 0;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #F9FAFB;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

.question-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4A90E2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.question-content {
  flex: 1;
}

.question-text {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.question-explanation {
  font-size: 0.875rem;
  color: #6B7280;
  line-height: 1.4;
}

.question-result {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.question-result.correct {
  background: #10B981;
  color: white;
}

.question-result.incorrect {
  background: #EF4444;
  color: white;
}

/* 플로팅 AI 튜터 버튼 */
.floating-ai-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-ai-button.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.floating-button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  animation: floating-pulse 3s ease-in-out infinite;
  border: 3px solid white;
  overflow: hidden;
}

.ai-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.floating-ai-button:hover .ai-avatar {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
}

@keyframes floating-pulse {
  0%, 100% {
    transform: translateY(0);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.5);
  }
}

.floating-tooltip {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.floating-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.8);
}

.floating-ai-button:hover .floating-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(-10px);
}

/* 퀴즈 블럭 스타일 아이콘 */
.pending-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
}

.completed-icon {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

/* 플로팅 버튼 반응형 */
@media (max-width: 768px) {
  .floating-ai-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .ai-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .ai-avatar-image {
    width: 100%;
    height: 100%;
  }
  
  .floating-tooltip {
    right: 70px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .floating-ai-button {
    bottom: 1rem;
    right: 1rem;
  }
  
  .floating-tooltip {
    display: none; /* 모바일에서는 툴팁 숨김 */
  }
}

@media (max-width: 768px) {
  .game-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .game-modal-header {
    padding: 1rem 1.5rem;
  }
  
  .game-modal-content {
    padding: 1.5rem;
  }
  
  
  .quiz-result-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .quiz-result-header {
    padding: 1rem 1.5rem;
  }
  
  .quiz-result-content {
    padding: 1.5rem;
  }
  
  .question-result-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .question-result {
    align-self: flex-start;
  }
}
</style>