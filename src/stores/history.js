import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', () => {
  const quizHistory = ref([])
  const materialHistory = ref([])

  // 퀴즈 기록 추가
  function addQuizRecord(record) {
    const quizRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      correctAnswers: record.correctAnswers,
      totalQuestions: record.totalQuestions,
      timeSpent: record.timeSpent,
      hintUsed: record.hintUsed || false,
      score: Math.round((record.correctAnswers / record.totalQuestions) * 100),
      details: record.details || []
    }
    
    quizHistory.value.unshift(quizRecord)
    
    // 최대 50개 기록만 유지
    if (quizHistory.value.length > 50) {
      quizHistory.value = quizHistory.value.slice(0, 50)
    }
    
    // 로컬 스토리지에 저장
    saveToLocalStorage()
  }

  // 자료 업로드 기록 추가
  function addMaterialRecord(record) {
    const materialRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      title: record.title,
      mainKeyword: record.mainKeyword || '',
      contentType: record.contentType || 'general',
      apiUsed: record.apiUsed || false,
      summaryLength: record.summary ? record.summary.length : 0,
      keywords: record.keywords || '',
      summary: record.summary || '',
      filename: record.filename || '',
      generatedImages: record.generatedImages || []
    }
    
    materialHistory.value.unshift(materialRecord)
    
    // 최대 30개 기록만 유지
    if (materialHistory.value.length > 30) {
      materialHistory.value = materialHistory.value.slice(0, 30)
    }
    
    // 로컬 스토리지에 저장
    saveToLocalStorage()
  }

  // 자료 기록 업데이트
  function updateMaterialRecord(dateToUpdate, updates) {
    const index = materialHistory.value.findIndex(record => record.date === dateToUpdate)
    if (index !== -1) {
      const record = materialHistory.value[index]
      materialHistory.value[index] = {
        ...record,
        ...updates,
        summaryLength: updates.summary ? updates.summary.length : record.summaryLength
      }
      saveToLocalStorage()
    }
  }

  // 자료 기록 삭제
  function deleteMaterialRecord(dateToDelete) {
    const index = materialHistory.value.findIndex(record => record.date === dateToDelete)
    if (index !== -1) {
      materialHistory.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  // 통계 계산
  const quizStats = computed(() => {
    if (quizHistory.value.length === 0) {
      return {
        totalPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        averageTime: 0,
        hintUsageRate: 0
      }
    }

    const totalPlayed = quizHistory.value.length
    const scores = quizHistory.value.map(record => record.score)
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const bestScore = Math.max(...scores)
    
    const totalCorrect = quizHistory.value.reduce((sum, record) => sum + record.correctAnswers, 0)
    const totalQuestions = quizHistory.value.reduce((sum, record) => sum + record.totalQuestions, 0)
    
    const times = quizHistory.value.map(record => record.timeSpent)
    const averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    
    const hintUsed = quizHistory.value.filter(record => record.hintUsed).length
    const hintUsageRate = Math.round((hintUsed / totalPlayed) * 100)

    return {
      totalPlayed,
      averageScore,
      bestScore,
      totalCorrect,
      totalQuestions,
      averageTime,
      hintUsageRate
    }
  })

  const materialStats = computed(() => {
    if (materialHistory.value.length === 0) {
      return {
        totalUploaded: 0,
        apiUsageRate: 0,
        contentTypes: {}
      }
    }

    const totalUploaded = materialHistory.value.length
    const apiUsed = materialHistory.value.filter(record => record.apiUsed).length
    const apiUsageRate = Math.round((apiUsed / totalUploaded) * 100)
    
    const contentTypes = materialHistory.value.reduce((acc, record) => {
      acc[record.contentType] = (acc[record.contentType] || 0) + 1
      return acc
    }, {})

    return {
      totalUploaded,
      apiUsageRate,
      contentTypes
    }
  })

  // 최근 활동 (퀴즈와 자료 합쳐서 최신 5개)
  const recentActivity = computed(() => {
    const activities = [
      ...quizHistory.value.slice(0, 3).map(record => ({
        type: 'quiz',
        date: record.date,
        title: `퀴즈 ${record.correctAnswers}/${record.totalQuestions} 정답`,
        score: record.score,
        icon: '🎯'
      })),
      ...materialHistory.value.slice(0, 3).map(record => ({
        type: 'material',
        date: record.date,
        title: record.title,
        contentType: record.contentType,
        icon: '📚'
      }))
    ]
    
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  })

  // 로컬 스토리지에 저장
  function saveToLocalStorage() {
    try {
      localStorage.setItem('quiz_history', JSON.stringify(quizHistory.value))
      localStorage.setItem('material_history', JSON.stringify(materialHistory.value))
    } catch (error) {
      console.error('히스토리 저장 실패:', error)
    }
  }

  // 로컬 스토리지에서 로드
  function loadFromLocalStorage() {
    try {
      const savedQuizHistory = localStorage.getItem('quiz_history')
      const savedMaterialHistory = localStorage.getItem('material_history')
      
      if (savedQuizHistory) {
        quizHistory.value = JSON.parse(savedQuizHistory)
      }
      
      if (savedMaterialHistory) {
        materialHistory.value = JSON.parse(savedMaterialHistory)
      }
    } catch (error) {
      console.error('히스토리 로드 실패:', error)
    }
  }

  // 히스토리 초기화
  function clearHistory() {
    quizHistory.value = []
    materialHistory.value = []
    localStorage.removeItem('quiz_history')
    localStorage.removeItem('material_history')
  }

  // 날짜 포맷 헬퍼
  function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 초기화 시 로컬 스토리지에서 데이터 로드
  loadFromLocalStorage()

  return {
    quizHistory,
    materialHistory,
    addQuizRecord,
    addMaterialRecord,
    updateMaterialRecord,
    deleteMaterialRecord,
    quizStats,
    materialStats,
    recentActivity,
    clearHistory,
    formatDate
  }
})