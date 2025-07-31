import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '../views/SplashScreen.vue'
import UserSelectionView from '../views/UserSelectionView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import StudentMainPage from '../views/StudentMainPage.vue'
import TeacherMainPage from '../views/TeacherMainPage.vue'
import ParentMainPage from '../views/ParentMainPage.vue'
import QuizView from '../views/QuizView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'splash',
      component: SplashScreen,
      meta: { 
        title: '경계선 지능인 학습 지원 서비스',
        skipAuth: true 
      }
    },
    {
      path: '/user-selection',
      name: 'user-selection',
      component: UserSelectionView,
      meta: { 
        title: '사용자 선택 - 경계선 지능인 학습 지원 서비스',
        skipAuth: true 
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        title: '로그인 - 경계선 지능인 학습 지원 서비스',
        skipAuth: true 
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { 
        title: '대시보드 - 경계선 지능인 학습 지원 서비스',
        requiresAuth: true 
      }
    },
    {
      path: '/student',
      name: 'student',
      component: StudentMainPage,
      meta: { 
        title: '학습자 - 경계선 지능인 학습 지원 서비스',
        requiresAuth: true,
        allowedRoles: ['student']
      }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeacherMainPage,
      meta: { 
        title: '선생님 - 경계선 지능인 학습 지원 서비스',
        requiresAuth: true,
        allowedRoles: ['teacher']
      }
    },
    {
      path: '/parent',
      name: 'parent',
      component: ParentMainPage,
      meta: { 
        title: '학부모 - 경계선 지능인 학습 지원 서비스',
        requiresAuth: true,
        allowedRoles: ['parent']
      }
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView,
      meta: { 
        title: '퀴즈 - 경계선 지능인 학습 지원 서비스',
        requiresAuth: true 
      }
    },
  ],
})

// 라우터 가드
router.beforeEach((to, from, next) => {
  console.log('🛣️ 라우터 이동:', { from: from.path, to: to.path });
  const authStore = useAuthStore()
  
  // 페이지 제목 설정
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 스플래시 화면은 항상 표시
  if (to.path === '/') {
    next()
    return
  }
  
  // 스플래시 화면은 인증 확인 건너뛰기
  if (to.meta.skipAuth) {
    next()
    return
  }
  
  // 새로고침 시 로컬스토리지에서 인증 상태 복원
  authStore.checkAuth()
  
  // 인증이 필요한 페이지인데 로그인하지 않은 경우, 자동으로 학습자1로 로그인
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    authStore.login(1) // 학습자1로 자동 로그인
  }
  
  // 로그인 페이지에 이미 로그인된 상태로 접근하면 대시보드로 리다이렉트
  if (to.path === '/login' && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
