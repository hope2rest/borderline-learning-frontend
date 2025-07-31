// 토스 애니메이션 시스템
export const transitions = {
  // 기본 트랜지션
  default: {
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    property: 'all',
  },

  // 토스 스타일 이징 함수
  easing: {
    // 기본 이징
    ease: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // 토스 커스텀 이징
    tossEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    tossEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    tossEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    tossEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // 바운스 이징
    bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // 백 이징
    backIn: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // 탄성 이징
    elasticOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // 지속 시간
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms',
  },

  // 페이지 트랜지션
  page: {
    // 슬라이드 트랜지션
    slideIn: {
      enter: {
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateX(100%)',
      },
      enterActive: {
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateX(0)',
      },
      leave: {
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateX(0)',
      },
      leaveActive: {
        duration: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateX(-100%)',
      },
    },

    // 페이드 트랜지션
    fade: {
      enter: {
        duration: '200ms',
        easing: 'ease-in-out',
        opacity: '0',
      },
      enterActive: {
        duration: '200ms',
        easing: 'ease-in-out',
        opacity: '1',
      },
      leave: {
        duration: '200ms',
        easing: 'ease-in-out',
        opacity: '1',
      },
      leaveActive: {
        duration: '200ms',
        easing: 'ease-in-out',
        opacity: '0',
      },
    },

    // 스케일 트랜지션
    scale: {
      enter: {
        duration: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(0.95)',
        opacity: '0',
      },
      enterActive: {
        duration: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(1)',
        opacity: '1',
      },
      leave: {
        duration: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(1)',
        opacity: '1',
      },
      leaveActive: {
        duration: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'scale(0.95)',
        opacity: '0',
      },
    },
  },

  // 컴포넌트 트랜지션
  component: {
    // 모달 트랜지션
    modal: {
      backdrop: {
        enter: 'opacity-0',
        enterActive: 'transition-opacity duration-300 ease-out',
        enterTo: 'opacity-100',
        leave: 'opacity-100',
        leaveActive: 'transition-opacity duration-200 ease-in',
        leaveTo: 'opacity-0',
      },
      content: {
        enter: 'opacity-0 transform scale-95',
        enterActive: 'transition-all duration-300 ease-out',
        enterTo: 'opacity-100 transform scale-100',
        leave: 'opacity-100 transform scale-100',
        leaveActive: 'transition-all duration-200 ease-in',
        leaveTo: 'opacity-0 transform scale-95',
      },
    },

    // 드롭다운 트랜지션
    dropdown: {
      enter: 'opacity-0 transform scale-95',
      enterActive: 'transition-all duration-200 ease-out',
      enterTo: 'opacity-100 transform scale-100',
      leave: 'opacity-100 transform scale-100',
      leaveActive: 'transition-all duration-150 ease-in',
      leaveTo: 'opacity-0 transform scale-95',
    },

    // 토스트 트랜지션
    toast: {
      enter: 'opacity-0 transform translate-y-2',
      enterActive: 'transition-all duration-300 ease-out',
      enterTo: 'opacity-100 transform translate-y-0',
      leave: 'opacity-100 transform translate-y-0',
      leaveActive: 'transition-all duration-200 ease-in',
      leaveTo: 'opacity-0 transform -translate-y-2',
    },

    // 슬라이드 트랜지션
    slideDown: {
      enter: 'opacity-0 transform -translate-y-4',
      enterActive: 'transition-all duration-300 ease-out',
      enterTo: 'opacity-100 transform translate-y-0',
      leave: 'opacity-100 transform translate-y-0',
      leaveActive: 'transition-all duration-200 ease-in',
      leaveTo: 'opacity-0 transform -translate-y-4',
    },

    slideUp: {
      enter: 'opacity-0 transform translate-y-4',
      enterActive: 'transition-all duration-300 ease-out',
      enterTo: 'opacity-100 transform translate-y-0',
      leave: 'opacity-100 transform translate-y-0',
      leaveActive: 'transition-all duration-200 ease-in',
      leaveTo: 'opacity-0 transform translate-y-4',
    },
  },

  // 마이크로 인터랙션
  microInteraction: {
    // 버튼 클릭
    buttonPress: {
      active: 'transform scale-95 transition-transform duration-100 ease-in-out',
      inactive: 'transform scale-100 transition-transform duration-100 ease-in-out',
    },

    // 카드 호버
    cardHover: {
      default: 'transform translate-y-0 shadow-md transition-all duration-200 ease-in-out',
      hover: 'transform -translate-y-1 shadow-lg transition-all duration-200 ease-in-out',
    },

    // 링크 호버
    linkHover: {
      default: 'text-blue-600 transition-colors duration-200 ease-in-out',
      hover: 'text-blue-700 transition-colors duration-200 ease-in-out',
    },

    // 인풋 포커스
    inputFocus: {
      default: 'border-gray-300 ring-0 transition-all duration-200 ease-in-out',
      focus: 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20 transition-all duration-200 ease-in-out',
    },
  },

  // 로딩 애니메이션
  loading: {
    // 스피너
    spin: {
      animation: 'spin 1s linear infinite',
    },

    // 펄스
    pulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },

    // 바운스
    bounce: {
      animation: 'bounce 1s infinite',
    },

    // 토스 스타일 로딩
    tossLoading: {
      animation: 'toss-loading 1.5s ease-in-out infinite',
    },
  },
} as const;

// 커스텀 CSS 애니메이션 정의
export const customAnimations = `
  @keyframes toss-loading {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.8);
      opacity: 0.5;
    }
  }

  @keyframes toss-slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes toss-slide-out-left {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  @keyframes toss-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes toss-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes toss-scale-in {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes toss-scale-out {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.8);
      opacity: 0;
    }
  }

  .toss-slide-in-right {
    animation: toss-slide-in-right 0.3s ease-out;
  }

  .toss-slide-out-left {
    animation: toss-slide-out-left 0.3s ease-in;
  }

  .toss-fade-in {
    animation: toss-fade-in 0.2s ease-out;
  }

  .toss-fade-out {
    animation: toss-fade-out 0.2s ease-in;
  }

  .toss-scale-in {
    animation: toss-scale-in 0.2s ease-out;
  }

  .toss-scale-out {
    animation: toss-scale-out 0.2s ease-in;
  }
`;

// 타입 정의
export type TransitionType = keyof typeof transitions.component;
export type EasingType = keyof typeof transitions.easing;
export type DurationType = keyof typeof transitions.duration;

// 유틸리티 함수
export const getTransition = (type: TransitionType) => {
  return transitions.component[type];
};

export const getEasing = (easing: EasingType) => {
  return transitions.easing[easing];
};

export const getDuration = (duration: DurationType) => {
  return transitions.duration[duration];
};

export const createTransition = (property: string, duration: DurationType, easing: EasingType) => {
  return `${property} ${getDuration(duration)} ${getEasing(easing)}`;
};