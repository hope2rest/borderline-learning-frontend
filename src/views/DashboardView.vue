<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-2xl font-bold text-gray-900">학습 대시보드</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ authStore.currentUser?.username || '학습자1' }}님</span>
            <button 
              @click="handleLogout"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              사용자 변경
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- 환영 메시지 -->
      <div v-if="historyStore.recentActivity.length === 0" class="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-2">🎉 경계선 지능인 학습 지원 서비스에 오신 것을 환영합니다!</h2>
          <p class="text-blue-100 mb-4">
            {{ authStore.currentUser?.username || '학습자1' }}님, 재미있는 학습 여정을 시작해보세요!
          </p>
          <div class="flex justify-center space-x-4">
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
              <span class="text-lg">📚 자료 업로드 → AI 요약</span>
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
              <span class="text-lg">🎯 퀴즈 게임 → 힌트 활용</span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- 자료 업로드 섹션 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">📚 학습 자료 업로드</h2>
          <form @submit.prevent="uploadMaterial" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input 
                v-model="materialForm.title"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="자료 제목을 입력하세요"
                required
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea 
                v-model="materialForm.content"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="학습 내용을 입력하세요"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              :disabled="uploading"
              class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ uploading ? '업로드 중...' : '자료 업로드' }}
            </button>
          </form>

          <!-- AI 요약 결과 -->
          <div v-if="aiSummary" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-2">🤖 AI 요약</h3>
            <div class="text-blue-700 whitespace-pre-line">{{ aiSummary }}</div>
          </div>
        </div>

        <!-- 퀴즈 시작 섹션 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">🎯 퀴즈 게임</h2>
          <div class="text-center">
            <div class="mb-6">
              <div class="text-6xl mb-4">🧩</div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">재미있는 퀴즈에 도전해보세요!</h3>
              <p class="text-gray-600 mb-4">총 3문제의 이미지 퀴즈가 준비되어 있어요.</p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p class="text-yellow-800 text-sm">
                  💡 어려우면 "잘 모르겠어요" 버튼을 눌러서 힌트를 받아보세요!
                </p>
              </div>
            </div>
            <button 
              @click="startQuiz"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              퀴즈 시작하기 🚀
            </button>
          </div>
        </div>
      </div>

      <!-- 최근 활동 -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">📈 최근 활동</h2>
        
        <div v-if="historyStore.recentActivity.length === 0" class="text-gray-600">
          <p>아직 활동 내역이 없습니다. 자료를 업로드하거나 퀴즈를 풀어보세요!</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="activity in historyStore.recentActivity" 
            :key="activity.date"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ activity.icon }}</span>
              <div>
                <p class="font-medium text-gray-800">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ historyStore.formatDate(activity.date) }}</p>
              </div>
            </div>
            <div v-if="activity.type === 'quiz'" class="text-right">
              <span class="text-lg font-bold" :class="getScoreColor(activity.score)">
                {{ activity.score }}점
              </span>
            </div>
            <div v-else class="text-sm text-gray-500">
              {{ getContentTypeText(activity.contentType) }}
            </div>
          </div>
        </div>

        <!-- 통계 요약 -->
        <div v-if="historyStore.quizStats.totalPlayed > 0" class="mt-6 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ historyStore.quizStats.totalPlayed }}</div>
              <div class="text-sm text-gray-500">퀴즈 플레이</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ historyStore.quizStats.averageScore }}점</div>
              <div class="text-sm text-gray-500">평균 점수</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">{{ historyStore.materialStats.totalUploaded }}</div>
              <div class="text-sm text-gray-500">자료 업로드</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-yellow-600">{{ historyStore.quizStats.averageTime }}초</div>
              <div class="text-sm text-gray-500">평균 시간</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 데모 모드 알림 -->
    <DemoModeAlert
      :show="showDemoAlert"
      :api-status="apiStatus"
      @continue="handleDemoAcknowledge"
      @setupApi="handleApiSetup"
      @close="handleDemoAcknowledge"
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useQuizStore } from '../stores/quiz.js'
import { useHistoryStore } from '../stores/history.js'
import { useApiStatus } from '../composables/useApiStatus.js'
import DemoModeAlert from '../components/DemoModeAlert.vue'
import ErrorHandler from '../components/ErrorHandler.vue'
import apiService from '../services/api.js'

const router = useRouter()
const authStore = useAuthStore()
const quizStore = useQuizStore()
const historyStore = useHistoryStore()
const { apiStatus, showDemoAlert, acknowledgeDemoMode, isDemoMode } = useApiStatus()

const uploading = ref(false)
const aiSummary = ref('')
const materialForm = ref({
  title: '',
  content: ''
})
const showError = ref(false)
const errorInfo = ref({})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

async function uploadMaterial() {
  uploading.value = true
  aiSummary.value = ''
  
  try {
    if (isDemoMode()) {
      // 데모 모드: 목업 요약 생성
      await new Promise(resolve => setTimeout(resolve, 1500)) // 로딩 시뮬레이션
      
      const demoSummaries = {
        '수학': `📊 ${materialForm.value.title} 요약

• 분수의 덧셈: 분모가 같을 때는 분자만 더하기
• 분모가 다를 때: 통분한 후 분자 더하기
• 기약분수로 답 만들기
• 피자 조각으로 생각하면 쉬워요!

🔧 이 요약은 데모 모드입니다. Gemini API 키를 설정하면 실제 AI 요약을 받을 수 있습니다.`,
        '과학': `🌱 ${materialForm.value.title} 요약

• 광합성 재료: 햇빛 + 물 + 이산화탄소
• 과정: 잎에서 음식 만들기
• 결과: 산소 만들어서 우리가 숨쉴 수 있게 해줌
• 실험: 화분에 물주고 햇빛 쬐어주며 관찰하기

🔧 이 요약은 데모 모드입니다. Gemini API 키를 설정하면 실제 AI 요약을 받을 수 있습니다.`,
        'default': `📚 ${materialForm.value.title} 요약

• 핵심 내용을 이해하기 쉽게 정리했습니다
• 중요한 포인트를 강조했습니다
• 실생활과 연결해서 설명했습니다
• 복습할 때 다시 보면 좋을 내용입니다

🔧 이 요약은 데모 모드입니다. Gemini API 키를 설정하면 실제 AI 요약을 받을 수 있습니다.`
      }
      
      const title = materialForm.value.title.toLowerCase()
      let summary = demoSummaries.default
      
      if (title.includes('수학') || title.includes('분수') || title.includes('계산')) {
        summary = demoSummaries['수학']
      } else if (title.includes('과학') || title.includes('식물') || title.includes('광합성')) {
        summary = demoSummaries['과학']
      }
      
      aiSummary.value = summary
    } else {
      // 실제 API 호출
      const response = await apiService.uploadMaterial(materialForm.value)
      aiSummary.value = response.ai_summary
      
      // API 상태 확인
      if (response.api_status && !response.api_status.used) {
        showApiWarning(response.api_status)
      }
    }

    // 히스토리에 기록 추가
    historyStore.addMaterialRecord({
      title: materialForm.value.title,
      contentType: inferContentType(materialForm.value.title),
      apiUsed: !isDemoMode(),
      summary: aiSummary.value
    })

    // 폼 초기화
    materialForm.value = { title: '', content: '' }
    
  } catch (error) {
    console.error('자료 업로드 실패:', error)
    showErrorModal('자료 업로드 실패', error.message || '네트워크 연결을 확인해주세요.')
  } finally {
    uploading.value = false
  }
}

function showApiWarning(apiStatus) {
  const messages = {
    'call_failed': 'API 호출에 실패하여 목업 데이터를 제공합니다.',
    'no_key': 'API 키가 없어 목업 데이터를 제공합니다.',
    'demo_mode': '데모 모드에서 목업 데이터를 제공합니다.'
  }
  
  showErrorModal(
    'API 상태 알림',
    messages[apiStatus.status] || '목업 데이터를 제공합니다.',
    'warning'
  )
}

function showErrorModal(title, message, type = 'error') {
  errorInfo.value = { title, message, type }
  showError.value = true
}

function startQuiz() {
  quizStore.startGame()
  router.push('/quiz')
}

function handleDemoAcknowledge() {
  acknowledgeDemoMode()
}

function handleApiSetup() {
  // API 키 설정 안내
  window.open('https://ai.google.dev/gemini-api/docs/api-key', '_blank')
}

function inferContentType(title) {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('수학') || titleLower.includes('분수') || titleLower.includes('계산')) {
    return 'math'
  } else if (titleLower.includes('과학') || titleLower.includes('식물') || titleLower.includes('광합성')) {
    return 'science'
  } else if (titleLower.includes('국어') || titleLower.includes('영어') || titleLower.includes('언어')) {
    return 'language'
  } else if (titleLower.includes('역사') || titleLower.includes('조선') || titleLower.includes('독립')) {
    return 'history'
  }
  return 'general'
}

function getScoreColor(score) {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

function getContentTypeText(type) {
  const types = {
    'math': '수학',
    'science': '과학',
    'language': '언어',
    'history': '역사',
    'general': '일반'
  }
  return types[type] || '일반'
}

// 자동 로그인 처리는 라우터에서 담당
// 페이지 접근 시 자동으로 학습자1로 로그인됨
</script>