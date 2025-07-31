// API 서비스 - 실제 Django 백엔드와 연동할 준비
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.geminiApiKey = GEMINI_API_KEY
    this.openaiApiKey = OPENAI_API_KEY
  }

  // 헤더 설정 (향후 JWT 토큰 등 추가 가능)
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // 향후 인증 토큰 추가
    }
  }

  // API 키 유효성 검사
  async testGeminiApiKey() {
    if (!this.geminiApiKey || this.geminiApiKey.length < 30) {
      throw new Error('Gemini API 키가 유효하지 않습니다.')
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, this is a test."
            }]
          }]
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ API 키 테스트 성공:', data)
        return true
      } else {
        const errorData = await response.json()
        console.error('❌ API 키 테스트 실패:', errorData)
        return false
      }
    } catch (error) {
      console.error('API 키 테스트 실패:', error)
      return false
    }
  }

  // Gemini API를 사용한 텍스트 요약
  async summarizeWithGemini(text, keywords = '') {
    if (!this.geminiApiKey || this.geminiApiKey.length < 30) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.')
    }

    try {
      const prompt = `다음 학습 자료를 청소년 경계선 지능 학습자를 위해 이해하기 쉽고 실용적으로 요약해주세요.

청소년 경계선 지능 학습자를 위한 특별 가이드:
- IQ 70~85 범위의 중고등학생이 이해하기 쉽도록
- 어려운 전문용어 대신 친숙한 표현 사용
- 명확하고 간결한 문장으로 구성
- 실생활과 연결된 구체적인 예시 활용
- 단계별 설명으로 이해 도움

주요 키워드: ${keywords}

요약 지침:
1. 핵심 개념 3-4개를 명확하게 정리
2. 중고등학생 수준에 맞는 설명으로 작성
3. "예를 들어", "간단히 말하면" 등의 연결어 사용
4. 실생활 속 친근한 예시로 설명 (학교생활, 일상경험, 취미 등)
5. 기억하기 쉬운 핵심 단어나 문구 강조
6. 이미지로 표현하기 좋은 시각적 요소 포함

텍스트:
${text}

응답 형식:
📚 [쉬운 제목] 

🔑 중요한 것들: [쉬운 키워드들]

✨ 알아두면 좋은 것들:
• [매우 쉬운 설명 1 - 친근한 예시 포함]
• [매우 쉬운 설명 2 - 친근한 예시 포함] 
• [매우 쉬운 설명 3 - 친근한 예시 포함]

🎨 그림으로 생각해보기:
• [일상적인 장면으로 표현한 그림 설명 1]
• [친근한 캐릭터나 물건으로 표현한 그림 설명 2]`

      const response = await fetch(`${GEMINI_API_URL}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API 오류! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text
      } else {
        throw new Error('Gemini API 응답 형식이 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('Gemini 요약 실패:', error)
      throw error
    }
  }

  // OpenAI를 사용한 이미지 생성
  async generateImagesWithOpenAI(summary, keywords = '', count = 3) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API 키가 설정되지 않았습니다.')
    }

    try {
      const prompts = this.createImagePrompts(summary, keywords, count)
      const images = []

      for (let i = 0; i < prompts.length; i++) {
        try {
          const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.openaiApiKey}`
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: prompts[i],
              n: 1,
              size: "1024x1024",
              quality: "standard"
            })
          })

          if (!response.ok) {
            console.error(`OpenAI API 오류 (이미지 ${i + 1}):`, response.status)
            continue
          }

          const data = await response.json()
          
          if (data.data && data.data[0] && data.data[0].url) {
            images.push({
              url: data.data[0].url,
              caption: `학습 이미지 ${i + 1}`,
              prompt: prompts[i]
            })
          }
        } catch (error) {
          console.error(`이미지 ${i + 1} 생성 실패:`, error)
          continue
        }
      }

      return images
    } catch (error) {
      console.error('OpenAI 이미지 생성 실패:', error)
      throw error
    }
  }

  // 듀오링고 스타일의 청소년 학습자를 위한 이미지 프롬프트 생성
  createImagePrompts(summary, keywords = '', count = 3) {
    const baseStyle = "Duolingo app style illustration, flat design, vibrant bright colors (green, blue, yellow, orange), rounded shapes, friendly cartoon characters, cheerful and encouraging, vector art style, clean geometric shapes, playful but educational"
    
    // 키워드에서 주제 추출
    const topics = keywords.toLowerCase().split(',').map(k => k.trim())
    
    const prompts = [
      `${baseStyle}, cute cartoon character learning about ${topics[0] || 'education'}, smiling friendly mascot, speech bubble with simple icons, celebration elements like stars and confetti`,
      `${baseStyle}, ${topics[1] || 'study concept'} represented by simple geometric shapes and icons, happy learning character, progress indicators, achievement badges, motivational elements`,
      `${baseStyle}, ${topics[2] || 'knowledge'} visualization with colorful infographic elements, cartoon student character celebrating success, thumbs up, heart icons, level completion visual`
    ]

    return prompts.slice(0, count)
  }

  // 학습 자료 업로드 (Gemini 통합)
  async uploadMaterial(materialData) {
    try {
      // Gemini API가 있으면 직접 요약 생성
      if (this.geminiApiKey && materialData.content) {
        const aiSummary = await this.summarizeWithGemini(materialData.content, materialData.keywords)
        
        // 백엔드가 있다면 저장을 위해 전송
        if (await this.testConnection()) {
          const response = await fetch(`${this.baseURL}/materials/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
              ...materialData,
              ai_summary: aiSummary
            })
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          return await response.json()
        } else {
          // 백엔드가 없으면 요약만 반환
          return {
            ai_summary: aiSummary,
            title: materialData.title,
            keywords: materialData.keywords,
            success: true
          }
        }
      } else {
        // Gemini API가 없으면 기존 백엔드 방식
        const response = await fetch(`${this.baseURL}/materials/`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(materialData)
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return await response.json()
      }
    } catch (error) {
      console.error('자료 업로드 실패:', error)
      throw error
    }
  }

  // 퀴즈 목록 조회
  async getQuizzes() {
    try {
      const response = await fetch(`${this.baseURL}/quizzes/`, {
        method: 'GET',
        headers: this.getHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('퀴즈 목록 조회 실패:', error)
      throw error
    }
  }

  // 퀴즈 시도 결과 제출
  async submitQuizAttempt(attemptData) {
    try {
      const response = await fetch(`${this.baseURL}/quiz-attempts/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(attemptData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('퀴즈 시도 제출 실패:', error)
      throw error
    }
  }

  // API 상태 확인
  async getApiStatus() {
    try {
      const response = await fetch(`${this.baseURL}/status/`, {
        method: 'GET',
        headers: this.getHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API 상태 확인 실패:', error)
      throw error
    }
  }

  // API 연결 테스트
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/status/`, {
        method: 'GET',
        headers: this.getHeaders()
      })
      return response.ok
    } catch (error) {
      console.error('API 연결 테스트 실패:', error)
      return false
    }
  }

  // 실제 퀴즈 목록 조회 (Django API)
  async getQuizzesFromAPI() {
    try {
      const response = await fetch(`${this.baseURL}/quizzes/`, {
        method: 'GET',
        headers: this.getHeaders()
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('퀴즈 목록 조회 실패:', error)
      throw error
    }
  }
}

export default new ApiService()