<template>
  <div v-if="quizStore.currentQuiz && quizStore.currentQuiz.type === '연결'" class="word-connection-container">
    <!-- 게임 제목 -->
    <div class="game-title-section">
      <h2 class="game-title">{{ quizStore.currentQuiz.wordConnectionData.title }}</h2>
      <p class="game-subtitle">왼쪽 단어와 오른쪽 설명을 선으로 연결해봐!</p>
    </div>

    <!-- 연결 게임 영역 -->
    <div class="connection-game-area">
      <!-- 왼쪽 단어들 -->
      <div class="left-words-column">
        <div 
          v-for="(word, index) in leftWords" 
          :key="word.id"
          :ref="el => setLeftWordRef(el, index)"
          class="word-item left-word"
          :class="{ 
            'selected': selectedLeftWord?.id === word.id,
            'matched': word.matched,
            'connecting': isConnecting && selectedLeftWord?.id === word.id
          }"
          @click="selectLeftWord(word, index)"
        >
          <div class="word-text">{{ word.text }}</div>
          <div v-if="word.matched" class="match-indicator">✓</div>
        </div>
      </div>

      <!-- SVG 연결선 캔버스 -->
      <div class="connection-canvas-container" ref="canvasContainer">
        <svg class="connection-canvas" ref="connectionCanvas" :width="canvasWidth" :height="canvasHeight">
          <!-- 완성된 연결선들 -->
          <line
            v-for="connection in completedConnections"
            :key="`${connection.leftId}-${connection.rightId}`"
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            class="connection-line completed"
          />
          
          <!-- 현재 그리고 있는 연결선 -->
          <line
            v-if="currentConnectionLine"
            :x1="currentConnectionLine.x1"
            :y1="currentConnectionLine.y1"
            :x2="currentConnectionLine.x2"
            :y2="currentConnectionLine.y2"
            class="connection-line current"
          />
        </svg>
      </div>

      <!-- 오른쪽 설명들 -->
      <div class="right-words-column">
        <div 
          v-for="(word, index) in rightWords" 
          :key="word.id"
          :ref="el => setRightWordRef(el, index)"
          class="word-item right-word"
          :class="{ 
            'selected': selectedRightWord?.id === word.id,
            'matched': word.matched,
            'hover-target': isConnecting && selectedLeftWord && !word.matched
          }"
          @click="selectRightWord(word, index)"
          @mouseenter="onRightWordHover(word, index)"
          @mouseleave="onRightWordLeave()"
        >
          <div v-if="word.matched" class="match-indicator">✓</div>
          <div class="word-text">{{ word.text }}</div>
        </div>
      </div>
    </div>

    <!-- 진행 상황 -->
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-text">{{ matchedCount }} / {{ totalPairs }} 연결 완료</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- 완료 버튼 -->
    <div v-if="allMatched" class="completion-section">
      <div class="completion-message">
        <div class="completion-icon">🎉</div>
        <h3 class="completion-title">모든 연결 완료!</h3>
        <p class="completion-subtitle">정말 잘했어!</p>
      </div>
      <button @click="completeGame" class="complete-button">
        결과 보기
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuizStore } from '../stores/quiz.js'

const quizStore = useQuizStore()

// 게임 상태
const leftWords = ref([])
const rightWords = ref([])
const selectedLeftWord = ref(null)
const selectedLeftIndex = ref(-1)
const selectedRightWord = ref(null)
const selectedRightIndex = ref(-1)
const isConnecting = ref(false)
const completedConnections = ref([])
const currentConnectionLine = ref(null)
const connectionCanvas = ref(null)
const canvasContainer = ref(null)
const canvasWidth = ref(100)
const canvasHeight = ref(400)

// DOM 참조
const leftWordRefs = ref([])
const rightWordRefs = ref([])

// 마우스 추적
let mouseX = 0
let mouseY = 0

// 계산된 속성들
const matchedCount = computed(() => leftWords.value.filter(word => word.matched).length)
const totalPairs = computed(() => leftWords.value.length)
const progressPercentage = computed(() => (matchedCount.value / totalPairs.value) * 100)
const allMatched = computed(() => matchedCount.value === totalPairs.value && totalPairs.value > 0)

// DOM 참조 설정 함수들
function setLeftWordRef(el, index) {
  if (el) {
    leftWordRefs.value[index] = el
  }
}

function setRightWordRef(el, index) {
  if (el) {
    rightWordRefs.value[index] = el
  }
}

// 캔버스 크기 업데이트
function updateCanvasSize() {
  if (canvasContainer.value) {
    const rect = canvasContainer.value.getBoundingClientRect()
    canvasWidth.value = rect.width
    canvasHeight.value = rect.height
  }
}

// 초기화
function initializeGame() {
  if (!quizStore.currentQuiz?.wordConnectionData) return
  
  const data = quizStore.currentQuiz.wordConnectionData
  leftWords.value = [...data.leftWords]
  rightWords.value = [...data.rightWords]
  completedConnections.value = []
  selectedLeftWord.value = null
  selectedLeftIndex.value = -1
  selectedRightWord.value = null
  selectedRightIndex.value = -1
  isConnecting.value = false
  currentConnectionLine.value = null
  
  // 게임 초기화 후 캔버스 크기 업데이트
  nextTick(() => {
    updateCanvasSize()
  })
}

// 왼쪽 단어 선택
function selectLeftWord(word, index) {
  if (word.matched) return
  
  if (selectedLeftWord.value?.id === word.id) {
    // 이미 선택된 단어를 다시 클릭하면 선택 해제
    selectedLeftWord.value = null
    selectedLeftIndex.value = -1
    isConnecting.value = false
    currentConnectionLine.value = null
  } else {
    selectedLeftWord.value = word
    selectedLeftIndex.value = index
    selectedRightWord.value = null
    selectedRightIndex.value = -1
    isConnecting.value = true
    startConnection(index)
  }
}

// 오른쪽 단어 선택
function selectRightWord(word, index) {
  if (word.matched) return
  
  if (selectedLeftWord.value && isConnecting.value) {
    // 연결 시도
    attemptConnection(selectedLeftWord.value, word, selectedLeftIndex.value, index)
  } else {
    selectedRightWord.value = word
    selectedRightIndex.value = index
  }
}

// 연결 시작
function startConnection(leftIndex) {
  if (!connectionCanvas.value || !leftWordRefs.value[leftIndex]) return
  
  const canvasRect = connectionCanvas.value.getBoundingClientRect()
  const leftRect = leftWordRefs.value[leftIndex].getBoundingClientRect()
  
  const startX = leftRect.right - canvasRect.left
  const startY = leftRect.top + leftRect.height / 2 - canvasRect.top
  
  currentConnectionLine.value = {
    x1: startX,
    y1: startY,
    x2: startX,
    y2: startY
  }
}

// 연결 시도
function attemptConnection(leftWord, rightWord, leftIndex, rightIndex) {
  const correctPairs = quizStore.currentQuiz.wordConnectionData.correctPairs
  const isCorrect = correctPairs.some(pair => 
    pair.leftId === leftWord.id && pair.rightId === rightWord.id
  )
  
  if (isCorrect) {
    // 정답! 연결 완료
    leftWord.matched = true
    rightWord.matched = true
    
    // 연결선 추가
    addCompletedConnection(leftWord, rightWord, leftIndex, rightIndex)
    
    // 선택 초기화
    selectedLeftWord.value = null
    selectedLeftIndex.value = -1
    selectedRightWord.value = null
    selectedRightIndex.value = -1
    isConnecting.value = false
    currentConnectionLine.value = null
  } else {
    // 오답! 잠시 표시 후 초기화
    showIncorrectFeedback()
  }
}

// 완성된 연결선 추가
function addCompletedConnection(leftWord, rightWord, leftIndex, rightIndex) {
  // DOM이 업데이트될 때까지 여러 번 시도
  const addConnection = () => {
    if (!leftWordRefs.value[leftIndex] || !rightWordRefs.value[rightIndex] || !connectionCanvas.value) {
      setTimeout(addConnection, 50) // 50ms 후 다시 시도
      return
    }
    
    const canvasRect = connectionCanvas.value.getBoundingClientRect()
    const leftRect = leftWordRefs.value[leftIndex].getBoundingClientRect()
    const rightRect = rightWordRefs.value[rightIndex].getBoundingClientRect()
    
    // 연결선이 화면에 보이는지 확인
    if (leftRect.width > 0 && rightRect.width > 0) {
      completedConnections.value.push({
        leftId: leftWord.id,
        rightId: rightWord.id,
        x1: leftRect.right - canvasRect.left,
        y1: leftRect.top + leftRect.height / 2 - canvasRect.top,
        x2: rightRect.left - canvasRect.left,
        y2: rightRect.top + rightRect.height / 2 - canvasRect.top
      })
    }
  }
  
  nextTick(addConnection)
}

// 오답 피드백
function showIncorrectFeedback() {
  // 간단한 흔들림 효과나 색상 변경 등을 추가할 수 있음
  setTimeout(() => {
    selectedLeftWord.value = null
    selectedLeftIndex.value = -1
    selectedRightWord.value = null
    selectedRightIndex.value = -1
    isConnecting.value = false
    currentConnectionLine.value = null
  }, 500)
}

// 오른쪽 단어 호버
function onRightWordHover(word, index) {
  if (!isConnecting.value || !selectedLeftWord.value || word.matched) return
  
  updateConnectionLine(index)
}

// 오른쪽 단어 호버 해제
function onRightWordLeave() {
  if (!isConnecting.value || !currentConnectionLine.value) return
  
  // 마우스 위치로 선을 그림
  if (connectionCanvas.value) {
    const canvasRect = connectionCanvas.value.getBoundingClientRect()
    currentConnectionLine.value.x2 = mouseX - canvasRect.left
    currentConnectionLine.value.y2 = mouseY - canvasRect.top
  }
}

// 연결선 업데이트
function updateConnectionLine(rightIndex) {
  if (!currentConnectionLine.value || !connectionCanvas.value || !rightWordRefs.value[rightIndex]) return
  
  const canvasRect = connectionCanvas.value.getBoundingClientRect()
  const rightRect = rightWordRefs.value[rightIndex].getBoundingClientRect()
  
  currentConnectionLine.value.x2 = rightRect.left - canvasRect.left
  currentConnectionLine.value.y2 = rightRect.top + rightRect.height / 2 - canvasRect.top
}

// 마우스 이동 처리
function handleMouseMove(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  
  if (isConnecting.value && currentConnectionLine.value && connectionCanvas.value) {
    const canvasRect = connectionCanvas.value.getBoundingClientRect()
    currentConnectionLine.value.x2 = mouseX - canvasRect.left
    currentConnectionLine.value.y2 = mouseY - canvasRect.top
  }
}

// 게임 완료
function completeGame() {
  // 연결 게임 완료 - 상세한 결과 데이터 생성
  const gameResult = {
    isCorrect: true,
    totalConnections: totalPairs.value,
    completedConnections: matchedCount.value,
    gameType: '연결',
    summary: `${matchedCount.value}/${totalPairs.value} 연결 완료`
  }
  
  // 퀴즈 완료 처리 - 연결 게임은 모든 연결 완료시 정답으로 처리
  quizStore.submitCustomAnswer(gameResult)
}

// 컴포넌트 마운트
onMounted(() => {
  initializeGame()
  document.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', updateCanvasSize)
  
  // DOM 참조 배열 초기화 및 캔버스 크기 설정
  nextTick(() => {
    leftWordRefs.value = []
    rightWordRefs.value = []
    updateCanvasSize()
  })
})

// 컴포넌트 언마운트
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<style scoped>
.word-connection-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* 게임 제목 */
.game-title-section {
  text-align: center;
  margin-bottom: 2rem;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.game-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

/* 연결 게임 영역 */
.connection-game-area {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  min-height: 400px;
}

.left-words-column,
.right-words-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.word-item {
  position: relative;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  min-height: 60px;
}

.left-word {
  justify-content: flex-start;
}

.right-word {
  justify-content: flex-end;
}

.word-item:hover {
  border-color: #4a90e2;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 144, 226, 0.2);
}

.word-item.selected {
  border-color: #4a90e2;
  background: #dbeafe;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.word-item.matched {
  border-color: #10b981;
  background: #d1fae5;
  cursor: default;
}

.word-item.matched:hover {
  transform: none;
  box-shadow: none;
}

.word-item.connecting {
  border-color: #f59e0b;
  background: #fef3c7;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.word-item.hover-target {
  border-color: #10b981;
  background: #ecfdf5;
}

.word-text {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
}

.match-indicator {
  font-size: 1.25rem;
  color: #10b981;
  font-weight: bold;
  margin-left: 0.5rem;
}

.right-word .match-indicator {
  margin-left: 0;
  margin-right: 0.5rem;
}

/* 연결선 캔버스 */
.connection-canvas-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.connection-line {
  stroke-width: 3;
  transition: all 0.3s ease;
}

.connection-line.completed {
  stroke: #10b981;
  stroke-dasharray: none;
}

.connection-line.current {
  stroke: #f59e0b;
  stroke-dasharray: 5,5;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

/* 진행 상황 */
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
  font-size: 1.1rem;
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
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* 완료 섹션 */
.completion-section {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 20px;
  border: 2px solid #10b981;
}

.completion-message {
  margin-bottom: 1.5rem;
}

.completion-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out infinite;
}

.completion-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.completion-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.complete-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .word-connection-container {
    padding: 1rem;
  }
  
  .connection-game-area {
    grid-template-columns: 1fr 60px 1fr;
    gap: 0.5rem;
  }
  
  .word-item {
    padding: 0.75rem 1rem;
    min-height: 50px;
  }
  
  .word-text {
    font-size: 0.9rem;
  }
  
  .game-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .connection-game-area {
    grid-template-columns: 1fr 40px 1fr;
  }
  
  .word-item {
    padding: 0.5rem 0.75rem;
    min-height: 45px;
  }
  
  .word-text {
    font-size: 0.85rem;
  }
}
</style>