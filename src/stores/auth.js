import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mockUsers } from './mockData.js'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isLoggedIn = ref(false)

  function login(userId) {
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      currentUser.value = user
      isLoggedIn.value = true
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }

  function logout() {
    currentUser.value = null
    isLoggedIn.value = false
    localStorage.removeItem('currentUser')
  }

  function checkAuth() {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  return { 
    currentUser, 
    isLoggedIn, 
    login, 
    logout, 
    checkAuth 
  }
})