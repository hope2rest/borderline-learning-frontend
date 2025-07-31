<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- 헤더 -->
    <div v-if="$slots.header || title" class="toss-card__header">
      <slot name="header">
        <h3 v-if="title" class="toss-card__title">{{ title }}</h3>
      </slot>
    </div>

    <!-- 본문 -->
    <div v-if="$slots.default" class="toss-card__body">
      <slot />
    </div>

    <!-- 푸터 -->
    <div v-if="$slots.footer" class="toss-card__footer">
      <slot name="footer" />
    </div>

    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="toss-card__loading">
      <TossSpinner size="lg" color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TossSpinner from '../feedback/TossSpinner.vue';

interface Props {
  title?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  clickable: false,
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const cardClasses = computed(() => {
  const baseClasses = [
    'toss-card',
    'relative',
    'overflow-hidden',
    'transition-all',
    'duration-200',
    'ease-in-out',
  ];

  // 크기별 클래스
  const sizeClasses = {
    sm: [
      'p-4',
      'rounded-lg',
    ],
    md: [
      'p-6',
      'rounded-xl',
    ],
    lg: [
      'p-8',
      'rounded-2xl',
    ],
  };

  // 변형별 클래스
  const variantClasses = {
    default: [
      'bg-white',
      'border',
      'border-gray-200',
    ],
    elevated: [
      'bg-white',
      'shadow-md',
      'border',
      'border-gray-100',
      'hover:shadow-lg',
    ],
    outlined: [
      'bg-transparent',
      'border-2',
      'border-gray-300',
    ],
    filled: [
      'bg-gray-50',
      'border',
      'border-gray-200',
    ],
  };

  // 상호작용 클래스
  const interactionClasses = [];
  
  if (props.clickable && !props.disabled) {
    interactionClasses.push(
      'cursor-pointer',
      'hover:shadow-md',
      'active:scale-[0.98]',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2'
    );
  }

  if (props.disabled) {
    interactionClasses.push(
      'opacity-50',
      'cursor-not-allowed',
      'pointer-events-none'
    );
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...interactionClasses,
  ];
});

const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.toss-card {
  position: relative;
  background-color: white;
}

.toss-card__header {
  margin-bottom: 1rem;
}

.toss-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.toss-card__body {
  flex: 1;
}

.toss-card__footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.toss-card__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 토스 스타일 호버 효과 */
.toss-card:hover:not(.toss-card--disabled) {
  transform: translateY(-2px);
}

.toss-card:active:not(.toss-card--disabled) {
  transform: translateY(0) scale(0.98);
}

/* 토스 스타일 포커스 효과 */
.toss-card:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 반응형 조정 */
@media (max-width: 640px) {
  .toss-card {
    margin: 0.5rem;
  }
}
</style>