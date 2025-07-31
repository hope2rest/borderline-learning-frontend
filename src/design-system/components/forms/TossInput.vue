<template>
  <div class="toss-input-wrapper">
    <!-- 라벨 -->
    <label v-if="label" :for="inputId" class="toss-input__label">
      {{ label }}
      <span v-if="required" class="toss-input__required">*</span>
    </label>

    <!-- 입력 컨테이너 -->
    <div class="toss-input__container" :class="containerClasses">
      <!-- 왼쪽 아이콘 -->
      <div v-if="$slots.iconLeft" class="toss-input__icon-left">
        <slot name="iconLeft" />
      </div>

      <!-- 입력 필드 -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        v-bind="$attrs"
      />

      <!-- 오른쪽 아이콘 -->
      <div v-if="$slots.iconRight" class="toss-input__icon-right">
        <slot name="iconRight" />
      </div>

      <!-- 클리어 버튼 -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="toss-input__clear"
        @click="handleClear"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 도움말 텍스트 -->
    <div v-if="helpText || errorMessage" class="toss-input__help">
      <p v-if="errorMessage" class="toss-input__error">{{ errorMessage }}</p>
      <p v-else-if="helpText" class="toss-input__help-text">{{ helpText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  state?: 'default' | 'success' | 'error' | 'warning';
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  clearable?: boolean;
  helpText?: string;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  state: 'default',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  clear: [];
}>();

const attrs = useAttrs();
const isFocused = ref(false);

const inputId = computed(() => {
  return attrs.id as string || `toss-input-${Math.random().toString(36).substr(2, 9)}`;
});

const containerClasses = computed(() => {
  const classes = [
    'toss-input__container--base',
  ];

  // 크기별 클래스
  const sizeClasses = {
    sm: 'toss-input__container--sm',
    md: 'toss-input__container--md',
    lg: 'toss-input__container--lg',
  };
  classes.push(sizeClasses[props.size]);

  // 변형별 클래스
  const variantClasses = {
    default: 'toss-input__container--default',
    filled: 'toss-input__container--filled',
    outlined: 'toss-input__container--outlined',
  };
  classes.push(variantClasses[props.variant]);

  // 상태별 클래스
  const stateClasses = {
    default: 'toss-input__container--state-default',
    success: 'toss-input__container--state-success',
    error: 'toss-input__container--state-error',
    warning: 'toss-input__container--state-warning',
  };
  classes.push(stateClasses[props.state]);

  // 포커스 상태
  if (isFocused.value) {
    classes.push('toss-input__container--focused');
  }

  // 비활성화 상태
  if (props.disabled) {
    classes.push('toss-input__container--disabled');
  }

  return classes;
});

const inputClasses = computed(() => {
  const classes = [
    'toss-input__field',
  ];

  // 크기별 클래스
  const sizeClasses = {
    sm: 'toss-input__field--sm',
    md: 'toss-input__field--md',
    lg: 'toss-input__field--lg',
  };
  classes.push(sizeClasses[props.size]);

  return classes;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  
  if (props.type === 'number') {
    value = target.valueAsNumber;
  }
  
  emit('update:modelValue', value);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<style scoped>
.toss-input-wrapper {
  width: 100%;
}

.toss-input__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.toss-input__required {
  color: #ef4444;
  margin-left: 0.125rem;
}

.toss-input__container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.2s ease-in-out;
}

/* 기본 컨테이너 스타일 */
.toss-input__container--base {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
}

/* 크기별 스타일 */
.toss-input__container--sm {
  min-height: 2.25rem;
  padding: 0 0.75rem;
}

.toss-input__container--md {
  min-height: 3rem;
  padding: 0 1rem;
}

.toss-input__container--lg {
  min-height: 3.5rem;
  padding: 0 1.25rem;
}

/* 변형별 스타일 */
.toss-input__container--default {
  border: 1px solid #d1d5db;
  background-color: white;
}

.toss-input__container--filled {
  border: 1px solid transparent;
  background-color: #f9fafb;
}

.toss-input__container--outlined {
  border: 2px solid #d1d5db;
  background-color: transparent;
}

/* 상태별 스타일 */
.toss-input__container--state-default {
  border-color: #d1d5db;
}

.toss-input__container--state-success {
  border-color: #10b981;
}

.toss-input__container--state-error {
  border-color: #ef4444;
}

.toss-input__container--state-warning {
  border-color: #f59e0b;
}

/* 포커스 상태 */
.toss-input__container--focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 비활성화 상태 */
.toss-input__container--disabled {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.toss-input__field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #111827;
  font-size: 1rem;
  line-height: 1.5;
}

.toss-input__field--sm {
  font-size: 0.875rem;
}

.toss-input__field--md {
  font-size: 1rem;
}

.toss-input__field--lg {
  font-size: 1.125rem;
}

.toss-input__field:disabled {
  cursor: not-allowed;
  color: #9ca3af;
}

.toss-input__field::placeholder {
  color: #9ca3af;
}

.toss-input__icon-left,
.toss-input__icon-right {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.toss-input__icon-left {
  margin-right: 0.5rem;
}

.toss-input__icon-right {
  margin-left: 0.5rem;
}

.toss-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s ease-in-out;
}

.toss-input__clear:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.toss-input__help {
  margin-top: 0.5rem;
}

.toss-input__error {
  color: #ef4444;
  font-size: 0.875rem;
  margin: 0;
}

.toss-input__help-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* 토스 스타일 애니메이션 */
@keyframes toss-input-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.toss-input__container--state-error {
  animation: toss-input-shake 0.5s ease-in-out;
}
</style>