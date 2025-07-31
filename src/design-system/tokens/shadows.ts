// 토스 섀도우 시스템
export const shadows = {
  // 기본 섀도우
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // 토스 특화 섀도우
  toss: {
    // 카드 섀도우
    card: {
      default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      hover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      active: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },

    // 버튼 섀도우
    button: {
      default: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      hover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      active: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },

    // 모달 섀도우
    modal: {
      backdrop: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      content: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },

    // 드롭다운 섀도우
    dropdown: {
      default: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },

    // 플로팅 액션 버튼 섀도우
    fab: {
      default: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      hover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },

    // 토스트 섀도우
    toast: {
      default: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
  },

  // 컬러 섀도우 (토스 블루)
  colored: {
    primary: {
      sm: '0 1px 3px 0 rgb(0 100 255 / 0.1), 0 1px 2px -1px rgb(0 100 255 / 0.1)',
      md: '0 4px 6px -1px rgb(0 100 255 / 0.1), 0 2px 4px -2px rgb(0 100 255 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 100 255 / 0.1), 0 4px 6px -4px rgb(0 100 255 / 0.1)',
    },
    success: {
      sm: '0 1px 3px 0 rgb(76 175 80 / 0.1), 0 1px 2px -1px rgb(76 175 80 / 0.1)',
      md: '0 4px 6px -1px rgb(76 175 80 / 0.1), 0 2px 4px -2px rgb(76 175 80 / 0.1)',
    },
    error: {
      sm: '0 1px 3px 0 rgb(244 67 54 / 0.1), 0 1px 2px -1px rgb(244 67 54 / 0.1)',
      md: '0 4px 6px -1px rgb(244 67 54 / 0.1), 0 2px 4px -2px rgb(244 67 54 / 0.1)',
    },
  },
} as const;

// 보더 시스템
export const borders = {
  // 보더 두께
  width: {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  // 보더 스타일
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  },

  // 보더 반지름 (토스 스타일)
  radius: {
    none: '0px',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // 토스 특화 보더 프리셋
  presets: {
    // 카드 보더
    card: {
      width: '1px',
      style: 'solid',
      radius: '0.75rem', // 12px
    },
    
    // 버튼 보더
    button: {
      width: '1px',
      style: 'solid',
      radius: '0.5rem', // 8px
    },
    
    // 인풋 보더
    input: {
      width: '1px',
      style: 'solid',
      radius: '0.375rem', // 6px
    },
    
    // 모달 보더
    modal: {
      width: '0px',
      style: 'none',
      radius: '1rem', // 16px
    },
  },
} as const;

// 타입 정의
export type Shadow = keyof typeof shadows;
export type BorderRadius = keyof typeof borders.radius;
export type BorderWidth = keyof typeof borders.width;

// 유틸리티 함수
export const getShadow = (shadow: Shadow) => {
  return shadows[shadow];
};

export const getBorderRadius = (radius: BorderRadius) => {
  return borders.radius[radius];
};

export const getBorderWidth = (width: BorderWidth) => {
  return borders.width[width];
};