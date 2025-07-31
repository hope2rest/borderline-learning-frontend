import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mockQuizzes } from './mockData.js'
import ApiService from '../services/api.js'

export const useQuizStore = defineStore('quiz', () => {
  const currentQuizIndex = ref(0)
  const answers = ref([])
  const hintMode = ref(false)
  const gameStartTime = ref(null)
  const gameEndTime = ref(null)
  const isGameActive = ref(false)
  const quizzes = ref([])
  const loadingQuizzes = ref(false)
  const useRealAPI = ref(false)
  const customQuizData = ref(null)
  const currentQuestionIndex = ref(0)
  const showExplanation = ref(false)
  const currentAnswer = ref(null)
  const onQuizComplete = ref(null)

  const currentQuiz = computed(() => {
    if (customQuizData.value) {
      return customQuizData.value.questions[currentQuestionIndex.value] || null
    }
    const activeQuizzes = useRealAPI.value ? quizzes.value : mockQuizzes
    return activeQuizzes[currentQuizIndex.value] || null
  })
  const totalQuizzes = computed(() => {
    if (customQuizData.value) {
      return customQuizData.value.questions.length
    }
    const activeQuizzes = useRealAPI.value ? quizzes.value : mockQuizzes
    return activeQuizzes.length
  })
  const correctAnswers = computed(() => 
    answers.value.filter(answer => answer.isCorrect).length
  )
  const gameTime = computed(() => {
    if (gameStartTime.value && gameEndTime.value) {
      return Math.round((gameEndTime.value - gameStartTime.value) / 1000)
    }
    return 0
  })

  function startGame() {
    currentQuizIndex.value = 0
    answers.value = []
    hintMode.value = false
    gameStartTime.value = Date.now()
    gameEndTime.value = null
    isGameActive.value = true
  }

  function startGameFromQuiz(quizId) {
    // quizId에 해당하는 인덱스 찾기
    const activeQuizzes = useRealAPI.value ? quizzes.value : mockQuizzes
    const quizIndex = activeQuizzes.findIndex(quiz => quiz.id === quizId)
    
    if (quizIndex !== -1) {
      currentQuizIndex.value = quizIndex
    } else {
      currentQuizIndex.value = 0
    }
    
    answers.value = []
    hintMode.value = false
    gameStartTime.value = Date.now()
    gameEndTime.value = null
    isGameActive.value = true
  }

  function enableHintMode() {
    hintMode.value = true
  }

  function submitAnswer(selectedOption) {
    const quiz = currentQuiz.value
    const isCorrect = selectedOption === quiz.correct_answer
    
    answers.value.push({
      quizId: quiz.id,
      selectedOption,
      correctAnswer: quiz.correct_answer,
      isCorrect,
      hintUsed: hintMode.value
    })

    hintMode.value = false

    if (currentQuizIndex.value < totalQuizzes.value - 1) {
      currentQuizIndex.value++
    } else {
      endGame()
    }
  }

  // OX 퀴즈용 답안 제출 함수
  function submitOXAnswer(selectedAnswer) {
    const quiz = currentQuiz.value
    const isCorrect = selectedAnswer === quiz.correct_answer
    
    answers.value.push({
      quizId: quiz.id,
      selectedOption: selectedAnswer,
      correctAnswer: quiz.correct_answer,
      isCorrect,
      hintUsed: hintMode.value
    })

    hintMode.value = false

    if (currentQuizIndex.value < totalQuizzes.value - 1) {
      currentQuizIndex.value++
    } else {
      endGame()
    }
  }

  function endGame() {
    gameEndTime.value = Date.now()
    isGameActive.value = false
  }

  function resetGame() {
    currentQuizIndex.value = 0
    answers.value = []
    hintMode.value = false
    gameStartTime.value = null
    gameEndTime.value = null
    isGameActive.value = false
  }

  // API에서 퀴즈 로드
  async function loadQuizzes() {
    loadingQuizzes.value = true
    try {
      const isConnected = await ApiService.testConnection()
      
      if (isConnected) {
        const apiQuizzes = await ApiService.getQuizzesFromAPI()
        
        if (apiQuizzes && apiQuizzes.length > 0) {
          quizzes.value = apiQuizzes.map(quiz => ({
            id: quiz.id,
            question_image_url: quiz.question_image_url,
            option1: quiz.option1,
            option2: quiz.option2, 
            option3: quiz.option3,
            correct_answer: quiz.correct_answer,
            hint_mode_options: quiz.hint_mode_options || {}
          }))
          useRealAPI.value = true
          console.log('✅ 실제 API에서 퀴즈 로드 성공:', quizzes.value.length + '개')
          return true
        }
      }
      
      // API 연결 실패시 목업 데이터 사용
      console.log('⚠️ API 연결 실패, 목업 데이터 사용')
      useRealAPI.value = false
      return false
      
    } catch (error) {
      console.error('퀴즈 로드 실패:', error)
      useRealAPI.value = false
      return false
    } finally {
      loadingQuizzes.value = false
    }
  }

  // API 상태 확인
  async function checkAPIStatus() {
    try {
      const isConnected = await ApiService.testConnection()
      return {
        connected: isConnected,
        usingAPI: useRealAPI.value,
        quizCount: useRealAPI.value ? quizzes.value.length : mockQuizzes.length
      }
    } catch (error) {
      return {
        connected: false,
        usingAPI: false,
        quizCount: mockQuizzes.length
      }
    }
  }

  // 목업 데이터 사용 설정
  function setUseMockData() {
    useRealAPI.value = false
  }

  // 커스텀 퀴즈 데이터 설정
  function setCustomQuizData(quizData) {
    customQuizData.value = quizData
    currentQuestionIndex.value = 0
    answers.value = []
    gameStartTime.value = Date.now()
    gameEndTime.value = null
    isGameActive.value = true
    showExplanation.value = false
    currentAnswer.value = null
  }

  // OX 답안 제출 (새로운 시스템용)
  function submitCustomAnswer(answer) {
    if (!customQuizData.value || !currentQuiz.value) return

    const isCorrect = currentQuiz.value.answer === answer
    currentAnswer.value = {
      userAnswer: answer,
      isCorrect: isCorrect,
      question: currentQuiz.value
    }

    answers.value.push({
      questionIndex: currentQuestionIndex.value,
      userAnswer: answer,
      correctAnswer: currentQuiz.value.answer,
      isCorrect: isCorrect,
      timeSpent: Math.round((Date.now() - gameStartTime.value) / 1000),
      explanation: currentQuiz.value.explanation
    })

    showExplanation.value = true
  }

  // 다음 문제로 이동
  function goToNextQuestion() {
    currentQuestionIndex.value++
    showExplanation.value = false
    currentAnswer.value = null

    if (currentQuestionIndex.value >= customQuizData.value.questions.length) {
      // 퀴즈 완료
      gameEndTime.value = Date.now()
      isGameActive.value = false
      
      // 퀴즈 완료 콜백 호출
      if (onQuizComplete.value) {
        onQuizComplete.value({
          correctAnswers: correctAnswers.value,
          totalQuestions: totalQuizzes.value,
          answers: answers.value
        })
      }
    }
  }

  // 퀴즈 재시작
  function restartCustomQuiz() {
    if (customQuizData.value) {
      currentQuestionIndex.value = 0
      answers.value = []
      gameStartTime.value = Date.now()
      gameEndTime.value = null
      isGameActive.value = true
      showExplanation.value = false
      currentAnswer.value = null
    }
  }

  // 커스텀 퀴즈 종료
  function endCustomQuiz() {
    customQuizData.value = null
    currentQuestionIndex.value = 0
    answers.value = []
    isGameActive.value = false
    showExplanation.value = false
    currentAnswer.value = null
    onQuizComplete.value = null
  }

  return {
    currentQuizIndex,
    currentQuiz,
    totalQuizzes,
    answers,
    correctAnswers,
    hintMode,
    gameTime,
    isGameActive,
    quizzes,
    loadingQuizzes,
    useRealAPI,
    customQuizData,
    currentQuestionIndex,
    showExplanation,
    currentAnswer,
    onQuizComplete,
    startGame,
    startGameFromQuiz,
    enableHintMode,
    submitAnswer,
    submitOXAnswer,
    endGame,
    resetGame,
    loadQuizzes,
    checkAPIStatus,
    setUseMockData,
    setCustomQuizData,
    submitCustomAnswer,
    goToNextQuestion,
    restartCustomQuiz,
    endCustomQuiz
  }
})