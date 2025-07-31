<template>
  <div :class="spinnerClasses">
    <div class="toss-spinner__circle">
      <div class="toss-spinner__path"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
});

const spinnerClasses = computed(() => {
  const baseClasses = [
    'toss-spinner',
    'inline-block',
    'animate-spin',
  ];

  const sizeClasses = {
    xs: ['w-3', 'h-3'],
    sm: ['w-4', 'h-4'],
    md: ['w-6', 'h-6'],
    lg: ['w-8', 'h-8'],
    xl: ['w-12', 'h-12'],
  };

  const colorClasses = {
    primary: ['text-blue-500'],
    secondary: ['text-gray-500'],
    white: ['text-white'],
    gray: ['text-gray-400'],
  };

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...colorClasses[props.color],
  ];
});
</script>

<style scoped>
.toss-spinner {
  position: relative;
}

.toss-spinner__circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  animation: toss-spin 1s linear infinite;
}

.toss-spinner__path {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  opacity: 0.3;
  animation: toss-spin 1s linear infinite reverse;
}

@keyframes toss-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 토스 스타일 맞춤 스피너 애니메이션 */
@keyframes toss-spinner-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.toss-spinner:hover .toss-spinner__path {
  animation: toss-spinner-pulse 0.5s ease-in-out infinite;
}
</style>