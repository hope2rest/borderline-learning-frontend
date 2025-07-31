<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { initTossDesignSystem } from './design-system'

// 토스 디자인 시스템 초기화
onMounted(() => {
  initTossDesignSystem()
})
</script>

<template>
  <div id="app" class="app-container">
    <!-- 토스 스타일 페이지 전환 애니메이션 -->
    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="getTransitionName(route)"
        mode="out-in"
        appear
      >
        <component 
          :is="Component" 
          :key="route.path"
          class="page-container"
        />
      </Transition>
    </RouterView>
  </div>
</template>

<script>
export default {
  methods: {
    getTransitionName(route) {
      // 페이지별 트랜지션 설정
      const transitionMap = {
        '/': 'toss-fade',
        '/login': 'toss-slide-right',
        '/dashboard': 'toss-slide-left',
        '/quiz': 'toss-slide-up',
      }
      
      return transitionMap[route.path] || 'toss-fade'
    }
  }
}
</script>

<style>
/* 전역 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.page-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* 토스 스타일 트랜지션 애니메이션 */

/* 페이드 트랜지션 */
.toss-fade-enter-active,
.toss-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.toss-fade-enter-from,
.toss-fade-leave-to {
  opacity: 0;
}

/* 슬라이드 오른쪽 트랜지션 */
.toss-slide-right-enter-active,
.toss-slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toss-slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toss-slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 슬라이드 왼쪽 트랜지션 */
.toss-slide-left-enter-active,
.toss-slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toss-slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.toss-slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 슬라이드 업 트랜지션 */
.toss-slide-up-enter-active,
.toss-slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toss-slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toss-slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 스케일 트랜지션 */
.toss-scale-enter-active,
.toss-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toss-scale-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.toss-scale-leave-to {
  transform: scale(1.05);
  opacity: 0;
}

/* 토스 스타일 글로벌 유틸리티 */
.toss-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.toss-section {
  padding: 3rem 0;
}

.toss-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.toss-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toss-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.toss-button:active {
  transform: scale(0.95);
}

.toss-button--primary {
  background: #0064FF;
  color: white;
}

.toss-button--primary:hover {
  background: #0056E0;
}

.toss-button--secondary {
  background: #F8F9FA;
  color: #495057;
}

.toss-button--secondary:hover {
  background: #E9ECEF;
}

/* 토스 스타일 텍스트 유틸리티 */
.toss-text--primary {
  color: #0064FF;
}

.toss-text--secondary {
  color: #6C757D;
}

.toss-text--success {
  color: #28A745;
}

.toss-text--warning {
  color: #FFC107;
}

.toss-text--error {
  color: #DC3545;
}

/* 토스 스타일 배경 유틸리티 */
.toss-bg--primary {
  background: linear-gradient(135deg, #0064FF 0%, #0047B3 100%);
}

.toss-bg--light {
  background: #F8F9FA;
}

.toss-bg--white {
  background: white;
}

/* 반응형 유틸리티 */
@media (max-width: 768px) {
  .toss-container {
    padding: 0 0.5rem;
  }
  
  .toss-section {
    padding: 2rem 0;
  }
  
  .toss-button {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .toss-fade-enter-active,
  .toss-fade-leave-active,
  .toss-slide-right-enter-active,
  .toss-slide-right-leave-active,
  .toss-slide-left-enter-active,
  .toss-slide-left-leave-active,
  .toss-slide-up-enter-active,
  .toss-slide-up-leave-active,
  .toss-scale-enter-active,
  .toss-scale-leave-active {
    transition: none !important;
  }
  
  .toss-card,
  .toss-button {
    transition: none !important;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .toss-button--primary {
    background: #000080;
    border: 2px solid #000080;
  }
  
  .toss-button--secondary {
    background: #FFFFFF;
    border: 2px solid #000000;
    color: #000000;
  }
  
  .toss-card {
    border: 1px solid #000000;
  }
}

/* 다크 모드 준비 */
@media (prefers-color-scheme: dark) {
  .toss-bg--light {
    background: #1A1A1A;
    color: #FFFFFF;
  }
  
  .toss-bg--white {
    background: #2A2A2A;
    color: #FFFFFF;
  }
  
  .toss-card {
    background: #2A2A2A;
    color: #FFFFFF;
  }
  
  .toss-text--secondary {
    color: #A0A0A0;
  }
}

/* 로딩 상태 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E9ECEF;
  border-top: 3px solid #0064FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #F8F9FA;
}

::-webkit-scrollbar-thumb {
  background: #DEE2E6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ADB5BD;
}

/* 선택 텍스트 스타일 */
::selection {
  background: rgba(0, 100, 255, 0.2);
  color: inherit;
}

::-moz-selection {
  background: rgba(0, 100, 255, 0.2);
  color: inherit;
}
</style>
