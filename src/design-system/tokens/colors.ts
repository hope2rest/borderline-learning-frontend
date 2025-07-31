// 토스 브랜드 컬러 시스템
export const colors = {
  // 브랜드 컬러 (토스 블루)
  primary: {
    50: '#E6F3FF',
    100: '#CCE7FF',
    200: '#99CFFF',
    300: '#66B7FF',
    400: '#339FFF',
    500: '#0064FF', // 토스 메인 블루
    600: '#0050CC',
    700: '#003C99',
    800: '#002866',
    900: '#001433',
  },

  // 그레이 스케일 (토스 스타일)
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A6',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    900: '#202124',
  },

  // 상태 컬러
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
  },

  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
  },

  // 토스 특화 컬러
  toss: {
    blue: '#0064FF',
    lightBlue: '#E6F3FF',
    darkBlue: '#003C99',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    accent: '#FF6B6B',
  },

  // 시멘틱 컬러
  semantic: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    border: '#E8EAED',
    divider: '#DADCE0',
    text: {
      primary: '#202124',
      secondary: '#5F6368',
      disabled: '#9AA0A6',
      inverse: '#FFFFFF',
    },
  },
} as const;

// 컬러 타입 정의
export type ColorScale = typeof colors.primary;
export type ColorKey = keyof typeof colors;
export type ColorValue = string;

// 컬러 유틸리티 함수
export const getColor = (scale: ColorScale, shade: keyof ColorScale = 500): string => {
  return scale[shade];
};

export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};