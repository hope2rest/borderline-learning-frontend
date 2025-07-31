// 토스 스페이싱 시스템
export const spacing = {
  // 기본 단위 (8px 기준)
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// 토스 특화 스페이싱 프리셋
export const spacingPresets = {
  // 컴포넌트 내부 패딩
  componentPadding: {
    xs: spacing[2],   // 8px
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },

  // 섹션 간 마진
  sectionMargin: {
    xs: spacing[4],   // 16px
    sm: spacing[6],   // 24px
    md: spacing[8],   // 32px
    lg: spacing[12],  // 48px
    xl: spacing[16],  // 64px
  },

  // 카드 패딩
  cardPadding: {
    xs: spacing[4],   // 16px
    sm: spacing[5],   // 20px
    md: spacing[6],   // 24px
    lg: spacing[8],   // 32px
  },

  // 버튼 패딩
  buttonPadding: {
    xs: `${spacing[1.5]} ${spacing[3]}`,  // 6px 12px
    sm: `${spacing[2]} ${spacing[4]}`,    // 8px 16px
    md: `${spacing[3]} ${spacing[6]}`,    // 12px 24px
    lg: `${spacing[4]} ${spacing[8]}`,    // 16px 32px
  },

  // 인풋 패딩
  inputPadding: {
    xs: `${spacing[2]} ${spacing[3]}`,    // 8px 12px
    sm: `${spacing[2.5]} ${spacing[4]}`,  // 10px 16px
    md: `${spacing[3]} ${spacing[4]}`,    // 12px 16px
    lg: `${spacing[4]} ${spacing[5]}`,    // 16px 20px
  },
} as const;

// 브레이크포인트 (토스 반응형 디자인)
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 컨테이너 최대 너비
export const containerMaxWidth = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// z-index 레벨
export const zIndex = {
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const;

// 타입 정의
export type Spacing = keyof typeof spacing;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;

// 유틸리티 함수
export const getSpacing = (size: Spacing) => {
  return spacing[size];
};

export const getBreakpoint = (size: Breakpoint) => {
  return breakpoints[size];
};

export const getZIndex = (level: ZIndex) => {
  return zIndex[level];
};