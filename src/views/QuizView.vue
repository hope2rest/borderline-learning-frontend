<template>
  <div class="quiz-page">
    <!-- 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 15" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>
    
    <!-- 퀴즈 진행 중 -->
    <div v-if="quizStore.isGameActive && !quizStore.showExplanation && !showResult" class="quiz-container" :class="{ 'animate-in': showQuiz }">
      
      <!-- 헤더 -->
      <header class="quiz-header">
        <div class="unified-header-bar">
          <div class="header-left" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>뒤로가기</span>
          </div>
          <div class="header-center">
            <div class="quiz-progress">문제 {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.totalQuizzes }}</div>
          </div>
          <div class="header-right">
            <div class="timer-display">{{ formatTime(currentTime) }}</div>
          </div>
        </div>
      </header>

      <!-- 진행 표시기 -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">{{ Math.round(progressPercentage) }}% 완료</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>

      <!-- 퀴즈 카드 -->
      <div class="quiz-card">
        <div v-if="quizStore.currentQuiz" class="quiz-content">
          
          <!-- 문제 이미지 (연결 게임이 아닐 때만) -->
          <div v-if="quizStore.currentQuiz.type !== '연결'" class="question-image-container">
            <div v-if="quizStore.currentQuiz.image && quizStore.currentQuiz.image !== '이미지 설명'" class="quiz-image">
              <img :src="`/images/${quizStore.currentQuiz.image}`" :alt="quizStore.currentQuiz.question" />
            </div>
            <div v-else class="image-placeholder">
              {{ quizStore.currentQuiz.image || '이미지 설명' }}
            </div>
          </div>

          <!-- 문제 제목 (연결 게임이 아닐 때만) -->
          <div v-if="quizStore.currentQuiz.type !== '연결'" class="question-section">
            <h2 class="question-title">
              {{ quizStore.currentQuiz.question }}
            </h2>
            <p class="question-subtitle">
              {{ 
                quizStore.currentQuiz.options ? '알맞은 단어를 골라봐!' : '그림을 보고 맞는지 틀린지 골라봐!' 
              }}
            </p>
          </div>

          <!-- 낱말 연결하기 게임 (연결 퀴즈일 때) -->
          <WordConnectionGame v-if="quizStore.currentQuiz.type === '연결'" />

          <!-- OX 선택지 (OX 퀴즈일 때) -->
          <div v-else-if="!quizStore.currentQuiz.options" class="ox-options-container">
            <!-- O 버튼 -->
            <button
              @click="selectAnswer(true)"
              class="ox-option-button ox-true-button"
              :class="{ 'ox-hover': hoveredOption === 'o' }"
              @mouseenter="hoveredOption = 'o'"
              @mouseleave="hoveredOption = null"
            >
              <div class="ox-symbol">O</div>
              <div class="ox-label">맞아!</div>
            </button>
            
            <!-- X 버튼 -->
            <button
              @click="selectAnswer(false)"
              class="ox-option-button ox-false-button"
              :class="{ 'ox-hover': hoveredOption === 'x' }"
              @mouseenter="hoveredOption = 'x'"
              @mouseleave="hoveredOption = null"
            >
              <div class="ox-symbol">X</div>
              <div class="ox-label">틀려!</div>
            </button>
          </div>

          <!-- 단어 선택지 (단어 선택 퀴즈일 때) -->
          <div v-else class="word-options-container">
            <button
              v-for="(option, index) in quizStore.currentQuiz.options"
              :key="index"
              @click="selectWordAnswer(option)"
              class="word-option-button"
              :class="{ 'word-hover': hoveredOption === index }"
              @mouseenter="hoveredOption = index"
              @mouseleave="hoveredOption = null"
            >
              <div class="word-text">{{ option }}</div>
            </button>
          </div>
          
        </div>
      </div>
    </div>

    <!-- 해설 화면 -->
    <div v-if="quizStore.showExplanation" class="explanation-container" :class="{ 'animate-in': quizStore.showExplanation }">
      <div class="explanation-card">
        <div class="explanation-header">
          <div class="result-icon" :class="{ 'correct': quizStore.currentAnswer?.isCorrect, 'incorrect': !quizStore.currentAnswer?.isCorrect }">
            {{ quizStore.currentAnswer?.isCorrect ? '🎉' : '💪' }}
          </div>
          <h2 class="result-title">
            {{ quizStore.currentAnswer?.isCorrect ? '정답!' : '아쉬워!' }}
          </h2>
          <p class="result-subtitle">
            {{ quizStore.currentAnswer?.isCorrect ? '잘했어!' : '다음엔 맞출 수 있을 거야!' }}
          </p>
        </div>

        <div class="explanation-content">
          <h3>해설</h3>
          <p class="explanation-text">{{ quizStore.currentAnswer?.question.explanation }}</p>
        </div>

        <div class="explanation-actions">
          <button @click="nextQuestion" class="next-button">
            {{ isLastQuestion ? '결과 보기' : '다음 문제' }}
            <svg v-if="!isLastQuestion" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 결과 화면 -->
    <div v-if="showResult" class="result-container" :class="{ 'animate-in': showResult }">
      <div class="result-card">
        <!-- 결과 헤더 -->
        <div class="result-header">
          <div class="result-emoji">
            {{ quizStore.correctAnswers >= 2 ? '🎉' : '💪' }}
          </div>
          <h2 class="result-title">
            {{ quizStore.correctAnswers >= 2 ? '잘했어!' : '괜찮아!' }}
          </h2>
          <p class="result-subtitle">퀴즈를 모두 풀었어!</p>
          
          <!-- 성취 배지 -->
          <div class="achievement-badge" :class="getAchievementClass()">
            <div class="badge-icon">{{ getAchievementIcon() }}</div>
            <div class="badge-text">{{ getAchievementText() }}</div>
          </div>
        </div>

        <!-- 해설 모음 -->
        <div class="explanations-summary">
          <h3 class="explanations-title">해설 모음</h3>
          <div class="explanations-list">
            <div v-for="(answer, index) in quizStore.answers" :key="index" class="explanation-item">
              <div class="explanation-question">
                <strong>문제 {{ index + 1 }}:</strong> {{ answer.question?.question }}
              </div>
              <div class="explanation-answer">
                <strong>해설:</strong> {{ answer.explanation }}
              </div>
            </div>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="result-actions">
          <button @click="goToDashboard" class="action-button primary">
            <div class="button-icon">⬅️</div>
            <span>뒤로가기</span>
          </button>
        </div>

        <!-- 추천 문제 -->
        <div class="recommended-section">
          <h3 class="recommended-title">더 재미있는 도전이 기다려!</h3>
          <p class="recommended-subtitle">새로운 퀴즈로 실력을 키워봐!</p>
          <div class="recommended-buttons">
            <button @click="goToRecommended('수학')" class="recommended-button">🔢 수학 퍼즐 도전하기</button>
            <button @click="goToRecommended('영어')" class="recommended-button">🗣️ 영어 단어 맞히기</button>
            <button @click="goToRecommended('금융')" class="recommended-button">💰 용돈 관리 퀴즈</button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 튜터 플로팅 버튼 -->
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
      :userName="'학습자'"
      @close="closeAITutor"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz.js'
import { useHistoryStore } from '../stores/history.js'
import { useAuthStore } from '../stores/auth.js'
import AITutorModal from '../components/AITutorModal.vue'
import WordConnectionGame from '../components/WordConnectionGame.vue'

const router = useRouter()
const quizStore = useQuizStore()
const historyStore = useHistoryStore()
const authStore = useAuthStore()

// 애니메이션 상태
const showQuiz = ref(false)
const showResult = ref(false)

// AI 튜터 상태
const showAITutor = ref(false)
const showFloatingButton = ref(false)

// 인터랙션 상태
const hoveredOption = ref(null)

// 게임 상태
const currentTime = ref(0)
let gameTimer = null

const progressPercentage = computed(() => {
  return ((quizStore.currentQuestionIndex + 1) / quizStore.totalQuizzes) * 100
})

const isLastQuestion = computed(() => {
  return quizStore.currentQuestionIndex >= quizStore.totalQuizzes - 1
})

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function selectAnswer(answer) {
  quizStore.submitCustomAnswer(answer)
}

function selectWordAnswer(selectedWord) {
  quizStore.submitCustomAnswer(selectedWord)
}

function nextQuestion() {
  quizStore.goToNextQuestion()
  
  if (!quizStore.isGameActive) {
    // 게임 종료
    clearInterval(gameTimer)
    showResult.value = true
    
    // 히스토리에 기록 추가
    historyStore.addQuizRecord({
      correctAnswers: quizStore.correctAnswers,
      totalQuestions: quizStore.totalQuizzes,
      timeSpent: currentTime.value,
      hintUsed: false,
      details: quizStore.answers
    })
  }
}

function playAgain() {
  showResult.value = false
  quizStore.restartCustomQuiz()
  currentTime.value = 0
  startTimer()
}

function goToDashboard() {
  quizStore.endCustomQuiz()
  router.push('/student')
}

function goBack() {
  quizStore.endCustomQuiz()
  router.push('/student')
}

function goToRecommended(subject) {
  // 해당 과목의 퀴즈를 찾아서 시작
  quizStore.endCustomQuiz()
  router.push({ name: 'student', query: { startQuiz: subject } })
}

function getAchievementClass() {
  if (quizStore.correctAnswers === quizStore.totalQuizzes) return 'perfect'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.7)) return 'excellent'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.5)) return 'good'
  return 'keep-trying'
}

function getAchievementIcon() {
  if (quizStore.correctAnswers === quizStore.totalQuizzes) return '🏆'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.7)) return '🌟'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.5)) return '👍'
  return '💪'
}

function getAchievementText() {
  if (quizStore.correctAnswers === quizStore.totalQuizzes) return '완벽해!'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.7)) return '훌륭해!'
  if (quizStore.correctAnswers >= Math.ceil(quizStore.totalQuizzes * 0.5)) return '잘했어!'
  return '화이팅!'
}

function startTimer() {
  gameTimer = setInterval(() => {
    currentTime.value++
  }, 1000)
}

function getFloatingStyle(index) {
  const size = Math.random() * 6 + 3
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 15
  const duration = Math.random() * 8 + 12
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// AI 튜터 관련 함수들
function openAITutor() {
  showAITutor.value = true
  showFloatingButton.value = false
}

function closeAITutor() {
  showAITutor.value = false
  showFloatingButton.value = true
}

onMounted(() => {
  // 커스텀 퀴즈 데이터가 없으면 메인으로 리다이렉트
  if (!quizStore.customQuizData) {
    router.push('/student')
    return
  }
  
  showQuiz.value = true
  startTimer()
  
  // 플로팅 버튼을 1초 후에 표시
  setTimeout(() => {
    showFloatingButton.value = true
  }, 1000)
})

onUnmounted(() => {
  if (gameTimer) {
    clearInterval(gameTimer)
  }
})
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
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

/* 퀴즈 컨테이너 */
.quiz-container,
.explanation-container,
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.quiz-container.animate-in,
.explanation-container.animate-in,
.result-container.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 헤더 */
.quiz-header {
  margin-bottom: 2rem;
}

.unified-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #374151;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.header-left:hover {
  background: #f9fafb;
  color: #1f2937;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.quiz-progress {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  background: #f0f9ff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0f2fe;
}

.header-right {
  display: flex;
  align-items: center;
}

.timer-display {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  min-width: 60px;
  text-align: center;
}

/* 진행 표시기 */
.progress-section {
  margin-bottom: 2rem;
}

.progress-info {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-weight: 600;
  color: #374151;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a90e2 0%, #357abd 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 퀴즈 카드 */
.quiz-card,
.explanation-card,
.result-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.quiz-content {
  text-align: center;
}

.question-image-container {
  margin-bottom: 2rem;
}

.quiz-image {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
}

.quiz-image img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 12px;
}

.image-placeholder {
  width: 100%;
  min-height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #6b7280;
  border: 2px dashed #d1d5db;
  padding: 2rem;
  text-align: center;
  line-height: 1.5;
}

.question-section {
  margin-bottom: 2rem;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.question-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* OX 버튼 */
.ox-options-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.ox-option-button {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
}

.ox-true-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.ox-false-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.ox-option-button:hover,
.ox-option-button.ox-hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.ox-symbol {
  font-size: 3rem;
  font-weight: 900;
}

.ox-label {
  font-size: 1rem;
  font-weight: 600;
}

/* 단어 선택 버튼 */
.word-options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.word-option-button {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  text-align: center;
}

.word-option-button:hover,
.word-option-button.word-hover {
  border-color: #4a90e2;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
}

.word-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

/* 해설 화면 */
.explanation-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.result-icon.correct {
  animation: bounce 0.6s ease-in-out;
}

.result-icon.incorrect {
  animation: shake 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 60%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  80% { transform: translateY(-5px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.result-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.result-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
}

.explanation-content {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.explanation-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.explanation-text {
  font-size: 1.1rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.explanation-actions {
  text-align: center;
}

.next-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.3);
}

/* 결과 화면 */
.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
}

.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  margin-top: 1rem;
  font-weight: 600;
}

.achievement-badge.perfect {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.achievement-badge.excellent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.achievement-badge.good {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.achievement-badge.keep-trying {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-text {
  font-size: 1.1rem;
}


/* 해설 모음 */
.explanations-summary {
  margin-bottom: 2rem;
}

.explanations-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.explanations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explanation-item {
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.explanation-question {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.explanation-answer {
  color: #374151;
  line-height: 1.5;
}

/* 액션 버튼 */
.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.action-button.primary {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
}

.action-button.secondary {
  background: #f3f4f6;
  color: #374151;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.button-icon {
  font-size: 1.25rem;
}

/* 추천 문제 */
.recommended-section {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
}

.recommended-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.recommended-subtitle {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.recommended-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.recommended-button {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.recommended-button:hover {
  border-color: #4a90e2;
  background: #eff6ff;
  transform: translateY(-2px);
}

/* 반응형 */
@media (max-width: 768px) {
  .quiz-container,
  .explanation-container,
  .result-container {
    padding: 1rem;
  }

  .unified-header-bar {
    padding: 0.75rem 1rem;
    flex-direction: row;
    gap: 0.5rem;
  }

  .header-left span {
    display: none;
  }

  .quiz-progress {
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
  }

  .timer-display {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    min-width: 50px;
  }

  .ox-options-container {
    gap: 1rem;
  }

  .ox-option-button {
    width: 100px;
    height: 100px;
  }

  .ox-symbol {
    font-size: 2.5rem;
  }

  .result-actions {
    flex-direction: column;
  }

  .recommended-buttons {
    flex-direction: column;
  }

  .word-options-container {
    max-width: 100%;
  }

  .word-option-button {
    padding: 0.875rem 1rem;
  }

  .word-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .question-title {
    font-size: 1.25rem;
  }

  .ox-option-button {
    width: 80px;
    height: 80px;
  }

  .ox-symbol {
    font-size: 2rem;
  }

  .ox-label {
    font-size: 0.875rem;
  }

  .result-title {
    font-size: 1.5rem;
  }
}

/* AI 튜터 플로팅 버튼 */
.floating-ai-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.floating-ai-button.animate-in {
  opacity: 1;
  transform: translateY(0);
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
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
}

.ai-avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(74, 144, 226, 0.4);
}

.ai-avatar-image {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
}

.floating-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.floating-ai-button:hover .floating-tooltip {
  opacity: 1;
}

/* 반응형 - 플로팅 버튼 */
@media (max-width: 768px) {
  .floating-ai-button {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .ai-avatar {
    width: 50px;
    height: 50px;
  }
  
  .ai-avatar-image {
    width: 35px;
    height: 35px;
  }
  
  .floating-tooltip {
    display: none;
  }
}
</style>