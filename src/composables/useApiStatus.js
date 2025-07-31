import { ref, onMounted } from 'vue'
import apiService from '../services/api.js'

export function useApiStatus() {
  const apiStatus = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const showDemoAlert = ref(false)

  async function checkApiStatus() {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getApiStatus()
      apiStatus.value = response.gemini_api
      
      // 데모 모드이거나 API 키가 없으면 알림 표시
      if (!response.gemini_api.available && !localStorage.getItem('demo_acknowledged')) {
        showDemoAlert.value = true
      }
      
    } catch (err) {
      error.value = err.message
      console.error('API 상태 확인 실패:', err)
      
      // API 연결 실패 시 데모 모드로 간주
      apiStatus.value = {
        status: 'call_failed',
        has_api_key: false,
        demo_mode: true,
        available: false
      }
      
      if (!localStorage.getItem('demo_acknowledged')) {
        showDemoAlert.value = true
      }
    } finally {
      loading.value = false
    }
  }

  function acknowledgeDemoMode() {
    localStorage.setItem('demo_acknowledged', 'true')
    showDemoAlert.value = false
  }

  function resetDemoAcknowledgment() {
    localStorage.removeItem('demo_acknowledged')
  }

  function isApiAvailable() {
    return apiStatus.value?.available === true
  }

  function isDemoMode() {
    return apiStatus.value?.demo_mode === true || !isApiAvailable()
  }

  function getStatusMessage() {
    if (!apiStatus.value) return ''
    
    const messages = {
      'available': 'Gemini API가 정상적으로 작동하고 있습니다.',
      'no_key': 'API 키가 설정되지 않았습니다.',
      'init_failed': 'API 초기화에 실패했습니다.',
      'call_failed': 'API 호출에 실패했습니다.',
      'demo_mode': '데모 모드로 실행 중입니다.'
    }
    
    return messages[apiStatus.value.status] || '알 수 없는 상태입니다.'
  }

  function getStatusColor() {
    if (!apiStatus.value) return 'gray'
    
    const colors = {
      'available': 'green',
      'no_key': 'yellow',
      'init_failed': 'red',
      'call_failed': 'red',
      'demo_mode': 'blue'
    }
    
    return colors[apiStatus.value.status] || 'gray'
  }

  // 컴포넌트 마운트 시 자동으로 상태 확인
  onMounted(() => {
    checkApiStatus()
  })

  return {
    apiStatus,
    loading,
    error,
    showDemoAlert,
    checkApiStatus,
    acknowledgeDemoMode,
    resetDemoAcknowledgment,
    isApiAvailable,
    isDemoMode,
    getStatusMessage,
    getStatusColor
  }
}