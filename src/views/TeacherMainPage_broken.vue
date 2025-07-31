<template>
  <div class="teacher-main-page">
    <!-- 토스 스타일 배경 -->
    <div class="background-container">
      <div class="background-gradient"></div>
      <div class="floating-elements">
        <div v-for="i in 10" :key="i" class="floating-element" :style="getFloatingStyle(i)"></div>
      </div>
    </div>

    <!-- 헤더 -->
    <header class="page-header" :class="{ 'animate-in': showHeader }">
      <div class="header-content">
        <div class="user-section">
          <div class="chick-mascot">
            <div class="chick-body">🐣</div>
            <div class="chick-glasses">👓</div>
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ authStore.currentUser?.username || '선생님' }}님</h1>
            <p class="user-greeting">함께 가르쳐요! 📚✨</p>
          </div>
        </div>
        <button @click="handleLogout" class="logout-button">
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
      <!-- 상단: 학습 자료 업로드 블록 -->
      <div class="top-section">
        <div class="upload-section" :class="{ 'animate-in': showUpload }">
          <div class="card upload-card">
            <div class="card-header">
              <div class="card-icon upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📚 학습 자료 업로드</h2>
                <p class="card-subtitle">AI가 자동으로 요약을 생성합니다</p>
              </div>
            </div>

            <form @submit.prevent="uploadMaterial" class="upload-form">
              <div class="form-group">
                <label class="form-label">제목 (기간_대상_수준_내용)</label>
                <input 
                  v-model="materialForm.title"
                  type="text" 
                  class="form-input"
                  placeholder="예: 1주차_초등3학년_기초_수와연산"
                  required
                >
                <div class="form-help">기간, 대상, 수준, 내용 순으로 입력해주세요</div>
              </div>
              <div class="form-group">
                <label class="form-label">메인 키워드</label>
                <select 
                  v-model="materialForm.mainKeyword"
                  class="form-select"
                  required
                >
                  <option value="">메인 키워드를 선택하세요</option>
                  <option value="수학">수학</option>
                  <option value="국어">국어</option>
                  <option value="사회">사회</option>
                  <option value="과학">과학</option>
                  <option value="생활">생활</option>
                  <option value="예술">예술</option>
                  <option value="체육">체육</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">학습 키워드</label>
                <input 
                  v-model="materialForm.keywords"
                  type="text" 
                  class="form-input"
                  placeholder="핵심개념, 기초원리, 단계별학습, 실생활응용 (쉼표로 구분)"
                  required
                >
                <div class="form-help">AI가 자료를 요약할 때 참고할 키워드를 입력해주세요</div>
              </div>
              <div class="form-group">
                <label class="form-label">참고 사항</label>
                <textarea 
                  v-model="materialForm.notes"
                  class="form-textarea"
                  placeholder="자료에 대한 추가 참고사항이나 특이사항을 입력하세요"
                  rows="3"
                ></textarea>
                <div class="form-help">자료 요약 시 참고할 추가 정보를 입력해주세요 (선택사항)</div>
              </div>
              <div class="form-group">
                <label class="form-label">PDF 파일</label>
                <div class="file-upload-container">
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept=".pdf"
                    @change="handleFileSelect"
                    class="file-input"
                    required
                  >
                  <div class="file-upload-area" @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleFileDrop">
                    <div v-if="!selectedFile" class="upload-placeholder">
                      <div class="upload-icon">📄</div>
                      <div class="upload-text">
                        <div class="upload-main">PDF 파일을 드래그하거나 클릭하여 선택</div>
                        <div class="upload-sub">최대 10MB까지 업로드 가능</div>
                      </div>
                    </div>
                    <div v-else class="file-selected">
                      <div class="file-icon">📄</div>
                      <div class="file-info">
                        <div class="file-name">{{ selectedFile.name }}</div>
                        <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                      </div>
                      <button type="button" @click.stop="removeFile" class="remove-file">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                :disabled="uploading"
                class="upload-button"
              >
                <div v-if="uploading" class="loading-spinner"></div>
                <span>{{ uploading ? '업로드 중...' : '자료 업로드' }}</span>
                <svg v-if="!uploading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>

            <!-- AI 요약 결과 -->
            <div v-if="aiSummary" class="ai-summary">
              <div class="summary-header">
                <div class="summary-icon">🤖</div>
                <h3 class="summary-title">AI 요약</h3>
              </div>
              <div class="summary-content">{{ aiSummary }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단: 담당 학생 관리 & 생성된 문제 관리 -->
      <div class="bottom-section">
        <!-- 담당 학생 관리 블록 -->
        <div class="student-management-section" :class="{ 'animate-in': showStudents }">
          <div class="card student-card">
            <div class="card-header">
              <div class="card-icon student-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">👥 담당 학생 관리</h2>
                <p class="card-subtitle">{{ students.length }}명의 학생을 관리 중</p>
              </div>
            </div>

            <!-- 학생 관리 액션 버튼들 -->
            <div class="management-actions">
              <button @click="addStudent" class="action-btn add-btn" title="학생 추가">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                추가
              </button>
              <button @click="editStudent" class="action-btn edit-btn" title="학생 수정">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                수정
              </button>
              <button @click="deleteStudent" class="action-btn delete-btn" title="학생 삭제">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                삭제
              </button>
            </div>

            <!-- 학생 목록 (스크롤 가능) -->
            <div class="students-list-container">
              <div v-if="students.length === 0" class="empty-state">
                <div class="empty-icon">👤</div>
                <p class="empty-text">등록된 학생이 없습니다.</p>
                <p class="empty-subtext">학생 추가 버튼을 눌러 학생을 등록해보세요!</p>
              </div>
              <div v-else class="students-list">
                <div 
                  v-for="(student, index) in students" 
                  :key="student.id"
                  :class="['student-item', { 'selected': selectedStudentId === student.id }]"
                  @click="selectStudent(student.id)"
                >
                  <div class="student-avatar">
                    <span class="student-initial">{{ student.name.charAt(0) }}</span>
                  </div>
                  <div class="student-info">
                    <div class="student-name">{{ student.name }}</div>
                    <div class="student-grade">{{ student.grade }}</div>
                  </div>
                  <div class="student-progress">
                    <div class="progress-text">{{ student.progress }}%</div>
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: student.progress + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 생성된 문제 관리 블록 -->
        <div class="problem-management-section" :class="{ 'animate-in': showProblems }">
          <div class="card problem-card">
            <div class="card-header">
              <div class="card-icon problem-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M13 7h6l2 5-2 5H9l-2-5 2-5"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">❓ 생성된 문제 관리</h2>
                <p class="card-subtitle">{{ problems.length }}개의 문제를 관리 중</p>
              </div>
            </div>

            <!-- 문제 관리 액션 버튼들 -->
            <div class="management-actions">
              <button @click="addProblem" class="action-btn add-btn" title="문제 추가">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                추가
              </button>
              <button @click="editProblem" class="action-btn edit-btn" title="문제 수정">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                수정
              </button>
              <button @click="deleteProblem" class="action-btn delete-btn" title="문제 삭제">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                삭제
              </button>
            </div>

            <!-- 문제 목록 (스크롤 가능) -->
            <div class="problems-list-container">
              <div v-if="problems.length === 0" class="empty-state">
                <div class="empty-icon">❓</div>
                <p class="empty-text">생성된 문제가 없습니다.</p>
                <p class="empty-subtext">학습 자료를 업로드하면 자동으로 문제가 생성됩니다!</p>
              </div>
              <div v-else class="problems-list">
                <div 
                  v-for="(problem, index) in problems" 
                  :key="problem.id"
                  :class="['problem-item', { 'selected': selectedProblemId === problem.id }]"
                  @click="selectProblem(problem.id)"
                >
                  <div class="problem-type-icon">
                    <span class="problem-type">{{ getProblemTypeIcon(problem.type) }}</span>
                  </div>
                  <div class="problem-info">
                    <div class="problem-title">{{ problem.title }}</div>
                    <div class="problem-meta">
                      <span class="problem-subject">{{ problem.subject }}</span>
                      <span class="problem-separator">•</span>
                      <span class="problem-difficulty">{{ problem.difficulty }}</span>
                    </div>
                  </div>
                  <div class="problem-status">
                    <div :class="['status-badge', problem.status]">
                      {{ getProblemStatusText(problem.status) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 기존 업로드된 자료 목록 (제거 예정이지만 일단 유지) -->
        <div class="materials-section" :class="{ 'animate-in': showMaterials }">
          <div class="card materials-card">
            <div class="card-header">
              <div class="card-icon materials-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📋 업로드된 자료</h2>
                <p class="card-subtitle">{{ filteredMaterials.length }}개의 자료 ({{ selectedKeywordFilter === 'all' ? '전체' : selectedKeywordFilter }})</p>
              </div>
            </div>

            <!-- 키워드 필터 -->
            <div class="materials-filter">
              <div class="filter-header">
                <h4 class="filter-title">📂 메인 키워드별 분류</h4>
              </div>
              <div class="filter-tabs">
                <button 
                  v-for="keyword in availableKeywords" 
                  :key="keyword"
                  @click="setKeywordFilter(keyword)"
                  :class="['filter-tab', { 'active': selectedKeywordFilter === keyword }]"
                >
                  {{ keyword === 'all' ? '전체' : keyword }}
                  <span class="filter-count">({{ getMaterialCountByKeyword(keyword) }})</span>
                </button>
              </div>
            </div>

            <div v-if="recentMaterials.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <p class="empty-text">아직 업로드된 자료가 없습니다.</p>
              <p class="empty-subtext">위의 폼을 사용해서 첫 자료를 업로드해보세요!</p>
            </div>

            <div v-else class="materials-list">
              <div 
                v-for="material in filteredMaterials" 
                :key="material.date"
                class="material-item"
                @click="viewMaterialDetail(material)"
              >
                <div class="material-header">
                  <div class="material-icon">{{ material.icon }}</div>
                  <div class="material-info">
                    <div class="material-title">{{ material.title }}</div>
                    <div class="material-meta">
                      <span class="material-type">{{ getContentTypeText(material.contentType) }}</span>
                      <span class="material-separator">•</span>
                      <span class="material-date">{{ historyStore.formatDate(material.date) }}</span>
                    </div>
                  </div>
                  <div class="material-status">
                    <div class="status-badge api-used">
                      생성
                    </div>
                  </div>
                  <div class="material-actions">
                    <button @click.stop="editMaterial(material)" class="action-btn edit-btn" title="수정">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button @click.stop="deleteMaterial(material)" class="action-btn delete-btn" title="삭제">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                    <button @click.stop="viewMaterialDetail(material)" class="action-btn view-btn" title="상세보기">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- 키워드 표시 -->
                <div v-if="material.keywords" class="material-keywords">
                  <div class="keywords-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    학습 키워드:
                  </div>
                  <div class="keywords-list">
                    <span 
                      v-for="(keyword, index) in material.keywords.split(',')" 
                      :key="index"
                      class="keyword-tag"
                    >
                      {{ keyword.trim() }}
                    </span>
                  </div>
                </div>

                <!-- 요약 내용 표시 -->
                <div v-if="material.summary" class="material-summary">
                  <div class="summary-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    AI 요약:
                  </div>
                  <div class="summary-content">{{ material.summary }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 담당 학생 목록 -->
        <div class="students-section" :class="{ 'animate-in': showStudents }">
          <div class="card students-card">
            <div class="card-header">
              <div class="card-icon students-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">👥 담당 학생</h2>
                <p class="card-subtitle">학생들의 학습 현황을 확인하세요</p>
              </div>
              <div class="header-actions">
                <button @click="addNewStudent" class="add-student-button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  학생 추가
                </button>
                <button @click="refreshStudentData" class="refresh-button" :disabled="refreshing">
                  <svg v-if="!refreshing" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <div v-else class="loading-spinner small"></div>
                </button>
              </div>
            </div>

            <div class="students-list">
              <div 
                v-for="student in mockStudents" 
                :key="student.id"
                class="student-item"
              >
                <div class="student-avatar">{{ student.name.charAt(0) }}</div>
                <div class="student-info">
                  <div class="student-name">{{ student.name }}</div>
                  <div class="student-progress">
                    <span class="progress-label">최근 점수:</span>
                    <span class="progress-score" :class="getScoreColor(student.recentScore)">
                      {{ student.recentScore }}점
                    </span>
                  </div>
                  <div class="student-activity">
                    <span class="activity-label">마지막 활동:</span>
                    <span class="activity-time">{{ student.lastActivity }}</span>
                  </div>
                </div>
                <div class="student-actions">
                  <button @click.stop="editStudent(student)" class="action-btn edit-btn" title="수정">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button @click.stop="deleteStudent(student)" class="action-btn delete-btn" title="삭제">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                  <button @click.stop="assignQuizToStudent(student)" class="action-btn quiz-btn" title="문제 배정">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                  </button>
                  <button @click.stop="viewStudentDetail(student)" class="action-btn view-btn" title="상세보기">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 통계 요약 -->
        <div class="stats-section" :class="{ 'animate-in': showStats }">
          <div class="card stats-card">
            <div class="card-header">
              <div class="card-icon stats-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div class="card-title-section">
                <h2 class="card-title">📊 통계 요약</h2>
                <p class="card-subtitle">전체 활동 현황</p>
              </div>
            </div>

            <div class="duolingo-menu-grid">
              <div class="duolingo-menu-item" @click="showStatDetail('materials')">
                <div class="duolingo-menu-icon">📚</div>
                <div class="duolingo-menu-text">
                  <div class="duolingo-menu-title">업로드된 자료</div>
                  <div class="duolingo-menu-subtitle">{{ historyStore.materialStats.totalUploaded }}개</div>
                </div>
              </div>
              <div class="duolingo-menu-item" @click="showStatDetail('students')">
                <div class="duolingo-menu-icon">👥</div>
                <div class="duolingo-menu-text">
                  <div class="duolingo-menu-title">담당 학생</div>
                  <div class="duolingo-menu-subtitle">{{ mockStudents.length }}명</div>
                </div>
              </div>
              <div class="duolingo-menu-item" @click="showStatDetail('scores')">
                <div class="duolingo-menu-icon">⭐</div>
                <div class="duolingo-menu-text">
                  <div class="duolingo-menu-title">평균 점수</div>
                  <div class="duolingo-menu-subtitle">{{ Math.round(averageStudentScore) }}점</div>
                </div>
              </div>
              <div class="duolingo-menu-item" @click="showStatDetail('activity')">
                <div class="duolingo-menu-icon">🟢</div>
                <div class="duolingo-menu-text">
                  <div class="duolingo-menu-title">활성 학생</div>
                  <div class="duolingo-menu-subtitle">{{ activeStudentsCount }}명</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- API 키 필요 알림 모달 -->
    <div v-if="showApiModal" class="modal-overlay" @click="closeApiModal">
      <div class="api-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">🔑</div>
          <h3 class="modal-title">API 키 확인 중</h3>
        </div>
        <div class="modal-content">
          <p class="modal-description">
            Google Gemini API 키를 확인하고 있습니다. API 키가 설정되지 않았거나 유효하지 않은 경우 데모 모드로 진행됩니다.
          </p>
          <div class="modal-features">
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <span>실시간 AI 요약</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📝</span>
              <span>맞춤형 학습 자료 분석</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span>빠른 콘텐츠 처리</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="openApiDocs" class="primary-button">
            API 키 발급받기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
          <button @click="continueWithDemo" class="secondary-button">
            데모로 계속하기
          </button>
        </div>
      </div>
    </div>

    <!-- 자료 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="edit-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon edit-icon">✏️</div>
          <div class="modal-title-section">
            <h3 class="modal-title">학습 자료 수정</h3>
            <p class="modal-subtitle">자료 정보를 수정할 수 있습니다</p>
          </div>
          <button @click="closeEditModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <form @submit.prevent="updateMaterial" class="edit-form">
            <div class="form-group">
              <label class="form-label">제목</label>
              <input 
                v-model="editForm.title"
                type="text" 
                class="form-input"
                placeholder="학습 자료 제목을 입력하세요"
                required
              >
            </div>
            <div class="form-group">
              <label class="form-label">학습 키워드</label>
              <input 
                v-model="editForm.keywords"
                type="text" 
                class="form-input"
                placeholder="핵심개념, 기초원리, 단계별학습, 실생활응용 (쉼표로 구분)"
                required
              >
              <div class="form-help">AI가 자료를 요약할 때 참고할 키워드를 입력해주세요</div>
            </div>
            <div class="form-group">
              <label class="form-label">AI 요약 내용</label>
              <textarea 
                v-model="editForm.summary"
                class="form-textarea"
                placeholder="AI 요약 내용을 직접 수정할 수 있습니다"
                rows="8"
              ></textarea>
              <div class="form-help">요약 내용을 직접 편집하거나, 키워드 변경 후 재생성할 수 있습니다</div>
            </div>
          </form>
        </div>

        <div class="modal-actions">
          <button @click="regenerateSummary" class="secondary-button" :disabled="regenerating">
            <div v-if="regenerating" class="loading-spinner small"></div>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            {{ regenerating ? '재생성 중...' : 'AI 요약 재생성' }}
          </button>
          <button @click="updateMaterial" class="primary-button" :disabled="updating">
            <div v-if="updating" class="loading-spinner small"></div>
            <span>{{ updating ? '저장 중...' : '저장' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 학생 상세 정보 모달 -->
    <div v-if="showStudentModal" class="modal-overlay" @click="closeStudentModal">
      <div class="student-modal" @click.stop>
        <div class="modal-header">
          <div class="student-modal-avatar">{{ selectedStudentDetail?.name?.charAt(0) || 'S' }}</div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ selectedStudentDetail?.name || '학생' }}님 상세 정보</h3>
            <p class="modal-subtitle">학습 현황 및 진도</p>
          </div>
          <button @click="closeStudentModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <!-- 기본 정보 -->
          <div class="info-section">
            <h4 class="section-title">📋 기본 정보</h4>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">이름</div>
                <div class="info-value">{{ selectedStudentDetail?.name }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">최근 점수</div>
                <div class="info-value" :class="getScoreColor(selectedStudentDetail?.recentScore)">
                  {{ selectedStudentDetail?.recentScore }}점
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">평균 점수</div>
                <div class="info-value">{{ selectedStudentDetail?.averageScore }}점</div>
              </div>
              <div class="info-item">
                <div class="info-label">총 퀴즈 수</div>
                <div class="info-value">{{ selectedStudentDetail?.totalQuizzes }}개</div>
              </div>
            </div>
          </div>

          <!-- 학습 활동 현황 -->
          <div class="activity-section">
            <h4 class="section-title">📊 학습 활동 현황</h4>
            <div class="activity-stats">
              <div class="activity-stat">
                <div class="stat-icon">📚</div>
                <div class="stat-content">
                  <div class="stat-value">{{ selectedStudentDetail?.weeklyQuizzes || 0 }}</div>
                  <div class="stat-label">이번 주 퀴즈</div>
                </div>
              </div>
              <div class="activity-stat">
                <div class="stat-icon">⏰</div>
                <div class="stat-content">
                  <div class="stat-value">{{ selectedStudentDetail?.studyTime || '2시간' }}</div>
                  <div class="stat-label">주간 학습시간</div>
                </div>
              </div>
              <div class="activity-stat">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                  <div class="stat-value">{{ Math.round((selectedStudentDetail?.recentScore || 0) / 100 * 100) }}%</div>
                  <div class="stat-label">정답률</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 최근 퀴즈 결과 -->
          <div class="quiz-results-section">
            <h4 class="section-title">🎯 최근 퀴즈 결과</h4>
            <div class="quiz-results-list">
              <div v-for="(result, index) in selectedStudentDetail?.recentQuizzes || mockQuizResults" 
                   :key="index" 
                   class="quiz-result-item">
                <div class="quiz-result-info">
                  <div class="quiz-title">{{ result.title }}</div>
                  <div class="quiz-date">{{ result.date }}</div>
                </div>
                <div class="quiz-result-score" :class="getScoreColor(result.score)">
                  {{ result.score }}점
                </div>
              </div>
            </div>
          </div>

          <!-- 배정된 문제 -->
          <div class="assigned-quizzes-section">
            <h4 class="section-title">📝 배정된 문제</h4>
            <div v-if="!getStudentAssignedQuizzes(selectedStudentDetail?.id).length" class="empty-assignments">
              <div class="empty-icon">📋</div>
              <div class="empty-text">아직 배정된 문제가 없습니다.</div>
              <div class="empty-subtext">자료 상세보기에서 문제를 생성하고 배정해보세요!</div>
            </div>
            <div v-else class="assigned-quizzes-list">
              <div v-for="quiz in getStudentAssignedQuizzes(selectedStudentDetail?.id)" 
                   :key="quiz.id" 
                   class="assigned-quiz-item">
                <div class="quiz-image-preview">
                  <img v-if="quiz.imageUrl" :src="quiz.imageUrl" :alt="quiz.title" class="quiz-preview-image">
                  <div v-else class="quiz-placeholder-image">🖼️</div>
                </div>
                <div class="quiz-info">
                  <div class="quiz-title">{{ quiz.title }}</div>
                  <div class="quiz-description">{{ quiz.description }}</div>
                  <div class="quiz-meta">
                    <span class="quiz-difficulty">{{ quiz.difficulty }}</span>
                    <span class="quiz-separator">•</span>
                    <span class="quiz-date">{{ quiz.assignedDate }}</span>
                  </div>
                </div>
                <div class="quiz-status">
                  <div class="status-badge" :class="quiz.completed ? 'completed' : 'pending'">
                    {{ quiz.completed ? '완료' : '대기중' }}
                  </div>
                </div>
                <div class="quiz-actions">
                  <button @click="editAssignment(quiz)" class="action-btn edit-btn" title="문제 수정">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button @click="deleteAssignment(quiz)" class="action-btn delete-btn" title="문제 삭제">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 학습 추천사항 -->
          <div class="recommendations-section">
            <h4 class="section-title">💡 학습 추천사항</h4>
            <div class="recommendations-list">
              <div v-for="(recommendation, index) in selectedStudentDetail?.recommendations || mockRecommendations" 
                   :key="index" 
                   class="recommendation-item">
                <div class="recommendation-icon">{{ recommendation.icon }}</div>
                <div class="recommendation-content">
                  <div class="recommendation-title">{{ recommendation.title }}</div>
                  <div class="recommendation-description">{{ recommendation.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="sendEncouragement" class="primary-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            격려 메시지 보내기
          </button>
          <button @click="closeStudentModal" class="secondary-button">
            닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 자료 상세보기 모달 -->
    <div v-if="showMaterialDetailModal" class="modal-overlay" @click="closeMaterialDetailModal">
      <div class="material-detail-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon material-detail-icon">📚</div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ selectedMaterialDetail?.title || '학습 자료 상세보기' }}</h3>
            <p class="modal-subtitle">AI가 생성한 요약과 이미지를 확인하세요</p>
          </div>
          <button @click="closeMaterialDetailModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content material-detail-content">
          <!-- 키워드 섹션 -->
          <div v-if="selectedMaterialDetail?.keywords" class="detail-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              학습 키워드
            </h4>
            <div class="detail-keywords">
              <span 
                v-for="(keyword, index) in selectedMaterialDetail.keywords.split(',')" 
                :key="index"
                class="detail-keyword-tag"
              >
                {{ keyword.trim() }}
              </span>
            </div>
          </div>

          <!-- AI 요약 섹션 -->
          <div v-if="selectedMaterialDetail?.summary" class="detail-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              AI 요약 내용
            </h4>
            <div class="detail-summary">
              {{ selectedMaterialDetail.summary }}
            </div>
          </div>

          <!-- 생성된 이미지 섹션 -->
          <div class="detail-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              생성된 이미지 ({{ generatedImages.length || 0 }}/3)
            </h4>
            <div class="generated-images-grid">
              <!-- 이미지 생성 중 또는 실패 상태 -->
              <div v-if="generatedImages.length === 0" class="image-placeholder">
                <div class="placeholder-icon">{{ imageGenerationError ? '⚠️' : '🎨' }}</div>
                <div class="placeholder-text">
                  <div class="placeholder-main">
                    {{ imageGenerationError ? '이미지 제작 중...' : '이미지 생성 중...' }}
                  </div>
                  <div class="placeholder-sub">
                    {{ imageGenerationError ? 'AI 이미지 생성이 처리 중입니다. 잠시만 기다려주세요.' : 'AI가 요약 내용을 바탕으로 이미지를 생성합니다' }}
                  </div>
                </div>
              </div>
              
              <!-- 생성된 이미지들 -->
              <div v-for="(image, index) in generatedImages" :key="index" class="generated-image-container">
                <img :src="image.url" :alt="`${selectedMaterialDetail?.title} - 이미지 ${index + 1}`" class="generated-image">
                <div class="image-caption">{{ image.caption || `이미지 ${index + 1}` }}</div>
              </div>
              
              <!-- 추가 이미지 생성 플레이스홀더 -->
              <div v-for="i in (3 - generatedImages.length)" :key="`placeholder-${i}`" class="image-placeholder small" v-if="generatedImages.length > 0 && generatedImages.length < 3">
                <div class="placeholder-icon">🖼️</div>
                <div class="placeholder-text">
                  <div class="placeholder-main">추가 이미지</div>
                  <div class="placeholder-sub">생성 중...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="regenerateImages" class="secondary-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
            </svg>
            이미지 재생성
          </button>
          <button @click="generateQuizFromMaterial" class="primary-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-4"/>
              <circle cx="16" cy="5" r="3"/>
            </svg>
            문제 생성하기
          </button>
          <button @click="closeMaterialDetailModal" class="secondary-button">
            닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 퀴즈 생성 모달 -->
    <div v-if="showQuizGenerationModal" class="modal-overlay" @click="closeQuizGenerationModal">
      <div class="quiz-generation-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon quiz-generation-icon">🎯</div>
          <div class="modal-title-section">
            <h3 class="modal-title">문제 생성 및 학생 배정</h3>
            <p class="modal-subtitle">자료를 기반으로 문제를 만들어 학생에게 배정하세요</p>
          </div>
          <button @click="closeQuizGenerationModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content quiz-generation-content">
          <!-- 문제 정보 섹션 -->
          <div class="generation-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-4"/>
                <circle cx="16" cy="5" r="3"/>
              </svg>
              문제 설정
            </h4>
            <div class="quiz-form">
              <div class="form-group">
                <label class="form-label">문제 제목</label>
                <input 
                  v-model="quizForm.title"
                  type="text" 
                  class="form-input"
                  placeholder="예: 식물의 광합성에 대한 문제"
                >
              </div>
              <div class="form-group">
                <label class="form-label">문제 유형</label>
                <select v-model="quizForm.type" class="form-select" @change="handleQuizTypeChange">
                  <option value="image-expression">이미지에 맞는 표현 고르기</option>
                  <option value="ox-quiz">OX 퀴즈</option>
                </select>
                <div class="form-help">문제 유형을 선택해주세요</div>
              </div>
              <div class="form-group">
                <label class="form-label">난이도</label>
                <select v-model="quizForm.difficulty" class="form-select">
                  <option value="elementary-low">초등 저학년</option>
                  <option value="elementary-high">초등 고학년</option>
                  <option value="middle-school">중학생 수준</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 학생 배정 섹션 -->
          <div class="generation-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              학생 선택
            </h4>
            <div class="student-selection">
              <div 
                v-for="student in mockStudents" 
                :key="student.id"
                class="student-checkbox-item"
                @click="toggleStudentSelection(student.id)"
              >
                <div class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="selectedStudents.includes(student.id)"
                    @click.stop
                    @change="toggleStudentSelection(student.id)"
                  >
                </div>
                <div class="student-info-mini">
                  <div class="student-name-mini">{{ student.name }}</div>
                  <div class="student-score-mini">최근 점수: {{ student.recentScore }}점</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 생성 미리보기 -->
          <div v-if="generatedQuizPreview" class="generation-section">
            <h4 class="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              생성된 문제 미리보기
            </h4>
            <div class="quiz-preview">
              <div v-if="!generatedQuizPreview" class="preview-placeholder">
                <div class="placeholder-icon">🎯</div>
                <div class="placeholder-text">문제 미리보기 버튼을 눌러 문제를 생성해보세요</div>
              </div>
              
              <div v-else class="preview-content">
                <!-- 문제 이미지 -->
                <div class="preview-image-container">
                  <img 
                    v-if="generatedQuizPreview.image_url"
                    :src="generatedQuizPreview.image_url"
                    :alt="generatedQuizPreview.question"
                    class="preview-image"
                  >
                  <div v-else class="preview-image-placeholder">
                    <div class="image-placeholder-icon">🖼️</div>
                    <div class="image-placeholder-text">문제 이미지</div>
                  </div>
                </div>
                
                <!-- 문제 텍스트 -->
                <div class="preview-question">{{ generatedQuizPreview.question }}</div>
                
                <!-- 선택지 (2지선다 + 도움말) -->
                <div class="preview-options">
                  <div class="preview-main-options">
                    <div class="preview-option main-option">
                      <span class="option-number">1</span>
                      <span class="option-text">{{ generatedQuizPreview.option1 }}</span>
                    </div>
                    <div class="preview-option main-option">
                      <span class="option-number">2</span>
                      <span class="option-text">{{ generatedQuizPreview.option2 }}</span>
                    </div>
                  </div>
                  <div class="preview-help-option">
                    <div class="preview-option help-option">
                      <span class="option-number">3</span>
                      <span class="option-text">잘 모르겠어요</span>
                      <span class="help-badge">도움 받기</span>
                    </div>
                  </div>
                </div>
                
                <!-- 정답 및 힌트 정보 -->
                <div class="preview-answer-info">
                  <div class="answer-indicator">
                    정답: <span class="correct-answer">{{ generatedQuizPreview.correct_answer }}번</span>
                  </div>
                  <div class="hint-info">
                    힌트: {{ generatedQuizPreview.hint_text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="generateQuizPreview" class="secondary-button" :disabled="quizGenerating">
            <div v-if="quizGenerating" class="loading-spinner small"></div>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
            </svg>
            {{ quizGenerating ? '생성 중...' : '문제 미리보기' }}
          </button>
          <button @click="assignQuizToStudents" class="primary-button" :disabled="!generatedQuizPreview || selectedStudents.length === 0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            학생에게 배정하기
          </button>
        </div>
      </div>
    </div>

    <!-- 학생 관리 모달 (추가/수정) -->
    <div v-if="showStudentManageModal" class="modal-overlay" @click="closeStudentManageModal">
      <div class="student-manage-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon student-manage-icon">👤</div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ editingStudent ? '학생 정보 수정' : '새 학생 등록' }}</h3>
            <p class="modal-subtitle">{{ editingStudent ? '학생의 정보를 수정하세요' : '담당 학생을 등록하세요' }}</p>
          </div>
          <button @click="closeStudentManageModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content student-manage-content">
          <form @submit.prevent="saveStudent" class="student-form">
            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                학생 이름
              </label>
              <input 
                v-model="studentForm.name"
                type="text" 
                class="form-input"
                placeholder="예: 김학생"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                생년월일
              </label>
              <input 
                v-model="studentForm.birthDate"
                type="date" 
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                학부모 연락처
              </label>
              <input 
                v-model="studentForm.parentContact"
                type="tel" 
                class="form-input"
                placeholder="010-1234-5678"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                학습 수준
              </label>
              <select v-model="studentForm.level" class="form-select" required>
                <option value="">학습 수준을 선택하세요</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                특이사항 (선택)
              </label>
              <textarea 
                v-model="studentForm.notes"
                class="form-textarea"
                placeholder="학습 관련 특이사항이나 참고할 내용을 입력하세요"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-actions">
          <button @click="closeStudentManageModal" class="secondary-button">
            취소
          </button>
          <button @click="saveStudent" class="primary-button" :disabled="!studentForm.name || !studentForm.birthDate || !studentForm.parentContact || !studentForm.level">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            {{ editingStudent ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 통계 상세보기 모달 -->
    <div v-if="showStatDetailModal" class="modal-overlay" @click="closeStatDetailModal">
      <div class="stat-detail-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-icon" :class="getStatDetailIcon(selectedStatType)">{{ getStatDetailIcon(selectedStatType) }}</div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ getStatDetailTitle(selectedStatType) }}</h3>
            <p class="modal-subtitle">{{ getStatDetailSubtitle(selectedStatType) }}</p>
          </div>
          <button @click="closeStatDetailModal" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-content stat-detail-content">
          <!-- 자료 통계 -->
          <div v-if="selectedStatType === 'materials'" class="stat-detail-section">
            <div class="stat-overview">
              <div class="overview-item">
                <div class="overview-value">{{ recentMaterials.length }}</div>
                <div class="overview-label">총 업로드 자료</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ recentMaterials.filter(m => m.apiUsed).length }}</div>
                <div class="overview-label">AI 생성 자료</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ availableKeywords.length - 1 }}</div>
                <div class="overview-label">주제 분야</div>
              </div>
            </div>
            <div class="materials-breakdown">
              <h5 class="breakdown-title">주제별 분류</h5>
              <div class="breakdown-items">
                <div v-for="keyword in availableKeywords.filter(k => k !== 'all')" :key="keyword" class="breakdown-item">
                  <div class="breakdown-label">{{ keyword }}</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill" :style="{ width: (getMaterialCountByKeyword(keyword) / recentMaterials.length * 100) + '%' }"></div>
                  </div>
                  <div class="breakdown-count">{{ getMaterialCountByKeyword(keyword) }}개</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 학생 통계 -->
          <div v-if="selectedStatType === 'students'" class="stat-detail-section">
            <div class="stat-overview">
              <div class="overview-item">
                <div class="overview-value">{{ mockStudents.length }}</div>
                <div class="overview-label">전체 학생</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ activeStudentsCount }}</div>
                <div class="overview-label">활성 학생</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ mockStudents.filter(s => s.recentScore >= 80).length }}</div>
                <div class="overview-label">우수 학생 (80점 이상)</div>
              </div>
            </div>
            <div class="students-list-detail">
              <h5 class="breakdown-title">학생별 상세 현황</h5>
              <div class="students-grid">
                <div v-for="student in mockStudents" :key="student.id" class="student-detail-card">
                  <div class="student-avatar-small">{{ student.name.charAt(0) }}</div>
                  <div class="student-detail-info">
                    <div class="student-name">{{ student.name }}</div>
                    <div class="student-score" :class="getScoreColor(student.recentScore)">{{ student.recentScore }}점</div>
                    <div class="student-activity-time">{{ student.lastActivity }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 점수 통계 -->
          <div v-if="selectedStatType === 'scores'" class="stat-detail-section">
            <div class="stat-overview">
              <div class="overview-item">
                <div class="overview-value">{{ Math.round(averageStudentScore) }}점</div>
                <div class="overview-label">전체 평균</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ Math.max(...mockStudents.map(s => s.recentScore)) }}점</div>
                <div class="overview-label">최고 점수</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ Math.min(...mockStudents.map(s => s.recentScore)) }}점</div>
                <div class="overview-label">최저 점수</div>
              </div>
            </div>
            <div class="score-distribution">
              <h5 class="breakdown-title">점수 분포</h5>
              <div class="distribution-chart">
                <div class="distribution-bar">
                  <div class="bar-segment excellent" :style="{ width: getScoreDistribution('excellent') + '%' }"></div>
                  <div class="bar-segment good" :style="{ width: getScoreDistribution('good') + '%' }"></div>
                  <div class="bar-segment average" :style="{ width: getScoreDistribution('average') + '%' }"></div>
                  <div class="bar-segment poor" :style="{ width: getScoreDistribution('poor') + '%' }"></div>
                </div>
                <div class="distribution-labels">
                  <div class="distribution-label">
                    <div class="label-color excellent"></div>
                    <span>우수 (90-100점): {{ mockStudents.filter(s => s.recentScore >= 90).length }}명</span>
                  </div>
                  <div class="distribution-label">
                    <div class="label-color good"></div>
                    <span>양호 (80-89점): {{ mockStudents.filter(s => s.recentScore >= 80 && s.recentScore < 90).length }}명</span>
                  </div>
                  <div class="distribution-label">
                    <div class="label-color average"></div>
                    <span>보통 (70-79점): {{ mockStudents.filter(s => s.recentScore >= 70 && s.recentScore < 80).length }}명</span>
                  </div>
                  <div class="distribution-label">
                    <div class="label-color poor"></div>
                    <span>미흡 (70점 미만): {{ mockStudents.filter(s => s.recentScore < 70).length }}명</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 활동 통계 -->
          <div v-if="selectedStatType === 'activity'" class="stat-detail-section">
            <div class="stat-overview">
              <div class="overview-item">
                <div class="overview-value">{{ activeStudentsCount }}</div>
                <div class="overview-label">활성 학생</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ mockStudents.length - activeStudentsCount }}</div>
                <div class="overview-label">비활성 학생</div>
              </div>
              <div class="overview-item">
                <div class="overview-value">{{ Math.round(activeStudentsCount / mockStudents.length * 100) }}%</div>
                <div class="overview-label">활성 비율</div>
              </div>
            </div>
            <div class="activity-timeline">
              <h5 class="breakdown-title">최근 활동 현황</h5>
              <div class="timeline-items">
                <div v-for="student in mockStudents.slice().sort((a, b) => getActivityPriority(a.lastActivity) - getActivityPriority(b.lastActivity))" 
                     :key="student.id" 
                     class="timeline-item">
                  <div class="timeline-dot" :class="getActivityStatus(student.lastActivity)"></div>
                  <div class="timeline-content">
                    <div class="timeline-student">{{ student.name }}</div>
                    <div class="timeline-activity">{{ student.lastActivity }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeStatDetailModal" class="secondary-button">
            닫기
          </button>
        </div>
      </div>
    </div>

    <!-- 성공 확인 팝업 모달 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="success-confirmation-modal" @click.stop>
        <div class="modal-header success-header">
          <div class="modal-icon success-icon">✅</div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ successInfo.title || '완료' }}</h3>
            <p class="modal-subtitle">작업이 성공적으로 완료되었습니다.</p>
          </div>
        </div>

        <div class="modal-content success-content">
          <div class="success-message">{{ successInfo.message }}</div>
        </div>

        <div class="modal-actions">
          <button @click="closeSuccessModal" class="primary-button success-button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 에러 핸들러 -->
    <ErrorHandler
      :show="showError"
      :type="errorInfo.type || 'error'"
      :title="errorInfo.title || '오류'"
      :message="errorInfo.message || '알 수 없는 오류가 발생했습니다.'"
      @close="showError = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useHistoryStore } from '../stores/history';
import { useApiStatus } from '../composables/useApiStatus';
import ErrorHandler from '../components/ErrorHandler.vue';
import apiService from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const historyStore = useHistoryStore();
const { apiStatus, isDemoMode } = useApiStatus();

// 애니메이션 상태
const showHeader = ref(false);
const showUpload = ref(false);
const showMaterials = ref(false);
const showStudents = ref(false);
const showProblems = ref(false);
const showStats = ref(false);

// 업로드 상태
const uploading = ref(false);
const aiSummary = ref('');
const materialForm = ref({
  title: '',
  mainKeyword: '',
  keywords: '',
  notes: ''
});

// 파일 상태
const selectedFile = ref(null);
const fileInput = ref(null);

// API 모달 상태
const showApiModal = ref(false);

// 학생 모달 상태
const showStudentModal = ref(false);
const selectedStudentDetail = ref(null);

// 자료 수정 모달 상태
const showEditModal = ref(false);
const editForm = ref({
  title: '',
  keywords: '',
  summary: ''
});
const editingMaterial = ref(null);
const updating = ref(false);
const regenerating = ref(false);

// 자료 상세보기 모달 상태
const showMaterialDetailModal = ref(false);
const selectedMaterialDetail = ref(null);
const generatedImages = ref([]);
const imageGenerationError = ref(false);

// 퀴즈 생성 모달 상태
const showQuizGenerationModal = ref(false);
const quizForm = ref({
  title: '',
  type: 'image-expression',
  difficulty: 'elementary-low'
});
const selectedStudents = ref([]);
const generatedQuizPreview = ref(null);
const quizGenerating = ref(false);

// 학생 관리 모달 상태
const showStudentManageModal = ref(false);
const editingStudent = ref(null);
const studentForm = ref({
  name: '',
  birthDate: '',
  parentContact: '',
  level: '',
  notes: ''
});

// 키워드 필터링 상태
const selectedKeywordFilter = ref('all');

// 통계 상세보기 모달 상태
const showStatDetailModal = ref(false);
const selectedStatType = ref(null);

// 기타 상태
const showError = ref(false);
const errorInfo = ref({});
const showSuccessModal = ref(false);
const successInfo = ref({});
const refreshing = ref(false);

// 학생 관리 데이터
const students = ref([
  { id: 1, name: '김민수', grade: '초등 3학년', progress: 85 },
  { id: 2, name: '이지은', grade: '초등 3학년', progress: 92 },
  { id: 3, name: '박준호', grade: '초등 3학년', progress: 76 },
  { id: 4, name: '최서연', grade: '초등 3학년', progress: 88 },
  { id: 5, name: '정우진', grade: '초등 3학년', progress: 94 },
  { id: 6, name: '한소영', grade: '초등 3학년', progress: 79 }
]);

const selectedStudentId = ref(null);

// 문제 관리 데이터  
const problems = ref([
  { id: 1, title: '수와 연산 기초 문제', subject: '수학', difficulty: '기초', type: 'multiple', status: 'active' },
  { id: 2, title: '도형의 이해', subject: '수학', difficulty: '중급', type: 'matching', status: 'active' },
  { id: 3, title: '한글 읽기 문제', subject: '국어', difficulty: '기초', type: 'reading', status: 'draft' },
  { id: 4, title: '자연 관찰 문제', subject: '과학', difficulty: '기초', type: 'image', status: 'active' },
  { id: 5, title: '생활 속 수학', subject: '수학', difficulty: '응용', type: 'multiple', status: 'inactive' }
]);

const selectedProblemId = ref(null);

// 목업 학생 데이터 (기존 호환성 유지)
const mockStudents = ref([
  {
    id: 1,
    name: '김학생',
    recentScore: 85,
    lastActivity: '2시간 전',
    totalQuizzes: 5,
    averageScore: 82
  },
  {
    id: 2,
    name: '이학생',
    recentScore: 92,
    lastActivity: '1일 전',
    totalQuizzes: 8,
    averageScore: 88
  },
  {
    id: 3,
    name: '박학생',
    recentScore: 76,
    lastActivity: '3시간 전',
    totalQuizzes: 3,
    averageScore: 75
  },
  {
    id: 4,
    name: '최학생',
    recentScore: 88,
    lastActivity: '30분 전',
    totalQuizzes: 6,
    averageScore: 85
  }
]);

// 계산된 속성
const recentMaterials = computed(() => {
  return historyStore.materialHistory;
});

// 키워드 필터링 관련 computed
const availableKeywords = computed(() => {
  const materials = recentMaterials.value;
  const keywords = new Set(['all']);
  
  materials.forEach(material => {
    if (material.mainKeyword) {
      keywords.add(material.mainKeyword);
    }
  });
  
  return Array.from(keywords);
});

const filteredMaterials = computed(() => {
  if (selectedKeywordFilter.value === 'all') {
    return recentMaterials.value;
  }
  
  return recentMaterials.value.filter(material => 
    material.mainKeyword === selectedKeywordFilter.value
  );
});

const averageStudentScore = computed(() => {
  if (mockStudents.value.length === 0) return 0;
  return mockStudents.value.reduce((sum, student) => sum + student.recentScore, 0) / mockStudents.value.length;
});

const activeStudentsCount = computed(() => {
  return mockStudents.value.filter(student => {
    const lastActivity = student.lastActivity;
    return lastActivity.includes('시간') || lastActivity.includes('분');
  }).length;
});

onMounted(() => {
  startAnimations();
  
  // 디버깅: API 키 상태 확인
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('🔑 API 키 로드 상태:', {
    hasKey: !!geminiApiKey,
    keyLength: geminiApiKey?.length || 0,
    keyPreview: geminiApiKey ? `${geminiApiKey.substring(0, 15)}...` : '키 없음',
    isValidLength: geminiApiKey?.length >= 30
  });
});

const startAnimations = () => {
  setTimeout(() => showHeader.value = true, 200);
  setTimeout(() => showUpload.value = true, 600);
  setTimeout(() => showMaterials.value = true, 1000);
  setTimeout(() => showStudents.value = true, 1400);
  setTimeout(() => showProblems.value = true, 1600);
  setTimeout(() => showStats.value = true, 1800);
};

// 키워드 필터링 함수들
const setKeywordFilter = (keyword) => {
  selectedKeywordFilter.value = keyword;
};

const getMaterialCountByKeyword = (keyword) => {
  if (keyword === 'all') {
    return recentMaterials.value.length;
  }
  
  return recentMaterials.value.filter(material => 
    material.mainKeyword === keyword
  ).length;
};

const getMaterialsByKeyword = (keyword) => {
  if (keyword === 'all') {
    return recentMaterials.value;
  }
  
  return recentMaterials.value.filter(material => 
    material.mainKeyword === keyword
  );
};

// 학생별 배정된 퀴즈 조회
const getStudentAssignedQuizzes = (studentId) => {
  // 목업 데이터 - 실제로는 API에서 가져와야 함
  const mockAssignedQuizzes = [
    {
      id: 1,
      title: '수와 연산 문제',
      description: '1-10까지의 수 세기와 기본 연산',
      difficulty: '쉬움',
      imageUrl: '/src/assets/images/quiz/math-counting.svg',
      assignedDate: '2024-01-15',
      completed: true
    },
    {
      id: 2,
      title: '동물 소리 문제',
      description: '여러 동물들의 소리 구분하기',
      difficulty: '보통',
      imageUrl: '/src/assets/images/quiz/reading-animals.svg',
      assignedDate: '2024-01-16',
      completed: false
    }
  ];
  
  // 학생 ID에 따라 필터링 (여기서는 목업으로 모든 학생에게 동일하게)
  return mockAssignedQuizzes;
};

// 통계 상세보기 관련 함수들
const showStatDetail = (type) => {
  selectedStatType.value = type;
  showStatDetailModal.value = true;
};

const closeStatDetailModal = () => {
  showStatDetailModal.value = false;
  selectedStatType.value = null;
};

const getStatDetailIcon = (type) => {
  const icons = {
    materials: '📚',
    students: '👥',
    scores: '⭐',
    activity: '🟢'
  };
  return icons[type] || '📊';
};

const getStatDetailTitle = (type) => {
  const titles = {
    materials: '업로드된 자료 상세',
    students: '담당 학생 현황',
    scores: '점수 분석',
    activity: '활동 현황'
  };
  return titles[type] || '통계 상세';
};

const getStatDetailSubtitle = (type) => {
  const subtitles = {
    materials: '자료별 분류 및 생성 현황',
    students: '학생별 학습 현황 및 진도',
    scores: '점수 분포 및 성과 분석',
    activity: '최근 활동 및 참여도 현황'
  };
  return subtitles[type] || '상세 분석 정보';
};

const getScoreDistribution = (level) => {
  const total = mockStudents.value.length;
  if (total === 0) return 0;
  
  const counts = {
    excellent: mockStudents.value.filter(s => s.recentScore >= 90).length,
    good: mockStudents.value.filter(s => s.recentScore >= 80 && s.recentScore < 90).length,
    average: mockStudents.value.filter(s => s.recentScore >= 70 && s.recentScore < 80).length,
    poor: mockStudents.value.filter(s => s.recentScore < 70).length
  };
  
  return (counts[level] / total) * 100;
};

const getActivityPriority = (lastActivity) => {
  if (lastActivity.includes('분')) return 1;
  if (lastActivity.includes('시간')) return 2;
  if (lastActivity.includes('일')) return 3;
  return 4;
};

const getActivityStatus = (lastActivity) => {
  if (lastActivity.includes('분') || lastActivity.includes('시간')) return 'active';
  if (lastActivity.includes('일')) return 'recent';
  return 'inactive';
};

const handleLogout = () => {
  authStore.logout();
  router.push('/user-selection');
};

const uploadMaterial = async () => {
  if (!selectedFile.value) {
    showErrorModal('파일 선택 필요', 'PDF 파일을 선택해주세요.');
    return;
  }
  
  uploading.value = true;
  aiSummary.value = '';
  
  try {
    // PDF 텍스트 추출
    const extractedText = await extractPDFText(selectedFile.value);
    
    // Gemini API 키가 있는지 확인
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here' || geminiApiKey.length < 30) {
      // API 키가 없거나 유효하지 않으면 데모 모드로 진행
      console.log('API 키 상태:', { 
        hasKey: !!geminiApiKey, 
        keyLength: geminiApiKey?.length,
        keyPreview: geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : '없음' 
      });
      showApiModal.value = true;
      return;
    }

    // API 키 유효성 테스트
    console.log('API 키 테스트 중...');
    const isApiKeyValid = await apiService.testGeminiApiKey();
    
    if (!isApiKeyValid) {
      console.log('API 키 테스트 실패 - 데모 모드로 전환');
      showApiModal.value = true;
      return;
    }

    console.log('API 키 테스트 성공 - 실제 API 사용');

    // 실제 Gemini API 호출
    const requestData = {
      title: materialForm.value.title,
      keywords: materialForm.value.keywords,
      content: extractedText,
      filename: selectedFile.value.name
    };
    
    const response = await apiService.uploadMaterial(requestData);
    aiSummary.value = response.ai_summary;

    // 히스토리에 기록 추가
    historyStore.addMaterialRecord({
      title: materialForm.value.title,
      mainKeyword: materialForm.value.mainKeyword,
      contentType: inferContentType(materialForm.value.title),
      apiUsed: true,
      summary: aiSummary.value,
      keywords: materialForm.value.keywords,
      filename: selectedFile.value.name
    });

    // 폼 및 파일 초기화
    materialForm.value = { title: '', mainKeyword: '', keywords: '', notes: '' };
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    
  } catch (error) {
    console.error('자료 업로드 실패:', error);
    if (error.message.includes('Gemini API')) {
      showErrorModal('AI 요약 실패', 'Gemini API 키를 확인해주세요. 데모 모드로 계속 진행하시겠습니까?');
      setTimeout(() => {
        showApiModal.value = true;
      }, 2000);
    } else {
      showErrorModal('자료 업로드 실패', error.message || '네트워크 연결을 확인해주세요.');
    }
  } finally {
    uploading.value = false;
  }
};

const continueWithDemo = () => {
  showApiModal.value = false;
  
  // 데모 요약 생성
  setTimeout(async () => {
    const keywords = materialForm.value.keywords || '학습, 교육';
    const demoSummaries = {
      '수학': `📊 ${materialForm.value.title} 요약\n\n🔑 주요 키워드: ${keywords}\n\n• 분수의 덧셈: 분모가 같을 때는 분자만 더하기\n• 분모가 다를 때: 통분한 후 분자 더하기\n• 기약분수로 답 만들기\n• 피자 조각으로 생각하면 쉬워요!\n\n🎨 이미지 생성 아이디어:\n• 피자를 나누는 모습 일러스트\n• 분수 계산 과정을 보여주는 도표\n\n🔧 이 요약은 데모 모드입니다.`,
      '과학': `🌱 ${materialForm.value.title} 요약\n\n🔑 주요 키워드: ${keywords}\n\n• 광합성 재료: 햇빛 + 물 + 이산화탄소\n• 과정: 잎에서 음식 만들기\n• 결과: 산소 만들어서 우리가 숨쉴 수 있게 해줌\n• 실험: 화분에 물주고 햇빛 쬐어주며 관찰하기\n\n🎨 이미지 생성 아이디어:\n• 식물이 광합성하는 과정 그림\n• 햇빛과 잎사귀 일러스트\n\n🔧 이 요약은 데모 모드입니다.`,
      'default': `📚 ${materialForm.value.title} 요약\n\n🔑 주요 키워드: ${keywords}\n\n• 핵심 내용을 이해하기 쉽게 정리했습니다\n• 중요한 포인트를 강조했습니다\n• 실생활과 연결해서 설명했습니다\n• 복습할 때 다시 보면 좋을 내용입니다\n\n🎨 이미지 생성 아이디어:\n• 학습 내용을 시각화한 다이어그램\n• 개념을 설명하는 친근한 일러스트\n\n🔧 이 요약은 데모 모드입니다.`
    };
    
    const title = materialForm.value.title.toLowerCase();
    let summary = demoSummaries.default;
    
    if (title.includes('수학') || title.includes('분수') || title.includes('계산')) {
      summary = demoSummaries['수학'];
    } else if (title.includes('과학') || title.includes('식물') || title.includes('광합성')) {
      summary = demoSummaries['과학'];
    }
    
    aiSummary.value = summary;

    // 히스토리에 기록 추가
    historyStore.addMaterialRecord({
      title: materialForm.value.title,
      contentType: inferContentType(materialForm.value.title),
      apiUsed: false,
      summary: aiSummary.value,
      keywords: materialForm.value.keywords,
      filename: selectedFile.value?.name || 'demo-file.pdf'
    });

    // 폼 및 파일 초기화
    materialForm.value = { title: '', mainKeyword: '', keywords: '', notes: '' };
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    uploading.value = false;
  }, 1500);
};

const openApiDocs = () => {
  window.open('https://ai.google.dev/gemini-api/docs/api-key', '_blank');
  showApiModal.value = false;
  uploading.value = false;
};

const closeApiModal = () => {
  showApiModal.value = false;
  uploading.value = false;
};

const refreshStudentData = async () => {
  refreshing.value = true;
  
  try {
    // API 키가 있다면 실제 데이터를 가져올 수 있음
    if (!isDemoMode()) {
      // 실제 API 호출 로직
      // const response = await apiService.getStudentData();
      // mockStudents.value = response.students;
    }
    
    // 데모용 새로고침 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    showErrorModal('데이터 새로고침 실패', '학생 데이터를 불러올 수 없습니다.');
  } finally {
    refreshing.value = false;
  }
};

// 목업 퀴즈 결과 데이터
const mockQuizResults = ref([
  { title: '분수의 덧셈 퀴즈', date: '2024-01-15', score: 85 },
  { title: '소수의 곱셈 퀴즈', date: '2024-01-12', score: 92 },
  { title: '기하 도형 퀴즈', date: '2024-01-10', score: 78 },
  { title: '문장제 퀴즈', date: '2024-01-08', score: 88 }
]);

// 목업 추천사항 데이터
const mockRecommendations = ref([
  {
    icon: '📚',
    title: '분수 개념 복습',
    description: '분모가 다른 분수의 덧셈을 더 연습해보세요'
  },
  {
    icon: '🎯',
    title: '문제 풀이 시간 단축',
    description: '반복 연습을 통해 계산 속도를 향상시켜보세요'
  },
  {
    icon: '🌟',
    title: '시각적 학습 자료 활용',
    description: '그림이나 도표를 이용한 학습이 효과적일 것 같습니다'
  }
]);

const viewStudentDetail = (student: any) => {
  selectedStudentDetail.value = {
    ...student,
    weeklyQuizzes: Math.floor(Math.random() * 5) + 1,
    studyTime: `${Math.floor(Math.random() * 3) + 1}시간 ${Math.floor(Math.random() * 60)}분`,
    recentQuizzes: mockQuizResults.value,
    recommendations: mockRecommendations.value
  };
  showStudentModal.value = true;
};

const closeStudentModal = () => {
  showStudentModal.value = false;
  selectedStudentDetail.value = null;
};

const sendEncouragement = () => {
  showErrorModal('격려 메시지 발송 완료', `${selectedStudentDetail.value?.name}님에게 격려 메시지를 보냈습니다! 💪`, 'success');
  closeStudentModal();
};

// 자료 수정/삭제 함수들
const editMaterial = (material) => {
  editingMaterial.value = material;
  editForm.value = {
    title: material.title,
    keywords: material.keywords || '',
    summary: material.summary || ''
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingMaterial.value = null;
  editForm.value = { title: '', keywords: '', summary: '' };
  updating.value = false;
  regenerating.value = false;
};

const updateMaterial = async () => {
  if (!editingMaterial.value) return;
  
  updating.value = true;
  
  try {
    // 히스토리 스토어에서 자료 업데이트
    historyStore.updateMaterialRecord(editingMaterial.value.date, {
      title: editForm.value.title,
      keywords: editForm.value.keywords,
      summary: editForm.value.summary
    });
    
    showErrorModal('수정 완료', '학습 자료가 성공적으로 수정되었습니다.', 'success');
    closeEditModal();
  } catch (error) {
    showErrorModal('수정 실패', '자료 수정 중 오류가 발생했습니다.');
  } finally {
    updating.value = false;
  }
};

const regenerateSummary = async () => {
  if (!editForm.value.keywords) {
    showErrorModal('키워드 필요', 'AI 요약을 재생성하려면 학습 키워드를 입력해주세요.');
    return;
  }
  
  regenerating.value = true;
  
  try {
    // Gemini API를 사용하여 요약 재생성
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here' || geminiApiKey.length < 30) {
      // 데모 요약 생성
      const demoSummary = `📚 ${editForm.value.title} 수정된 요약

🔑 주요 키워드: ${editForm.value.keywords}

• 수정된 핵심 내용을 이해하기 쉽게 정리했습니다
• 입력된 키워드를 중심으로 재구성했습니다
• 학습자 맞춤형 설명을 추가했습니다
• 실생활 연결 포인트를 강화했습니다

🎨 이미지 생성 아이디어:
• 키워드 중심의 시각적 다이어그램
• 개념을 설명하는 친근한 일러스트

🔧 이 요약은 수정된 내용입니다.`;
      
      editForm.value.summary = demoSummary;
    } else {
      // 실제 Gemini API 호출
      const mockText = `이것은 ${editForm.value.title}에 대한 학습 자료입니다. 키워드: ${editForm.value.keywords}`;
      const newSummary = await apiService.summarizeWithGemini(mockText, editForm.value.keywords);
      editForm.value.summary = newSummary;
    }
    
    showErrorModal('재생성 완료', 'AI 요약이 새로운 키워드로 재생성되었습니다.', 'success');
  } catch (error) {
    showErrorModal('재생성 실패', 'AI 요약 재생성 중 오류가 발생했습니다.');
  } finally {
    regenerating.value = false;
  }
};

const deleteMaterial = (material) => {
  if (confirm(`"${material.title}" 자료를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
    try {
      historyStore.deleteMaterialRecord(material.date);
      showErrorModal('삭제 완료', '학습 자료가 성공적으로 삭제되었습니다.', 'success');
    } catch (error) {
      showErrorModal('삭제 실패', '자료 삭제 중 오류가 발생했습니다.');
    }
  }
};

// 자료 상세보기 관련 함수들
const viewMaterialDetail = (material) => {
  selectedMaterialDetail.value = material;
  showMaterialDetailModal.value = true;
  
  // 저장된 이미지가 있는지 확인
  if (material.generatedImages && material.generatedImages.length > 0) {
    generatedImages.value = material.generatedImages;
    imageGenerationError.value = false;
  } else {
    // 이미지가 없으면 새로 생성
    generatedImages.value = [];
    imageGenerationError.value = false;
    generateImageForMaterial(material);
  }
};

const closeMaterialDetailModal = () => {
  showMaterialDetailModal.value = false;
  selectedMaterialDetail.value = null;
  generatedImages.value = [];
  imageGenerationError.value = false;
};

const generateImageForMaterial = async (material) => {
  try {
    imageGenerationError.value = false;
    
    // 이미 3장이 있는지 확인
    if (material.generatedImages && material.generatedImages.length >= 3) {
      const shouldRegenerate = confirm('이미 3장의 이미지가 저장되어 있습니다.\n기존 이미지를 삭제하고 새로 생성하시겠습니까?');
      if (!shouldRegenerate) {
        return;
      }
    }
    
    // OpenAI API를 사용하여 이미지 생성
    const images = await apiService.generateImagesWithOpenAI(
      material.summary || material.title,
      material.keywords || '',
      3
    );
    
    generatedImages.value = images;
    
    // 생성된 이미지를 자료 기록에 저장
    historyStore.updateMaterialRecord(material.date, {
      generatedImages: images
    });
    
    // 현재 보고 있는 자료의 이미지도 업데이트
    if (selectedMaterialDetail.value && selectedMaterialDetail.value.date === material.date) {
      selectedMaterialDetail.value.generatedImages = images;
    }
    
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    imageGenerationError.value = true;
    
    showErrorModal('이미지 생성 실패', '이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    generatedImages.value = [];
  }
};

const regenerateImages = () => {
  if (!selectedMaterialDetail.value) return;
  generateImageForMaterial(selectedMaterialDetail.value);
};

const generateQuizFromMaterial = () => {
  if (!selectedMaterialDetail.value) return;
  
  // 퀴즈 폼에 자료 정보 미리 채우기
  quizForm.value.title = `${selectedMaterialDetail.value.title} 관련 문제`;
  
  // 상세보기 모달 닫고 퀴즈 생성 모달 열기
  closeMaterialDetailModal();
  showQuizGenerationModal.value = true;
};

// 퀴즈 생성 관련 함수들
const closeQuizGenerationModal = () => {
  showQuizGenerationModal.value = false;
  quizForm.value = { title: '', type: 'image-expression', difficulty: 'elementary-low' };
  selectedStudents.value = [];
  generatedQuizPreview.value = null;
  quizGenerating.value = false;
};

const handleQuizTypeChange = () => {
  if (quizForm.value.type === 'ox-quiz') {
    showErrorModal('개발 중', 'OX 퀴즈 기능은 현재 개발 중입니다. 곧 업데이트될 예정입니다.', 'info');
    // 다시 이미지-표현 매칭으로 되돌리기
    quizForm.value.type = 'image-expression';
  }
};

const toggleStudentSelection = (studentId) => {
  const index = selectedStudents.value.indexOf(studentId);
  if (index > -1) {
    selectedStudents.value.splice(index, 1);
  } else {
    selectedStudents.value.push(studentId);
  }
};

const generateQuizPreview = async () => {
  if (!quizForm.value.title || !selectedMaterialDetail.value) return;
  
  quizGenerating.value = true;
  
  try {
    // AI를 사용하여 퀴즈 생성 (시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 청소년 경계선 지능 학습자를 위한 이미지-표현 매칭 문제 생성 (2지선다 + 도움말)
    const sampleQuizzes = [
      {
        question: "그림을 보고 가장 적절한 표현을 선택하세요.",
        option1: "학생이 열심히 공부하고 있다",
        option2: "학생이 책을 정리하고 있다", 
        correct_answer: 1,
        hint_text: "책을 펼쳐놓고 집중하는 모습을 관찰해보세요. 정리가 아닌 무엇을 하고 있을까요?",
        image_url: "/src/assets/images/quiz/math-counting.svg"
      },
      {
        question: "이 그림이 나타내는 상황을 가장 잘 설명한 것은?",
        option1: "사람들이 협력하여 문제를 해결하고 있다",
        option2: "사람들이 각자 다른 일을 하고 있다",
        correct_answer: 1,
        hint_text: "여러 사람이 함께 모여서 같은 목표를 향해 노력하는 모습을 보세요.",
        image_url: "/src/assets/images/quiz/reading-animals.svg"
      },
      {
        question: "이 그림에서 표현하고자 하는 감정은 무엇인가요?",
        option1: "성취감과 기쁨을 느끼고 있다",
        option2: "걱정과 불안을 느끼고 있다",
        correct_answer: 1,
        hint_text: "표정과 몸짓을 자세히 관찰해보세요. 긍정적인 감정인지 부정적인 감정인지 생각해보세요.",
        image_url: "/src/assets/images/quiz/math-counting.svg"
      }
    ];
    
    const selectedQuiz = sampleQuizzes[Math.floor(Math.random() * sampleQuizzes.length)];
    
    // 난이도에 따른 문제 조정
    if (quizForm.value.difficulty === 'elementary-low') {
      selectedQuiz.question = selectedQuiz.question.replace(/일까요/g, '일까요? 🤔');
    } else if (quizForm.value.difficulty === 'middle-school') {
      selectedQuiz.question = `${selectedQuiz.question} (신중히 생각해보세요)`;
    }
    
    generatedQuizPreview.value = selectedQuiz;
    
  } catch (error) {
    showErrorModal('문제 생성 실패', '문제 생성 중 오류가 발생했습니다.');
  } finally {
    quizGenerating.value = false;
  }
};

const assignQuizToStudents = () => {
  if (!generatedQuizPreview.value || selectedStudents.value.length === 0) return;
  
  const selectedStudentNames = mockStudents.value
    .filter(student => selectedStudents.value.includes(student.id))
    .map(student => student.name)
    .join(', ');
  
  showErrorModal(
    '문제 배정 완료', 
    `다음 학생들에게 문제가 배정되었습니다:\n${selectedStudentNames}`, 
    'success'
  );
  
  closeQuizGenerationModal();
};

// 학생 관리 관련 함수들
const addNewStudent = () => {
  editingStudent.value = null;
  studentForm.value = {
    name: '',
    birthDate: '',
    parentContact: '',
    level: '',
    notes: ''
  };
  showStudentManageModal.value = true;
};

const editStudent = (student) => {
  editingStudent.value = student;
  studentForm.value = {
    name: student.name,
    birthDate: student.birthDate || '',
    parentContact: student.parentContact || '',
    level: student.level || '',
    notes: student.notes || ''
  };
  showStudentManageModal.value = true;
};

const deleteStudent = (student) => {
  if (confirm(`"${student.name}" 학생을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
    const index = mockStudents.value.findIndex(s => s.id === student.id);
    if (index > -1) {
      mockStudents.value.splice(index, 1);
      showErrorModal('삭제 완료', `${student.name} 학생이 삭제되었습니다.`, 'success');
    }
  }
};

const closeStudentManageModal = () => {
  showStudentManageModal.value = false;
  editingStudent.value = null;
  studentForm.value = {
    name: '',
    birthDate: '',
    parentContact: '',
    level: '',
    notes: ''
  };
};

const saveStudent = () => {
  if (!studentForm.value.name || !studentForm.value.birthDate || !studentForm.value.parentContact || !studentForm.value.level) {
    showErrorModal('입력 오류', '필수 항목을 모두 입력해주세요.');
    return;
  }

  if (editingStudent.value) {
    // 수정 모드
    const index = mockStudents.value.findIndex(s => s.id === editingStudent.value.id);
    if (index > -1) {
      mockStudents.value[index] = {
        ...mockStudents.value[index],
        name: studentForm.value.name,
        birthDate: studentForm.value.birthDate,
        parentContact: studentForm.value.parentContact,
        level: studentForm.value.level,
        notes: studentForm.value.notes
      };
      showErrorModal('수정 완료', `${studentForm.value.name} 학생 정보가 수정되었습니다.`, 'success');
    }
  } else {
    // 새 학생 추가
    const newStudent = {
      id: Date.now(),
      name: studentForm.value.name,
      birthDate: studentForm.value.birthDate,
      parentContact: studentForm.value.parentContact,
      level: studentForm.value.level,
      notes: studentForm.value.notes,
      recentScore: 0,
      lastActivity: '방금 전',
      totalQuizzes: 0,
      averageScore: 0
    };
    mockStudents.value.push(newStudent);
    showErrorModal('등록 완료', `${studentForm.value.name} 학생이 등록되었습니다.`, 'success');
  }
  
  closeStudentManageModal();
};

// 배정된 문제 관리 함수들
const assignQuizToStudent = (student) => {
  showErrorModal('문제 배정', `${student.name} 학생에게 문제를 배정하는 기능은 자료 상세보기에서 이용 가능합니다.`, 'info');
};

const editAssignment = (quiz) => {
  // 배정된 문제 수정 기능
  const newDifficulty = prompt(`"${quiz.title}" 문제의 난이도를 변경하세요:\n\n현재 난이도: ${quiz.difficulty}\n\n새 난이도를 입력하세요 (쉬움, 보통, 어려움):`, quiz.difficulty);
  
  if (newDifficulty && newDifficulty !== quiz.difficulty) {
    quiz.difficulty = newDifficulty;
    showErrorModal('문제 수정 완료', `문제 난이도가 "${newDifficulty}"로 변경되었습니다.`, 'success');
  }
};

const deleteAssignment = (quiz) => {
  if (confirm(`"${quiz.title}" 문제를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
    showErrorModal('문제 삭제 완료', `"${quiz.title}" 문제가 삭제되었습니다.`, 'success');
    // 실제 구현에서는 배정된 퀴즈 목록에서 제거하는 로직이 필요함
  }
};

const showErrorModal = (title: string, message: string, type = 'error') => {
  if (type === 'success') {
    // 성공 메시지는 팝업 모달로 표시
    successInfo.value = { title, message };
    showSuccessModal.value = true;
  } else {
    // 오류나 정보 메시지는 기존 방식으로 표시
    errorInfo.value = { title, message, type };
    showError.value = true;
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successInfo.value = {};
};

const inferContentType = (title: string) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('수학') || titleLower.includes('분수') || titleLower.includes('계산')) {
    return 'math';
  } else if (titleLower.includes('과학') || titleLower.includes('식물') || titleLower.includes('광합성')) {
    return 'science';
  } else if (titleLower.includes('국어') || titleLower.includes('영어') || titleLower.includes('언어')) {
    return 'language';
  } else if (titleLower.includes('역사') || titleLower.includes('조선') || titleLower.includes('독립')) {
    return 'history';
  }
  return 'general';
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  return 'score-needs-improvement';
};

const getContentTypeText = (type: string) => {
  const types = {
    'math': '수학',
    'science': '과학', 
    'language': '언어',
    'history': '역사',
    'general': '일반'
  };
  return types[type] || '일반';
};

// 파일 처리 함수들
const triggerFileSelect = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  if (file.type !== 'application/pdf') {
    showErrorModal('파일 형식 오류', 'PDF 파일만 업로드 가능합니다.');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    showErrorModal('파일 크기 오류', '파일 크기는 10MB 이하여야 합니다.');
    return;
  }
  
  selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// PDF 텍스트 추출 함수 (데모용 - 실제로는 PDF.js 등 사용)
const extractPDFText = async (file) => {
  // 실제 구현에서는 PDF.js나 서버에서 텍스트 추출
  // 여기서는 데모용으로 파일명 기반 더미 텍스트 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoText = `이것은 ${file.name}에서 추출된 텍스트입니다. \n\n실제 구현에서는 PDF.js 라이브러리를 사용하여 PDF의 실제 텍스트 내용을 추출합니다. \n\n추출된 텍스트는 AI 요약 모델에 전달되어 학습자를 위한 맞춤형 요약을 생성하는 데 사용됩니다.`;
      resolve(demoText);
    }, 1000);
  });
};

const getFloatingStyle = (index: number) => {
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = Math.random() * 6 + 8;
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 학생 관리 메서드들
const selectStudent = (studentId) => {
  selectedStudentId.value = studentId;
};

const addStudent = () => {
  console.log('학생 추가');
  // TODO: 학생 추가 모달 열기
};

const editStudent = () => {
  if (!selectedStudentId.value) {
    alert('수정할 학생을 선택해주세요.');
    return;
  }
  console.log('학생 수정:', selectedStudentId.value);
  // TODO: 학생 수정 모달 열기
};

const deleteStudent = () => {
  if (!selectedStudentId.value) {
    alert('삭제할 학생을 선택해주세요.');
    return;
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    students.value = students.value.filter(s => s.id !== selectedStudentId.value);
    selectedStudentId.value = null;
  }
};

// 문제 관리 메서드들
const selectProblem = (problemId) => {
  selectedProblemId.value = problemId;
};

const addProblem = () => {
  console.log('문제 추가');
  // TODO: 문제 추가 모달 열기
};

const editProblem = () => {
  if (!selectedProblemId.value) {
    alert('수정할 문제를 선택해주세요.');
    return;
  }
  console.log('문제 수정:', selectedProblemId.value);
  // TODO: 문제 수정 모달 열기
};

const deleteProblem = () => {
  if (!selectedProblemId.value) {
    alert('삭제할 문제를 선택해주세요.');
    return;
  }
  if (confirm('정말 삭제하시겠습니까?')) {
    problems.value = problems.value.filter(p => p.id !== selectedProblemId.value);
    selectedProblemId.value = null;
  }
};

// 문제 타입 아이콘 반환
const getProblemTypeIcon = (type) => {
  const icons = {
    'multiple': '📝',
    'matching': '🔗',
    'reading': '📖',
    'image': '🖼️'
  };
  return icons[type] || '❓';
};

// 문제 상태 텍스트 반환
const getProblemStatusText = (status) => {
  const statusTexts = {
    'active': '활성',
    'draft': '임시저장',
    'inactive': '비활성'
  };
  return statusTexts[status] || '알 수 없음';
};
</script>

<style scoped>
.teacher-main-page {
  min-height: 100vh;
  position: relative;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #ffb000;
  background: linear-gradient(135deg, #ffb000 0%, #ffc107 50%, #ff9500 100%);
}

/* 배경 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #87ceeb 0%, #b6d7ff 25%, #ddeeff 50%, #f0f8ff 75%, #e6f3ff 100%);
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
  border-radius: 50%;
  animation: float-gentle infinite linear;
}

.floating-element:nth-child(odd) {
  background: rgba(88, 204, 2, 0.15);
}

.floating-element:nth-child(even) {
  background: rgba(28, 176, 246, 0.15);
}

.floating-element:nth-child(3n) {
  background: rgba(206, 130, 255, 0.15);
}

/* 헤더 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(255, 193, 7, 0.3);
  padding: 1rem 0;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-header.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chick-mascot {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.chick-mascot:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.chick-body {
  font-size: 28px;
  position: relative;
  z-index: 1;
}

.chick-glasses {
  position: absolute;
  font-size: 20px;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.user-greeting {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

/* 메인 컨텐츠 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* 상단 섹션 (학습 자료 업로드) */
.top-section {
  margin-bottom: 2rem;
}

/* 하단 섹션 (담당 학생 관리 & 생성된 문제 관리) */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* 카드 공통 스타일 - 듀오링고 실제 스타일 */
.card {
  background: #fef7e0;
  background: linear-gradient(145deg, #fef7e0 0%, #fdf4d3 100%);
  border-radius: 32px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(255, 149, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 4px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 40px rgba(255, 149, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.6);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* 듀오링고 스타일 메뉴 아이템 */
.duolingo-menu-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.duolingo-menu-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  border-color: rgba(88, 204, 2, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.duolingo-menu-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.duolingo-menu-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.upload-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.materials-icon {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.students-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stats-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

/* 업로드 섹션 */
.upload-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.upload-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* 키워드 필터 스타일 */
.materials-filter {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.filter-header {
  margin-bottom: 0.75rem;
}

.filter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.filter-tab.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
}

.filter-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* 배정된 문제 스타일 */
.assigned-quizzes-section {
  margin-bottom: 1.5rem;
}

.empty-assignments {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

.empty-assignments .empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.empty-assignments .empty-text {
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.25rem;
}

.empty-assignments .empty-subtext {
  font-size: 0.875rem;
  color: #64748b;
}

.assigned-quizzes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assigned-quiz-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.assigned-quiz-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quiz-image-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.quiz-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quiz-placeholder-image {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #94a3b8;
}

.quiz-info {
  flex: 1;
}

.quiz-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.quiz-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.quiz-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.quiz-difficulty {
  padding: 0.125rem 0.5rem;
  background: #f1f5f9;
  border-radius: 4px;
  font-weight: 500;
}

.quiz-separator {
  color: #cbd5e1;
}

.quiz-status {
  flex-shrink: 0;
}

.status-badge.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.status-badge.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

/* 퀴즈 액션 버튼 스타일 */
.quiz-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* 클릭 가능한 통계 항목 스타일 */
.stat-item.clickable {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-click-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #64748b;
}

.stat-item.clickable:hover .stat-click-indicator {
  opacity: 1;
}

/* 통계 상세보기 모달 스타일 */
.stat-detail-modal {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-detail-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 2rem;
}

.stat-detail-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.overview-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.overview-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.overview-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.breakdown-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.breakdown-label {
  min-width: 80px;
  font-weight: 500;
  color: #374151;
}

.breakdown-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  transition: width 0.3s ease;
}

.breakdown-count {
  min-width: 40px;
  text-align: right;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* 학생 그리드 */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.student-detail-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.student-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.student-detail-info {
  flex: 1;
}

.student-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.student-score {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.student-activity-time {
  font-size: 0.75rem;
  color: #64748b;
}

/* 점수 분포 차트 */
.distribution-chart {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.distribution-bar {
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  margin-bottom: 1rem;
}

.bar-segment {
  height: 100%;
}

.bar-segment.excellent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bar-segment.good {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.bar-segment.average {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.bar-segment.poor {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.distribution-labels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.distribution-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.label-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.label-color.excellent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.label-color.good {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.label-color.average {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.label-color.poor {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* 활동 타임라인 */
.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-dot.active {
  background: #10b981;
}

.timeline-dot.recent {
  background: #f59e0b;
}

.timeline-dot.inactive {
  background: #64748b;
}

.timeline-content {
  flex: 1;
}

.timeline-student {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.timeline-activity {
  font-size: 0.875rem;
  color: #64748b;
}

/* 퀴즈 미리보기 스타일 */
.quiz-preview {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
}

.preview-placeholder {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.placeholder-text {
  font-size: 1rem;
  font-weight: 500;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.preview-image {
  max-width: 300px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-image-placeholder {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
}

.image-placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.image-placeholder-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.preview-question {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.preview-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-main-options {
  display: flex;
  gap: 1rem;
}

.preview-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  flex: 1;
}

.preview-option.main-option {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.preview-option.help-option {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  justify-content: center;
}

.option-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.help-option .option-number {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.option-text {
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.help-badge {
  font-size: 0.75rem;
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 600;
}

.preview-answer-info {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-indicator {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.correct-answer {
  color: #059669;
  font-weight: 700;
}

.hint-info {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.form-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* 파일 업로드 스타일 */
.file-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-placeholder .upload-icon {
  font-size: 2rem;
}

.upload-text {
  text-align: center;
}

.upload-main {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.upload-sub {
  font-size: 0.875rem;
  color: #6b7280;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  border: 1px solid #3b82f6;
}

.file-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.875rem;
  color: #6b7280;
}

.remove-file {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fee2e2;
  border: none;
  border-radius: 8px;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background: #fecaca;
  color: #b91c1c;
}

.upload-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.upload-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.upload-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
}

/* AI 요약 */
.ai-summary {
  padding: 1.5rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-icon {
  font-size: 1.5rem;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.summary-content {
  color: #1e3a8a;
  line-height: 1.6;
  white-space: pre-line;
}

/* 자료 목록 섹션 */
.materials-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.materials-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  margin: 0;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.material-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.material-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.material-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.material-info {
  flex: 1;
}

.material-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.material-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.material-separator {
  color: #d1d5db;
}

.material-type {
  font-size: 0.875rem;
  color: #6b7280;
}

.material-date {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* 키워드 스타일 */
.material-keywords {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.keywords-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%);
  color: #0891b2;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #a5d6f3;
}

/* 요약 스타일 */
.material-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.summary-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.summary-content {
  padding: 0.75rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
  white-space: pre-wrap;
}

/* 자료 상세보기 모달 스타일 */
.material-detail-modal {
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.material-detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.detail-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-keyword-tag {
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
  color: #7c3aed;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #a78bfa;
}

.detail-summary {
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
}

.generated-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  min-height: 200px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  min-height: 200px;
}

.image-placeholder.small {
  padding: 1rem;
  min-height: 150px;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.7;
}

.placeholder-text {
  text-align: center;
}

.placeholder-main {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.25rem;
}

.placeholder-sub {
  font-size: 0.875rem;
  color: #64748b;
}

.generated-image-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.generated-image-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.generated-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.image-caption {
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  text-align: center;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.view-btn {
  background: linear-gradient(135deg, #0064FF 0%, #0047B3 100%);
  color: white;
}

.view-btn:hover {
  background: linear-gradient(135deg, #0047B3 0%, #003580 100%);
  transform: translateY(-1px);
}

/* 퀴즈 생성 모달 스타일 */
.quiz-generation-modal {
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quiz-generation-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.generation-section {
  margin-bottom: 2rem;
}

.generation-section:last-child {
  margin-bottom: 0;
}

.quiz-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #0064FF;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}

.student-selection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.student-checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.student-checkbox-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #0064FF;
}

.student-info-mini {
  flex: 1;
}

.student-name-mini {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.student-score-mini {
  font-size: 0.75rem;
  color: #6b7280;
}

.quiz-preview {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
}

.preview-question {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.preview-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-option {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #374151;
}

/* 학생 관리 모달 스타일 */
.student-manage-modal {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.student-manage-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.student-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #0064FF;
  box-shadow: 0 0 0 3px rgba(0, 100, 255, 0.1);
}

/* 헤더 액션 스타일 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-student-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-student-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 학생 액션 버튼 스타일 */
.student-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-button {
  background: linear-gradient(135deg, #0064FF 0%, #0047B3 100%);
  color: white;
}

.view-button:hover {
  background: linear-gradient(135deg, #0047B3 0%, #003580 100%);
  transform: translateY(-1px);
}

.edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
}

.delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.api-used {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.status-badge.demo-mode {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

/* 학생 섹션 */
.students-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
}

.students-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.refresh-button:hover:not(:disabled) {
  background: #e5e7eb;
  color: #374151;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.student-item:hover {
  background: #f3f4f6;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
}

.student-info {
  flex: 1;
}

.student-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.student-progress,
.student-activity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.progress-label,
.activity-label {
  color: #6b7280;
}

.progress-score {
  font-weight: 600;
}

.progress-score.score-excellent {
  color: #059669;
}

.progress-score.score-good {
  color: #d97706;
}

.progress-score.score-needs-improvement {
  color: #dc2626;
}

.activity-time {
  color: #374151;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
}

/* 통계 섹션 */
.stats-section {
  grid-column: 1 / -1;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
}

.stats-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-icon-small {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.25rem;
  opacity: 0.3;
}

/* 듀오링고 스타일 메뉴 그리드 */
.duolingo-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.duolingo-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.duolingo-menu-item:hover {
  transform: translateY(-2px);
  border-color: #fbbf24;
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.2);
  background: linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%);
}

.duolingo-menu-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.duolingo-menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #58cc02 0%, #4ade80 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 3px 0 #22c55e;
  transition: all 0.15s ease;
}

.duolingo-menu-item:hover .duolingo-menu-icon {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 #22c55e, 0 2px 8px rgba(34, 197, 94, 0.3);
}

.duolingo-menu-item:active .duolingo-menu-icon {
  transform: translateY(1px);
  box-shadow: 0 2px 0 #22c55e;
}

.duolingo-menu-text {
  flex: 1;
}

.duolingo-menu-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.125rem;
  line-height: 1.3;
}

.duolingo-menu-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.2;
}

/* API 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: modal-fade-in 0.3s ease;
}

.api-modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modal-slide-in 0.3s ease;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-content {
  margin-bottom: 2rem;
}

.modal-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
}

.feature-icon {
  font-size: 1.25rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #58cc02 0%, #89e219 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 0 #46a302;
  position: relative;
  top: 0;
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #46a302, 0 4px 12px rgba(88, 204, 2, 0.3);
  background: linear-gradient(135deg, #66d915 0%, #58cc02 100%);
}

.primary-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #46a302;
}

.secondary-button {
  padding: 1rem 1.5rem;
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  color: #1cb0f6;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 0 #d1d5db;
  position: relative;
  top: 0;
}

.secondary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #d1d5db, 0 4px 12px rgba(28, 176, 246, 0.2);
  border-color: #1cb0f6;
  color: #0ea5e9;
}

.secondary-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #d1d5db;
}


/* 학생 상세 모달 */
.student-modal {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modal-slide-in 0.3s ease;
}

.student-modal .modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 10;
}

.student-modal-avatar {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.modal-title-section {
  flex: 1;
}

.student-modal .modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.student-modal .modal-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.student-modal .modal-content {
  padding: 1.5rem 2rem 2rem 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 기본 정보 섹션 */
.info-section {
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

/* 학습 활동 현황 */
.activity-section {
  margin-bottom: 2rem;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.activity-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.activity-stat .stat-icon {
  font-size: 1.5rem;
}

.activity-stat .stat-content {
  flex: 1;
}

.activity-stat .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-stat .stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* 퀴즈 결과 섹션 */
.quiz-results-section {
  margin-bottom: 2rem;
}

.quiz-results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quiz-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.quiz-result-item:hover {
  background: #f3f4f6;
}

.quiz-result-info {
  flex: 1;
}

.quiz-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.quiz-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.quiz-result-score {
  font-size: 1.125rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #f3f4f6;
}

/* 추천사항 섹션 */
.recommendations-section {
  margin-bottom: 1rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 1px solid #f59e0b;
}

.recommendation-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
}

.recommendation-title {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.recommendation-description {
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.5;
}

.student-modal .modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 20px 20px;
}

/* 자료 수정 모달 */
.edit-modal {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modal-slide-in 0.3s ease;
}

.edit-modal .modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 10;
}

.modal-icon.edit-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 15px;
  flex-shrink: 0;
}

.edit-modal .modal-content {
  padding: 1.5rem 2rem 2rem 2rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-modal .modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 20px 20px;
}

/* 자료 액션 버튼 */
.material-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
}

/* 애니메이션 */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-slide-in {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 반응형 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .header-content {
    padding: 0 1rem;
  }

  .card {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .student-modal {
    width: 95%;
    max-height: 95vh;
  }

  .student-modal .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .student-modal .modal-content {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }

  .student-modal .modal-actions {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .activity-stats {
    grid-template-columns: 1fr;
  }

  .edit-modal {
    width: 95%;
    max-height: 95vh;
  }

  .edit-modal .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .edit-modal .modal-content {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }

  .edit-modal .modal-actions {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .duolingo-menu-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .duolingo-menu-item {
    padding: 0.875rem 1rem;
  }

  .duolingo-menu-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .api-modal {
    padding: 2rem;
  }

  .upload-placeholder {
    padding: 1rem;
  }

  .file-upload-area {
    padding: 1.5rem;
  }

  .file-selected {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .upload-section,
  .materials-section,
  .students-section,
  .stats-section,
  .card,
  .upload-button,
  .action-button {
    transition: none;
  }
  
  .floating-element,
  .loading-spinner {
    animation: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid #000000;
  }
  
  .upload-button,
  .primary-button {
    background: #000080;
  }
}

/* 키워드별 그룹 스타일 - 듀오링고 스타일 */
.keyword-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.keyword-group {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.keyword-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(88, 204, 2, 0.2);
}

.keyword-group-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.keyword-icon {
  font-size: 1.5rem;
}

.keyword-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.keyword-count {
  font-size: 1rem;
  font-weight: 600;
  color: #58cc02;
  background: rgba(88, 204, 2, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #1cb0f6 0%, #0ea5e9 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 3px 0 #0284c7;
}

.view-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 #0284c7, 0 3px 8px rgba(28, 176, 246, 0.3);
}

.view-all-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 0 #0284c7;
}

.show-more-container {
  text-align: center;
  margin-top: 1rem;
}

.show-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ce82ff 0%, #a855f7 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 3px 0 #7c3aed;
}

.show-more-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 #7c3aed, 0 3px 8px rgba(206, 130, 255, 0.3);
}

.show-more-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 0 #7c3aed;
}

/* 성공 확인 모달 스타일 */
.success-confirmation-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalIn 0.3s ease-out;
}

.success-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  color: white;
}

.success-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-content {
  padding: 1.5rem;
  text-align: center;
}

.success-message {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 0;
}

.success-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 관리 섹션 스타일 */
.management-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.add-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.quiz-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.quiz-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.view-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.view-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 스크롤 가능한 리스트 */
.management-content {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.management-content::-webkit-scrollbar {
  width: 6px;
}

.management-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.management-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.management-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 학생 아이템 선택 상태 */
.student-item.selected {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  border: 1px solid #3b82f6;
}

/* 문제 관리 블록 아이템 스타일 */
.problem-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.problem-item:hover {
  background: #f3f4f6;
}

.problem-item.selected {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 1px solid #8b5cf6;
}

.problem-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.problem-info {
  flex: 1;
}

.problem-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.problem-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.problem-subject {
  color: #6b7280;
}

.problem-difficulty {
  padding: 0.125rem 0.5rem;
  background: #f1f5f9;
  border-radius: 4px;
  font-weight: 500;
  color: #374151;
}

.problem-type {
  color: #8b5cf6;
  font-weight: 500;
}

.problem-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.problem-status.active {
  background: #dcfce7;
  color: #16a34a;
}

.problem-status.inactive {
  background: #fee2e2;
  color: #dc2626;
}
</style>