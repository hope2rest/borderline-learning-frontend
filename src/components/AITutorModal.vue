<template>
  <div v-if="show" class="ai-tutor-modal-overlay" @click="closeModal">
    <div class="ai-tutor-modal" @click.stop>
      <div class="modal-header">
        <div class="tutor-info">
          <div class="tutor-avatar">🤖</div>
          <div class="tutor-details">
            <h3 class="tutor-name">AI 튜터</h3>
            <p class="tutor-subtitle">{{ userName }}와 함께하는 학습 도우미</p>
          </div>
        </div>
        <button @click="closeModal" class="close-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <div class="chat-messages" ref="chatMessages">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message-wrapper"
            :class="{ 'user-wrapper': message.role === 'user', 'ai-wrapper': message.role === 'assistant' }"
          >
            <div class="message-bubble" :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'assistant' }">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          <div v-if="isLoading" class="message-wrapper ai-wrapper">
            <div class="message-bubble ai-message typing">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 제안 버튼들 -->
        <div v-if="showSuggestions && !isLoading" class="suggestions-container">
          <div class="suggestions-grid">
            <button 
              v-for="suggestion in currentSuggestions" 
              :key="suggestion.id"
              @click="selectSuggestion(suggestion.text)"
              class="suggestion-button"
            >
              <span class="suggestion-icon">{{ suggestion.icon }}</span>
              <span class="suggestion-text">{{ suggestion.text }}</span>
            </button>
          </div>
        </div>

        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <textarea
              v-model="currentMessage"
              @keydown.enter="handleEnterKey"
              :disabled="isLoading"
              placeholder="궁금한 것을 물어보세요..."
              class="chat-input"
              rows="1"
              ref="chatInput"
            ></textarea>
            <button 
              @click="sendMessage" 
              :disabled="!currentMessage.trim() || isLoading"
              class="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue';

// Props
const props = defineProps<{
  show: boolean;
  userName: string;
}>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// 상태
const messages = ref([]);
const currentMessage = ref('');
const isLoading = ref(false);
const showSuggestions = ref(false);
const conversationStage = ref('initial'); // initial, condition_check, learning_help
const chatMessages = ref(null);

// 대화 단계별 제안사항
const suggestionsByStage = {
  initial: [
    { id: 1, icon: '😊', text: '좋아요!' },
    { id: 2, icon: '😐', text: '그냥 그래요' },
    { id: 3, icon: '😔', text: '좀 힘들어요' },
    { id: 4, icon: '🤔', text: '직접 말할래요' }
  ],
  condition_good: [
    { id: 1, icon: '📚', text: '새로운 걸 배우고 싶어요' },
    { id: 2, icon: '🎯', text: '퀴즈를 더 풀고 싶어요' },
    { id: 3, icon: '❓', text: '궁금한 게 있어요' },
    { id: 4, icon: '😊', text: '그냥 얘기하고 싶어요' }
  ],
  condition_normal: [
    { id: 1, icon: '💪', text: '힘을 내고 싶어요' },
    { id: 2, icon: '🎮', text: '재미있는 걸 하고 싶어요' },
    { id: 3, icon: '❓', text: '모르는 게 있어요' },
    { id: 4, icon: '😊', text: '그냥 얘기하고 싶어요' }
  ],
  condition_hard: [
    { id: 1, icon: '🤗', text: '도움이 필요해요' },
    { id: 2, icon: '📖', text: '쉬운 것부터 해볼래요' },
    { id: 3, icon: '❓', text: '어려운 게 있어요' },
    { id: 4, icon: '😊', text: '기분 전환하고 싶어요' }
  ],
  learning_help: [
    { id: 1, icon: '📚', text: '국어가 어려워요' },
    { id: 2, icon: '🔢', text: '수학이 어려워요' },
    { id: 3, icon: '🌍', text: '영어가 어려워요' },
    { id: 4, icon: '💡', text: '다른 걸 물어볼래요' }
  ]
};

const currentSuggestions = ref(suggestionsByStage.initial);

// 메시지 전송
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;
  
  const userMessage = {
    role: 'user',
    content: currentMessage.value,
    timestamp: Date.now()
  };
  
  messages.value.push(userMessage);
  const messageText = currentMessage.value;
  currentMessage.value = '';
  isLoading.value = true;
  showSuggestions.value = false;
  
  await nextTick();
  scrollToBottom();
  
  try {
    // AI 응답 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiResponse = getAIResponse(messageText);
    messages.value.push({
      role: 'assistant',
      content: aiResponse.message,
      timestamp: Date.now()
    });
    
    // 대화 단계 업데이트
    if (aiResponse.nextStage) {
      conversationStage.value = aiResponse.nextStage;
      currentSuggestions.value = suggestionsByStage[aiResponse.nextStage];
      showSuggestions.value = true;
    }
    
    await nextTick();
    scrollToBottom();
    
  } catch (error) {
    console.error('메시지 전송 오류:', error);
  } finally {
    isLoading.value = false;
  }
};

// AI 응답 생성
const getAIResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  if (conversationStage.value === 'initial') {
    if (lowerMessage.includes('좋아') || lowerMessage.includes('좋아요')) {
      return {
        message: '와! 좋은 컨디션이네요! 😊 오늘 뭔가 특별한 걸 배워보고 싶지 않나요?',
        nextStage: 'condition_good'
      };
    } else if (lowerMessage.includes('그냥') || lowerMessage.includes('그래요')) {
      return {
        message: '그렇구나! 보통의 하루였네요. 😊 뭔가 재미있는 걸 해서 기분을 좋게 만들어볼까요?',
        nextStage: 'condition_normal'
      };
    } else if (lowerMessage.includes('힘들') || lowerMessage.includes('어려')) {
      return {
        message: '힘든 하루였구나... 😔 괜찮아요! 제가 도와드릴게요. 어떤 부분이 어려우셨나요?',
        nextStage: 'condition_hard'
      };
    } else {
      return {
        message: '말씀해주세요! 무엇이든 들어드릴게요. 😊',
        nextStage: 'learning_help'
      };
    }
  } else if (conversationStage.value === 'condition_good') {
    if (lowerMessage.includes('배우')) {
      return {
        message: '훌륭해요! 🎯 새로운 걸 배우고 싶어하는 마음이 정말 좋아요. 어떤 과목에 관심이 있나요?',
        nextStage: 'learning_help'
      };
    } else if (lowerMessage.includes('퀴즈')) {
      return {
        message: '퀴즈 좋아하는구나! 📝 지금 풀 수 있는 퀴즈들이 많이 있어요. 어떤 과목 퀴즈를 해볼까요?',
        nextStage: 'learning_help'
      };
    }
  } else if (conversationStage.value === 'condition_normal') {
    if (lowerMessage.includes('재미있')) {
      return {
        message: '재미있는 걸 찾고 있구나! 🎮 게임처럼 재미있는 퀴즈나 학습 활동을 해볼까요?',
        nextStage: 'learning_help'
      };
    }
  } else if (conversationStage.value === 'condition_hard') {
    if (lowerMessage.includes('도움')) {
      return {
        message: '물론이죠! 😊 제가 항상 도와드릴게요. 어떤 부분이 어려우신지 알려주세요.',
        nextStage: 'learning_help'
      };
    }
  } else if (conversationStage.value === 'learning_help') {
    if (lowerMessage.includes('국어')) {
      return {
        message: '국어 공부하고 계시는군요! 📚 국어 퀴즈를 풀어보거나 읽기 연습을 해보면 어떨까요? 지금 국어 퀴즈가 준비되어 있어요!',
        nextStage: null
      };
    } else if (lowerMessage.includes('수학')) {
      return {
        message: '수학이 어려우시죠? 🔢 괜찮아요! 숫자 세기부터 차근차근 해보면 됩니다. 수학 퀴즈로 연습해볼까요?',
        nextStage: null
      };
    } else if (lowerMessage.includes('영어')) {
      return {
        message: '영어 공부 중이시군요! 🌍 영어 단어를 익히는 퀴즈가 있어요. 재미있게 배울 수 있을 거예요!',
        nextStage: null
      };
    }
  }
  
  return {
    message: '궁금한 게 더 있으면 언제든 물어보세요! 😊 항상 도와드릴게요.',
    nextStage: null
  };
};

// 제안 선택
const selectSuggestion = (text: string) => {
  currentMessage.value = text;
  sendMessage();
};

// 엔터키 처리
const handleEnterKey = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 시간 포맷팅
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 스크롤 관리
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// 모달 닫기
const closeModal = () => {
  emit('close');
};

// 초기 AI 인사
const startConversation = () => {
  messages.value = [{
    role: 'assistant',
    content: `${props.userName}야 안녕! 😊 오늘 컨디션은 어때?`,
    timestamp: Date.now()
  }];
  showSuggestions.value = true;
  
  nextTick(() => {
    scrollToBottom();
  });
};

// 모달이 열릴 때마다 대화 시작
watch(() => props.show, (newShow) => {
  if (newShow) {
    setTimeout(() => {
      startConversation();
    }, 300);
  }
});
</script>

<style scoped>
.ai-tutor-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ai-tutor-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tutor-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tutor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
}

.tutor-details {
  display: flex;
  flex-direction: column;
}

.tutor-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.tutor-subtitle {
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: calc(80vh - 120px);
  max-height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.user-wrapper {
  justify-content: flex-end;
}

.ai-wrapper {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 0.875rem 1.125rem;
  border-radius: 18px;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.ai-message {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  border-bottom-left-radius: 6px;
}

.message-content {
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.ai-message .message-time {
  color: #9ca3af;
}

.typing {
  background: white !important;
  border: 1px solid #e5e7eb !important;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.suggestions-container {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.suggestion-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  text-align: left;
}

.suggestion-button:hover {
  background: #f3f4f6;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.suggestion-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.suggestion-text {
  color: #374151;
  font-weight: 500;
}

.chat-input-container {
  padding: 1rem 1.5rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.chat-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  resize: none;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  max-height: 100px;
  min-height: 44px;
  transition: all 0.3s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .ai-tutor-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .chat-messages {
    padding: 1rem;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .suggestion-button {
    font-size: 0.8rem;
    padding: 0.625rem 0.875rem;
  }
  
  .chat-input-container {
    padding: 1rem;
  }
}
</style>