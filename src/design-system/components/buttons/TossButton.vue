<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span v-if="loading" class="toss-button__loading">
      <TossSpinner :size="spinnerSize" />
    </span>
    <slot v-if="!loading" name="icon-left" />
    <span v-if="!loading || showTextWhenLoading" class="toss-button__text">
      <slot />
    </span>
    <slot v-if="!loading" name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { shadows } from '../../tokens/shadows';
import { spacing } from '../../tokens/spacing';
import TossSpinner from '../feedback/TossSpinner.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  showTextWhenLoading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  showTextWhenLoading: false,
  fullWidth: false,
  rounded: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  const baseClasses = [
    'toss-button',
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'active:scale-95',
  ];

  // 크기별 클래스
  const sizeClasses = {
    xs: [
      'px-2.5',
      'py-1.5',
      'text-xs',
      'min-h-[28px]',
      'rounded-md',
    ],
    sm: [
      'px-3',
      'py-2',
      'text-sm',
      'min-h-[36px]',
      'rounded-md',
    ],
    md: [
      'px-6',
      'py-3',
      'text-base',
      'min-h-[48px]',
      'rounded-lg',
    ],
    lg: [
      'px-8',
      'py-4',
      'text-lg',
      'min-h-[56px]',
      'rounded-lg',
    ],
    xl: [
      'px-10',
      'py-5',
      'text-xl',
      'min-h-[64px]',
      'rounded-xl',
    ],
  };

  // 변형별 클래스
  const variantClasses = {
    primary: [
      'bg-blue-500',
      'text-white',
      'border-transparent',
      'hover:bg-blue-600',
      'focus:ring-blue-500',
      'shadow-sm',
      'hover:shadow-md',
      'disabled:bg-gray-300',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-900',
      'border-transparent',
      'hover:bg-gray-200',
      'focus:ring-gray-500',
      'shadow-sm',
      'hover:shadow-md',
      'disabled:bg-gray-50',
      'disabled:text-gray-400',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
    ],
    tertiary: [
      'bg-white',
      'text-gray-900',
      'border',
      'border-gray-300',
      'hover:bg-gray-50',
      'focus:ring-gray-500',
      'shadow-sm',
      'hover:shadow-md',
      'disabled:bg-gray-50',
      'disabled:text-gray-400',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
    ],
    danger: [
      'bg-red-500',
      'text-white',
      'border-transparent',
      'hover:bg-red-600',
      'focus:ring-red-500',
      'shadow-sm',
      'hover:shadow-md',
      'disabled:bg-gray-300',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
    ],
    success: [
      'bg-green-500',
      'text-white',
      'border-transparent',
      'hover:bg-green-600',
      'focus:ring-green-500',
      'shadow-sm',
      'hover:shadow-md',
      'disabled:bg-gray-300',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed',
      'disabled:shadow-none',
    ],
    outline: [
      'bg-transparent',
      'text-blue-500',
      'border-2',
      'border-blue-500',
      'hover:bg-blue-50',
      'focus:ring-blue-500',
      'disabled:bg-transparent',
      'disabled:text-gray-400',
      'disabled:border-gray-300',
      'disabled:cursor-not-allowed',
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'border-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'disabled:bg-transparent',
      'disabled:text-gray-400',
      'disabled:cursor-not-allowed',
    ],
  };

  // 추가 클래스
  const additionalClasses = [];
  
  if (props.fullWidth) {
    additionalClasses.push('w-full');
  }
  
  if (props.rounded) {
    additionalClasses.push('rounded-full');
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...additionalClasses,
  ];
});

const spinnerSize = computed(() => {
  const sizeMap = {
    xs: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'lg',
  };
  return sizeMap[props.size] as 'sm' | 'md' | 'lg';
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.toss-button {
  border: 1px solid transparent;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.toss-button__loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.toss-button__text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toss-button:active {
  transform: scale(0.95);
}

.toss-button:disabled:active {
  transform: none;
}

/* 토스 스타일 커스텀 애니메이션 */
@keyframes toss-button-press {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.toss-button:not(:disabled):active {
  animation: toss-button-press 0.1s ease-in-out;
}
</style>