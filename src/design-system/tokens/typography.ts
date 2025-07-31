// 토스 타이포그래피 시스템
export const typography = {
  // 폰트 패밀리
  fontFamily: {
    primary: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'sans-serif',
    ].join(', '),
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Roboto Mono',
      'Consolas',
      'Liberation Mono',
      'Menlo',
      'Courier',
      'monospace',
    ].join(', '),
  },

  // 폰트 사이즈 (토스 스타일)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // 폰트 가중치
  fontWeight: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },

  // 라인 높이
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // 토스 스타일 텍스트 프리셋
  textStyles: {
    // 헤딩
    'heading-1': {
      fontSize: '2.25rem', // 36px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    'heading-2': {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    'heading-3': {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '-0.025em',
    },
    'heading-4': {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '-0.025em',
    },
    'heading-5': {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '-0.025em',
    },
    'heading-6': {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '-0.025em',
    },

    // 본문
    'body-large': {
      fontSize: '1.125rem', // 18px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    'body-medium': {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    'body-small': {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    'body-xs': {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },

    // 버튼
    'button-large': {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0em',
    },
    'button-medium': {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0em',
    },
    'button-small': {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0em',
    },

    // 캡션
    'caption-large': {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: '0em',
    },
    'caption-medium': {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: '0em',
    },
    'caption-small': {
      fontSize: '0.625rem', // 10px
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: '0em',
    },
  },
} as const;

// 타이포그래피 타입 정의
export type TextStyle = keyof typeof typography.textStyles;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;

// 타이포그래피 유틸리티 함수
export const getTextStyle = (style: TextStyle) => {
  return typography.textStyles[style];
};

export const getFontSize = (size: FontSize) => {
  return typography.fontSize[size];
};

export const getFontWeight = (weight: FontWeight) => {
  return typography.fontWeight[weight];
};