// 목업 퀴즈 데이터 - OX 퀴즈 형태로 변경
export const mockQuizzes = [
  {
    id: 0,
    question_text: '남자아이가 보트를 타고 있어요',
    question_image_url: '/images/quiz-1-boat.png',
    option_o: '맞다',
    option_x: '틀리다',
    correct_answer: 'o',
    explanation: '그림을 보면 남자아이가 노를 저으며 보트를 타고 있어요.',
    isSample: true
  },
  {
    id: 1,
    question_text: '사람이 눈을 감고 있어요',
    question_image_url: '/images/quiz-2-eye.png',
    option_o: '맞다',
    option_x: '틀리다',
    correct_answer: 'x',
    explanation: '그림을 보면 사람의 눈이 크게 떠 있어요. 눈을 감고 있지 않아요.',
    isSample: true
  },
  {
    id: 2,
    question_text: '눈이 오고 있어요',
    question_image_url: '/images/quiz-3-snow.png',
    option_o: '맞다',
    option_x: '틀리다',
    correct_answer: 'o',
    explanation: '그림을 보면 하늘에서 눈이 내리고 있고 눈이 쌓여 있어요.',
    isSample: true
  },
  {
    id: 3,
    question_text: '시계를 손목에 했어요',
    question_image_url: '/images/quiz-4-watch.png',
    option_o: '맞다',
    option_x: '틀리다',
    correct_answer: 'o',
    explanation: '그림을 보면 손목에 시계를 차고 있어요.'
  }
]

// 목업 사용자 데이터
export const mockUsers = [
  { id: 1, username: '김민수', role: 'student', fullName: '김민수 학습자' },
  { id: 2, username: '이지은', role: 'student', fullName: '이지은 학습자' },
  { id: 3, username: '박혜진', role: 'teacher', fullName: '박혜진 선생님' },
  { id: 4, username: '최영호', role: 'parent', fullName: '최영호 학부모' },
  { id: 5, username: '관리자', role: 'admin', fullName: '시스템 관리자' }
]