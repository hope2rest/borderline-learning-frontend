// 토스 디자인 시스템 유틸리티 함수들

// 색상 유틸리티
export const colorUtils = {
  // HEX를 RGB로 변환
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // RGB를 HEX로 변환
  rgbToHex: (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  // 색상 밝게 만들기
  lighten: (color: string, amount: number): string => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return color;
    
    const newR = Math.min(255, rgb.r + amount);
    const newG = Math.min(255, rgb.g + amount);
    const newB = Math.min(255, rgb.b + amount);
    
    return colorUtils.rgbToHex(newR, newG, newB);
  },

  // 색상 어둡게 만들기
  darken: (color: string, amount: number): string => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return color;
    
    const newR = Math.max(0, rgb.r - amount);
    const newG = Math.max(0, rgb.g - amount);
    const newB = Math.max(0, rgb.b - amount);
    
    return colorUtils.rgbToHex(newR, newG, newB);
  },

  // 투명도 추가
  withOpacity: (color: string, opacity: number): string => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return color;
    
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  // 색상 대비 계산
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = colorUtils.hexToRgb(color);
      if (!rgb) return 0;
      
      const { r, g, b } = rgb;
      const sR = r / 255;
      const sG = g / 255;
      const sB = b / 255;
      
      const rL = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
      const gL = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
      const bL = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
      
      return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // 접근성 색상 확인
  isAccessible: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const contrast = colorUtils.getContrastRatio(foreground, background);
    return level === 'AA' ? contrast >= 4.5 : contrast >= 7;
  },
};

// 스페이싱 유틸리티
export const spacingUtils = {
  // 기본 단위 계산
  calculate: (multiplier: number, base: number = 8): string => {
    return `${base * multiplier}px`;
  },

  // rem 단위 계산
  rem: (px: number, base: number = 16): string => {
    return `${px / base}rem`;
  },

  // 반응형 스페이싱
  responsive: (values: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }): string => {
    const breakpoints = {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    };

    let css = '';
    
    Object.entries(values).forEach(([breakpoint, value]) => {
      const bp = breakpoints[breakpoint as keyof typeof breakpoints];
      if (breakpoint === 'xs') {
        css += `${spacingUtils.calculate(value)};`;
      } else {
        css += `@media (min-width: ${bp}) { ${spacingUtils.calculate(value)} }`;
      }
    });

    return css;
  },
};

// 타이포그래피 유틸리티
export const typographyUtils = {
  // 폰트 크기 계산 (Type Scale)
  calculateFontSize: (step: number, base: number = 16, ratio: number = 1.2): string => {
    return `${base * Math.pow(ratio, step)}px`;
  },

  // 라인 높이 계산
  calculateLineHeight: (fontSize: number, ratio: number = 1.5): string => {
    return `${fontSize * ratio}px`;
  },

  // 텍스트 절단
  truncate: (lines: number = 1): string => {
    if (lines === 1) {
      return `
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `;
    }
    
    return `
      display: -webkit-box;
      -webkit-line-clamp: ${lines};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `;
  },

  // 반응형 폰트 크기
  responsiveFontSize: (min: number, max: number, minVw: number = 320, maxVw: number = 1200): string => {
    const slope = (max - min) / (maxVw - minVw);
    const intercept = min - slope * minVw;
    
    return `
      font-size: ${min}px;
      font-size: clamp(${min}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px);
    `;
  },
};

// 레이아웃 유틸리티
export const layoutUtils = {
  // 중앙 정렬
  center: (axis: 'both' | 'horizontal' | 'vertical' = 'both'): string => {
    switch (axis) {
      case 'horizontal':
        return 'margin-left: auto; margin-right: auto;';
      case 'vertical':
        return 'margin-top: auto; margin-bottom: auto;';
      case 'both':
      default:
        return 'margin: auto;';
    }
  },

  // 플렉스 유틸리티
  flex: (direction: 'row' | 'column' = 'row', justify: string = 'center', align: string = 'center'): string => {
    return `
      display: flex;
      flex-direction: ${direction};
      justify-content: ${justify};
      align-items: ${align};
    `;
  },

  // 그리드 유틸리티
  grid: (columns: number, gap: string = '1rem'): string => {
    return `
      display: grid;
      grid-template-columns: repeat(${columns}, 1fr);
      gap: ${gap};
    `;
  },

  // 반응형 그리드
  responsiveGrid: (breakpoints: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }): string => {
    const bps = {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    };

    let css = 'display: grid; gap: 1rem;';
    
    Object.entries(breakpoints).forEach(([breakpoint, columns]) => {
      const bp = bps[breakpoint as keyof typeof bps];
      if (breakpoint === 'xs') {
        css += `grid-template-columns: repeat(${columns}, 1fr);`;
      } else {
        css += `@media (min-width: ${bp}) { grid-template-columns: repeat(${columns}, 1fr); }`;
      }
    });

    return css;
  },
};

// 애니메이션 유틸리티
export const animationUtils = {
  // 키프레임 생성
  keyframes: (name: string, frames: Record<string, string>): string => {
    let css = `@keyframes ${name} {`;
    
    Object.entries(frames).forEach(([key, value]) => {
      css += `${key} { ${value} }`;
    });
    
    css += '}';
    return css;
  },

  // 트랜지션 생성
  transition: (property: string, duration: string = '0.2s', easing: string = 'ease-in-out'): string => {
    return `transition: ${property} ${duration} ${easing};`;
  },

  // 바운스 효과
  bounce: (scale: number = 0.95): string => {
    return `
      transition: transform 0.1s ease-in-out;
      &:active {
        transform: scale(${scale});
      }
    `;
  },

  // 호버 효과
  hover: (property: string, value: string, duration: string = '0.2s'): string => {
    return `
      transition: ${property} ${duration} ease-in-out;
      &:hover {
        ${property}: ${value};
      }
    `;
  },
};

// 접근성 유틸리티
export const a11yUtils = {
  // 스크린 리더 전용 텍스트
  srOnly: (): string => {
    return `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
  },

  // 포커스 스타일
  focus: (color: string = '#0064FF', width: string = '2px', offset: string = '2px'): string => {
    return `
      outline: ${width} solid ${color};
      outline-offset: ${offset};
    `;
  },

  // 고대비 모드 확인
  highContrast: (styles: string): string => {
    return `
      @media (prefers-contrast: high) {
        ${styles}
      }
    `;
  },

  // 모션 감소 선호 확인
  reduceMotion: (styles: string): string => {
    return `
      @media (prefers-reduced-motion: reduce) {
        ${styles}
      }
    `;
  },
};

// 반응형 유틸리티
export const responsiveUtils = {
  // 브레이크포인트
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // 미디어 쿼리 생성
  mediaQuery: (breakpoint: string, styles: string): string => {
    return `@media (min-width: ${breakpoint}) { ${styles} }`;
  },

  // 컨테이너 쿼리 생성
  containerQuery: (condition: string, styles: string): string => {
    return `@container (${condition}) { ${styles} }`;
  },

  // 반응형 값 계산
  clamp: (min: string, preferred: string, max: string): string => {
    return `clamp(${min}, ${preferred}, ${max})`;
  },
};

// 모든 유틸리티를 하나로 통합
export const tossUtils = {
  color: colorUtils,
  spacing: spacingUtils,
  typography: typographyUtils,
  layout: layoutUtils,
  animation: animationUtils,
  a11y: a11yUtils,
  responsive: responsiveUtils,
};

// 타입 정의
export type TossUtils = typeof tossUtils;
export type ColorUtils = typeof colorUtils;
export type SpacingUtils = typeof spacingUtils;
export type TypographyUtils = typeof typographyUtils;
export type LayoutUtils = typeof layoutUtils;
export type AnimationUtils = typeof animationUtils;
export type A11yUtils = typeof a11yUtils;
export type ResponsiveUtils = typeof responsiveUtils;