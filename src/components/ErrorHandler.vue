<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      
      <!-- 아이콘 -->
      <div class="text-center mb-4">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
             :class="iconBackgroundClass">
          <component :is="iconComponent" class="w-8 h-8" :class="iconColorClass" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>

      <!-- 메시지 -->
      <div class="mb-6">
        <p class="text-gray-600 text-center">{{ message }}</p>
        
        <!-- 추가 정보 (선택사항) -->
        <div v-if="details" class="mt-3 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">{{ details }}</p>
        </div>
      </div>

      <!-- 액션 버튼들 -->
      <div class="flex flex-col space-y-2">
        <button 
          v-if="primaryAction"
          @click="handlePrimaryAction"
          class="w-full py-2 px-4 rounded-lg font-medium text-white transition-colors"
          :class="primaryButtonClass"
        >
          {{ primaryAction.text }}
        </button>
        
        <button 
          v-if="secondaryAction"
          @click="handleSecondaryAction"
          class="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
        >
          {{ secondaryAction.text }}
        </button>
        
        <button 
          v-if="!primaryAction && !secondaryAction"
          @click="close"
          class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 아이콘 컴포넌트들
const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const SuccessIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `
}

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // info, warning, error, success
    validator: (value) => ['info', 'warning', 'error', 'success'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  primaryAction: {
    type: Object,
    default: null
    // { text: string, action: function }
  },
  secondaryAction: {
    type: Object,
    default: null
    // { text: string, action: function }
  }
})

const emit = defineEmits(['close', 'primaryAction', 'secondaryAction'])

const iconComponent = computed(() => {
  const icons = {
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    success: SuccessIcon
  }
  return icons[props.type] || InfoIcon
})

const iconBackgroundClass = computed(() => {
  const classes = {
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    success: 'bg-green-100'
  }
  return classes[props.type] || 'bg-blue-100'
})

const iconColorClass = computed(() => {
  const classes = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600'
  }
  return classes[props.type] || 'text-blue-600'
})

const primaryButtonClass = computed(() => {
  const classes = {
    info: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    error: 'bg-red-500 hover:bg-red-600',
    success: 'bg-green-500 hover:bg-green-600'
  }
  return classes[props.type] || 'bg-blue-500 hover:bg-blue-600'
})

function close() {
  emit('close')
}

function handlePrimaryAction() {
  if (props.primaryAction?.action) {
    props.primaryAction.action()
  }
  emit('primaryAction')
}

function handleSecondaryAction() {
  if (props.secondaryAction?.action) {
    props.secondaryAction.action()
  }
  emit('secondaryAction')
}
</script>