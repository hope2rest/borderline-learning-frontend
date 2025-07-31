<template>
  <div class="teacher-main-page">
    <!-- 토스 스타일 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 10" :key="i" class="floating-element"></div>
      </div>
    </div>

    <!-- 헤더 -->
    <header class="page-header">
      <div class="header-content">
        <div class="user-section">
          <div class="chick-mascot">
            <div class="chick-body">🐣</div>
            <div class="chick-glasses">👓</div>
          </div>
          <div class="user-info">
            <h1 class="user-name">선생님</h1>
            <p class="user-greeting">함께 가르쳐요! 📚✨</p>
          </div>
        </div>
        <button class="logout-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          나가기
        </button>
      </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="main-content">
      <div>Test content</div>
    </main>
  </div>
</template>

<script setup>
</script>