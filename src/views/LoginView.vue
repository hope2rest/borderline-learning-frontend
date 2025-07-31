<template>
  <div class="login-page">
    <!-- 토스 스타일 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 15" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="main-container">
      <div class="login-card" :class="{ 'animate-in': showCard }">
        <!-- 헤더 -->
        <div class="card-header">
          <div class="logo-section">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="35" fill="url(#loginLogoGradient)" />
                <path d="M25 40L35 50L55 30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <defs>
                  <linearGradient id="loginLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0064FF;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0047B3;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="service-title">학습 지원 서비스</h1>
          </div>
          <p class="subtitle">사용자를 선택해주세요</p>
        </div>

        <!-- 사용자 목록 -->
        <div class="user-list">
          <div 
            v-for="(user, index) in mockUsers" 
            :key="user.id"
            :class="{ 'animate-in': showUsers }"
            :style="{ 'animation-delay': `${index * 100}ms` }"
            class="user-item"
            @click="handleLogin(user.id)"
          >
            <div class="user-content">
              <div class="user-avatar">
                <div class="avatar-icon" :class="getRoleClass(user.role)">
                  <component :is="getRoleIcon(user.role)" />
                </div>
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <p class="user-role">{{ getRoleText(user.role) }}</p>
                <div class="user-badge">
                  <span class="badge-text">{{ getRoleBadge(user.role) }}</span>
                </div>
              </div>
              <div class="user-action">
                <div class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="card-footer" :class="{ 'animate-in': showFooter }">
          <div class="version-info">
            <span class="version-tag">MVP v1.0</span>
            <span class="demo-text">데모 버전</span>
          </div>
          <button class="back-button" @click="goToUserSelection">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            역할 선택으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { mockUsers } from '../stores/mockData.js'

const router = useRouter()
const authStore = useAuthStore()

// 애니메이션 상태
const showCard = ref(false)
const showUsers = ref(false)
const showFooter = ref(false)

onMounted(() => {
  startAnimations()
})

const startAnimations = () => {
  setTimeout(() => showCard.value = true, 100)
  setTimeout(() => showUsers.value = true, 400)
  setTimeout(() => showFooter.value = true, 800)
}

function handleLogin(userId) {
  authStore.login(userId)
  router.push('/dashboard')
}

function goToUserSelection() {
  router.push('/user-selection')
}

function getRoleText(role) {
  const roleMap = {
    'student': '학습자',
    'instructor': '선생님', 
    'admin': '관리자'
  }
  return roleMap[role] || role
}

function getRoleBadge(role) {
  const badgeMap = {
    'student': '개인 맞춤',
    'instructor': '교육 관리',
    'admin': '시스템 관리'
  }
  return badgeMap[role] || '사용자'
}

function getRoleClass(role) {
  const classMap = {
    'student': 'student-avatar',
    'instructor': 'instructor-avatar', 
    'admin': 'admin-avatar'
  }
  return classMap[role] || 'default-avatar'
}

function getRoleIcon(role) {
  const icons = {
    'student': () => h('svg', { 
      width: '20', height: '20', viewBox: '0 0 24 24', 
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2' 
    }, [
      h('path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z' })
    ]),
    'instructor': () => h('svg', {
      width: '20', height: '20', viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2'
    }, [
      h('path', { d: 'M22 10v6M2 10l10-5 10 5-10 5z' }),
      h('path', { d: 'M6 12v5c3 3 9 3 12 0v-5' })
    ]),
    'admin': () => h('svg', {
      width: '20', height: '20', viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2'
    }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ])
  }
  return icons[role] || icons['student']
}

function getFloatingStyle(index) {
  const size = Math.random() * 8 + 4
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 20
  const duration = Math.random() * 10 + 10
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

/* 배경 */
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float-around infinite linear;
}

/* 메인 컨테이너 */
.main-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-card.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 헤더 */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo-icon {
  animation: logo-pulse 2s ease-in-out infinite;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* 사용자 목록 */
.user-list {
  margin-bottom: 2rem;
}

.user-item {
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-item.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.user-content {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.user-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #0064FF;
}

.user-content:active {
  transform: translateY(0) scale(0.98);
}

.user-avatar {
  margin-right: 1rem;
}

.avatar-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.student-avatar {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.instructor-avatar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.admin-avatar {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.user-role {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.user-badge {
  display: inline-block;
}

.badge-text {
  background: rgba(0, 100, 255, 0.1);
  color: #0064FF;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.user-action {
  margin-left: 1rem;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.3s ease;
}

.user-content:hover .action-icon {
  background: #0064FF;
  color: white;
}

/* 푸터 */
.card-footer {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.card-footer.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.version-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.version-tag {
  background: #0064FF;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.demo-text {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  border-color: #0064FF;
  color: #0064FF;
  background: rgba(0, 100, 255, 0.05);
}

/* 애니메이션 */
@keyframes float-around {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0px) rotate(360deg);
    opacity: 0.3;
  }
}

@keyframes logo-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 반응형 */
@media (max-width: 640px) {
  .main-container {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .user-content {
    padding: 1rem;
  }

  .user-avatar {
    margin-right: 0.75rem;
  }

  .avatar-icon {
    width: 40px;
    height: 40px;
  }

  .service-title {
    font-size: 1.25rem;
  }

  .user-name {
    font-size: 1rem;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .login-card,
  .user-item,
  .card-footer {
    transition: none;
  }

  .floating-element,
  .logo-icon {
    animation: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .login-card {
    background: white;
    border: 2px solid black;
  }

  .user-content {
    border: 2px solid black;
  }

  .back-button {
    border: 2px solid black;
  }
}
</style>