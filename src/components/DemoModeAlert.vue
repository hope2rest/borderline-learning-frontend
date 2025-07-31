<template>
  <ErrorHandler
    :show="show"
    type="warning"
    title="데모 모드 안내"
    :message="message"
    :details="details"
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
    @close="handleClose"
    @primaryAction="handleContinue"
    @secondaryAction="handleSetupApi"
  />
</template>

<script setup>
import { computed } from 'vue'
import ErrorHandler from './ErrorHandler.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  apiStatus: {
    type: Object,
    default: () => ({
      status: 'no_key',
      has_api_key: false,
      demo_mode: true,
      available: false
    })
  }
})

const emit = defineEmits(['close', 'continue', 'setupApi'])

const message = computed(() => {
  const status = props.apiStatus.status
  
  const messages = {
    'no_key': 'Gemini API 키가 설정되지 않아 데모 모드로 실행됩니다.',
    'init_failed': 'API 초기화에 실패하여 데모 모드로 실행됩니다.',
    'call_failed': 'API 호출에 실패하여 데모 모드로 전환됩니다.',
    'demo_mode': '현재 데모 모드로 실행 중입니다.'
  }
  
  return messages[status] || '데모 모드로 실행됩니다.'
})

const details = computed(() => {
  const status = props.apiStatus.status
  
  if (status === 'no_key') {
    return '목업 데이터로 AI 요약 기능을 체험할 수 있습니다. 실제 AI 요약을 원하시면 Gemini API 키를 설정해주세요.'
  } else if (status === 'init_failed') {
    return 'API 키가 올바르지 않거나 네트워크 문제가 있을 수 있습니다. 설정을 확인해주세요.'
  } else if (status === 'call_failed') {
    return '일시적인 네트워크 문제일 수 있습니다. 잠시 후 다시 시도해주세요.'
  } else {
    return '모든 기능을 체험할 수 있지만, AI 요약은 미리 준비된 샘플 데이터를 사용합니다.'
  }
})

const primaryAction = computed(() => ({
  text: '데모 모드로 계속하기',
  action: () => handleContinue()
}))

const secondaryAction = computed(() => {
  if (props.apiStatus.status === 'no_key') {
    return {
      text: 'API 키 설정 방법 보기',
      action: () => handleSetupApi()
    }
  }
  return null
})

function handleClose() {
  emit('close')
}

function handleContinue() {
  emit('continue')
  handleClose()
}

function handleSetupApi() {
  emit('setupApi')
  // API 키 설정 안내 페이지나 모달을 열 수 있음
  window.open('https://ai.google.dev/gemini-api/docs/api-key', '_blank')
  handleClose()
}
</script>