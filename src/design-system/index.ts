// 토스 스타일 디자인 시스템 메인 엔트리포인트

// 토큰 시스템
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/shadows';

// 컴포넌트 시스템
export { default as TossButton } from './components/buttons/TossButton.vue';
export { default as TossCard } from './components/display/TossCard.vue';
export { default as TossInput } from './components/forms/TossInput.vue';
export { default as TossSpinner } from './components/feedback/TossSpinner.vue';

// 애니메이션 시스템
export * from './animations/transitions';

// 전역 스타일 및 유틸리티
export * from './utils/index';

// 디자인 시스템 설정
export const tossDesignSystem = {
  name: 'Toss Design System',
  version: '1.0.0',
  description: '토스 스타일 디자인 시스템 for 경계선 지능인 학습 지원 서비스',
  
  // 브랜드 정보
  brand: {
    name: '경계선 지능인 학습 지원 서비스',
    primaryColor: '#0064FF',
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  },

  // 설정 옵션
  config: {
    // 다크 모드 지원
    darkMode: false,
    
    // 반응형 디자인
    responsive: true,
    
    // 애니메이션 지원
    animations: true,
    
    // 접근성 지원
    a11y: true,
    
    // RTL 지원
    rtl: false,
  },

  // 테마 설정
  theme: {
    // 기본 테마
    default: {
      colors: {
        primary: '#0064FF',
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FFFFFF',
        surface: '#F8F9FA',
        text: '#111827',
      },
      
      spacing: {
        base: '8px',
        scale: 'linear',
      },
      
      borderRadius: {
        base: '8px',
        scale: 'sm:4px, md:8px, lg:12px, xl:16px',
      },
      
      typography: {
        fontFamily: 'Pretendard',
        scale: 'minor-third',
      },
      
      shadows: {
        level: 'soft',
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },

  // 컴포넌트 기본 설정
  components: {
    TossButton: {
      defaultVariant: 'primary',
      defaultSize: 'md',
      focusRing: true,
      animation: true,
    },
    
    TossCard: {
      defaultVariant: 'elevated',
      defaultSize: 'md',
      hover: true,
      animation: true,
    },
    
    TossInput: {
      defaultVariant: 'default',
      defaultSize: 'md',
      focusRing: true,
      clearable: false,
    },
    
    TossSpinner: {
      defaultSize: 'md',
      defaultColor: 'primary',
      animation: true,
    },
  },

  // 유틸리티 함수
  utils: {
    // 색상 조작
    colors: {
      lighten: (color: string, amount: number) => {
        // 색상 밝게 만들기
        return color; // 구현 필요
      },
      darken: (color: string, amount: number) => {
        // 색상 어둡게 만들기
        return color; // 구현 필요
      },
      alpha: (color: string, alpha: number) => {
        // 투명도 조절
        return color; // 구현 필요
      },
    },
    
    // 스페이싱 계산
    spacing: {
      calculate: (multiplier: number, base: number = 8) => {
        return `${base * multiplier}px`;
      },
    },
    
    // 반응형 유틸리티
    responsive: {
      breakpoints: {
        xs: '0px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
} as const;

// 타입 정의
export type TossDesignSystemConfig = typeof tossDesignSystem;
export type TossTheme = typeof tossDesignSystem.theme.default;
export type TossComponentConfig = typeof tossDesignSystem.components;

// 초기화 함수
export const initTossDesignSystem = (config?: Partial<TossDesignSystemConfig>) => {
  // 전역 CSS 변수 설정
  const root = document.documentElement;
  const theme = config?.theme?.default || tossDesignSystem.theme.default;
  
  // CSS 커스텀 프로퍼티 설정
  root.style.setProperty('--toss-color-primary', theme.colors.primary);
  root.style.setProperty('--toss-color-secondary', theme.colors.secondary);
  root.style.setProperty('--toss-color-success', theme.colors.success);
  root.style.setProperty('--toss-color-warning', theme.colors.warning);
  root.style.setProperty('--toss-color-error', theme.colors.error);
  root.style.setProperty('--toss-color-background', theme.colors.background);
  root.style.setProperty('--toss-color-surface', theme.colors.surface);
  root.style.setProperty('--toss-color-text', theme.colors.text);
  
  // 타이포그래피 설정
  root.style.setProperty('--toss-font-family', theme.typography.fontFamily);
  
  // 스페이싱 설정
  root.style.setProperty('--toss-spacing-base', theme.spacing.base);
  
  // 보더 라디우스 설정
  root.style.setProperty('--toss-border-radius-base', theme.borderRadius.base);
  
  console.log('🎨 Toss Design System initialized');
  
  return {
    ...tossDesignSystem,
    ...config,
  };
};