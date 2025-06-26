import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loggedUser = ref(null)
  const error = ref(null)

  function validatePassword(password) {
    if (typeof password !== 'string') return false
    const isValid = password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
    console.log('Validando senha:', password, 'Resultado:', isValid)
    return isValid
  }

  async function fetchUsers() {
    try {
      const res = await fetch('http://localhost:3001/api/usuarios')
      users.value = await res.json()
    } catch (e) {
      error.value = 'Erro ao buscar usuários'
    }
  }

  async function addUser(user) {
    if (!validatePassword(user.password)) {
      throw new Error('A senha deve ter pelo menos 6 caracteres, incluindo uma letra e um número.')
    }
    try {
      const payload = {
        nome: user.name,
        email: user.email,
        senha: user.password
      }
      const res = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Erro ao criar usuário')
      await fetchUsers()
    } catch (e) {
      error.value = 'Erro ao criar usuário'
      throw e
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      })
      if (!res.ok) throw new Error('Login inválido')
      loggedUser.value = await res.json()
      return true
    } catch {
      error.value = 'Login inválido'
      return false
    }
  }

  function logout() {
    loggedUser.value = null
  }

  const handleSubmit = async () => {
    console.log('handleSubmit chamado');
    const payload = {
      usuario_id: usersStore.loggedUser?.id,
      tipo: form.value.type,
      categoria: form.value.category,
      descricao: form.value.description,
      valor: parseFloat(form.value.amount),
      data: form.value.date || new Date().toISOString().split('T')[0]
    }
    console.log('Payload:', payload);
    alert('submit!');
    // ...restante do código
  }

  return {
    users,
    loggedUser,
    error,
    fetchUsers,
    addUser,
    login,
    logout,
    validatePassword,
    handleSubmit
  }
}) 