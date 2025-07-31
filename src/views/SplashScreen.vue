<template>
  <div class="splash-screen">
    <!-- 배경 그라데이션 -->
    <div class="splash-background">
      <div class="gradient-overlay"></div>
      <div class="animated-particles">
        <div 
          v-for="i in 20" 
          :key="i" 
          class="particle"
          :style="{ 
            '--delay': `${i * 0.1}s`,
            '--duration': `${2 + Math.random() * 3}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`
          }"
        ></div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="splash-content">
      <!-- 로고 섹션 -->
      <div class="logo-section">
        <div class="logo-container" :class="{ 'animate-in': showLogo }">
          <div class="main-logo">
            <img 
              src="/images/logo-character.png" 
              alt="이음 캐릭터 로고" 
              class="character-logo" 
              :class="{ 'bounce': showLogo }"
            >
          </div>
        </div>
      </div>

      <!-- 로딩 인디케이터 -->
      <div class="loading-section" :class="{ 'animate-in': showLoading }">
        <p class="loading-text">{{ loadingText }}</p>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="provider-section">
          <span class="powered-by">Powered by</span>
          <img 
            src="/images/logo-text.png" 
            alt="이음" 
            class="provider-logo"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 애니메이션 상태
const showLogo = ref(false);
const showSubtitle = ref(false);
const showLoading = ref(false);

// 로딩 상태
const progress = ref(0);
const loadingText = ref('시스템 초기화 중...');

// 로고 이미지 상태
const logoExists = ref(true);
const logoUrl = ref('/src/assets/images/logo/logo.png');

// 로고 이미지 에러 처리
const handleLogoError = () => {
  logoExists.value = false;
};

// 유머러스한 로딩 텍스트 배열
const loadingTexts = [
  '수달이 물구나무서기 연습 중..',
  '똑똑한 아이디어를 모으는 중...',
  '재미있는 퀴즈를 준비하는 중....',
  '수달이 손뼉치며 응원하는 중...',
  '공부할 준비 끝..!'
];

onMounted(() => {
  startSplashSequence();
});

const startSplashSequence = () => {
  // 애니메이션 시퀀스
  setTimeout(() => {
    showLogo.value = true;
  }, 300);

  setTimeout(() => {
    showSubtitle.value = true;
  }, 800);

  setTimeout(() => {
    showLoading.value = true;
    startProgressAnimation();
  }, 1300);

};

const startProgressAnimation = () => {
  let currentProgress = 0;
  let textIndex = 0;
  
  const progressInterval = setInterval(() => {
    currentProgress += Math.random() * 8 + 2;
    
    if (currentProgress >= 100) {
      currentProgress = 100;
      progress.value = currentProgress;
      loadingText.value = loadingTexts[loadingTexts.length - 1];
      clearInterval(progressInterval);
      
      // 완료 후 사용자 선택 페이지로 이동
      setTimeout(() => {
        router.push('/user-selection');
      }, 1000);
    } else {
      progress.value = currentProgress;
      
      // 로딩 텍스트 변경
      if (currentProgress > 18 && textIndex < 1) {
        textIndex = 1;
        loadingText.value = loadingTexts[textIndex];
      } else if (currentProgress > 36 && textIndex < 2) {
        textIndex = 2;
        loadingText.value = loadingTexts[textIndex];
      } else if (currentProgress > 60 && textIndex < 3) {
        textIndex = 3;
        loadingText.value = loadingTexts[textIndex];
      } else if (currentProgress > 80 && textIndex < 4) {
        textIndex = 4;
        loadingText.value = loadingTexts[textIndex];
      }
    }
  }, 250);
};
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 배경 그라데이션 */
.splash-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #87ceeb 0%, #b6d7ff 25%, #ddeeff 50%, #f0f8ff 75%, #e6f3ff 100%);
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
  animation: gradient-shift 8s ease-in-out infinite;
}

/* 애니메이션 파티클 */
.animated-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: var(--y);
}

/* 메인 컨텐츠 */
.splash-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 2rem;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 병아리 마스코트 섹션 */
.logo-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo-container.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.main-logo {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  animation: logo-float 3s ease-in-out infinite;
}

.character-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  transform: scale(0);
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

.character-logo.bounce {
  transform: scale(1);
  animation: logo-bounce 2s ease-in-out infinite 1s;
}


/* 로딩 섹션 */
.loading-section {
  position: absolute;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
  text-align: center;
}

.loading-section.animate-in {
  opacity: 1;
}

.provider-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0 0 0;
}

.powered-by {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4a5568;
  text-shadow: 
    -1px -1px 0px #ffffff,
    1px -1px 0px #ffffff,
    -1px 1px 0px #ffffff,
    1px 1px 0px #ffffff,
    0px -1px 0px #ffffff,
    -1px 0px 0px #ffffff,
    1px 0px 0px #ffffff,
    0px 1px 0px #ffffff;
  letter-spacing: 0.02em;
}

.provider-logo {
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.loading-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #4299e1 0%, #3182ce 100%);
  border-radius: 2px;
  transition: width 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

.loading-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%);
  animation: slide-wave 1.5s infinite;
}

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #2d3748;
  min-height: 1.25rem;
  text-shadow: 
    -1px -1px 0px #ffffff,
    1px -1px 0px #ffffff,
    -1px 1px 0px #ffffff,
    1px 1px 0px #ffffff,
    0px -1px 0px #ffffff,
    -1px 0px 0px #ffffff,
    1px 0px 0px #ffffff,
    0px 1px 0px #ffffff;
}


/* 키프레임 애니메이션 */
@keyframes gradient-shift {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(5px) translateY(-5px);
  }
  50% {
    transform: translateX(-5px) translateY(5px);
  }
  75% {
    transform: translateX(5px) translateY(5px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

@keyframes logo-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes logo-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slide-wave {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .splash-content {
    padding: 0 1rem;
  }

  .brand-name {
    font-size: 2rem;
  }

  .service-name {
    font-size: 1rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .tagline {
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 1.75rem;
  }

  .service-name {
    font-size: 0.875rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .tagline {
    flex-direction: column;
    align-items: center;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .logo-container,
  .subtitle-section,
  .loading-section,
  .splash-footer {
    transition: none;
  }
  
  .gradient-overlay,
  .particle,
  .logo-icon,
  .loading-progress::after {
    animation: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .splash-background {
    background: #000080;
  }
  
  .tag {
    background: rgba(255, 255, 255, 0.9);
    color: #000080;
  }
}
</style>