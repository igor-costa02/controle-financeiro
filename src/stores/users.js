import { defineStore } from 'pinia'
import { ref } from 'vue'

const USERS_KEY = 'cf_users'
const LOGGED_KEY = 'cf_logged_user'

function loadUsers() {
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const useUsersStore = defineStore('users', () => {
  const users = ref(loadUsers())
  const loggedUser = ref(JSON.parse(localStorage.getItem(LOGGED_KEY) || 'null'))

  function validatePassword(password) {
    // Mínimo 6 caracteres, pelo menos uma letra e um número
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)
  }

  const addUser = (user) => {
    if (!validatePassword(user.password)) {
      throw new Error('A senha deve ter pelo menos 6 caracteres, incluindo uma letra e um número.')
    }
    // Gera o próximo ID baseado no maior ID atual
    const nextId = users.value.length > 0 ? Math.max(...users.value.map(u => u.id)) + 1 : 1
    users.value.push({
      id: nextId,
      ...user
    })
    saveUsers(users.value)
  }

  const updateUser = (id, updates) => {
    const user = users.value.find(u => u.id === id)
    if (user) {
      if (updates.password && !validatePassword(updates.password)) {
        throw new Error('A senha deve ter pelo menos 6 caracteres, incluindo uma letra e um número.')
      }
      Object.assign(user, updates)
      saveUsers(users.value)
    }
  }

  const removeUser = (id) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
      saveUsers(users.value)
    }
  }

  const getUserById = (id) => {
    return users.value.find(u => u.id === id)
  }

  const login = (email, password) => {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      loggedUser.value = user
      localStorage.setItem(LOGGED_KEY, JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    loggedUser.value = null
    localStorage.removeItem(LOGGED_KEY)
  }

  return {
    users,
    addUser,
    updateUser,
    removeUser,
    getUserById,
    validatePassword,
    login,
    logout,
    loggedUser
  }
}) 