<template>
  <div class="space-y-6" ref="mainRef">
    <div class="card">
      <h3 class="text-lg font-medium mb-4">Novo Usuário</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nome</label>
            <input type="text" v-model="form.name" class="input" required placeholder="Nome completo">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">E-mail</label>
            <input type="email" v-model="form.email" class="input" required placeholder="email@exemplo.com">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Senha</label>
            <input type="password" v-model="form.password" class="input" required placeholder="Senha">
            <div v-if="form.password && !usersStore.validatePassword(form.password)" class="text-danger text-xs mt-1">
              A senha deve ter pelo menos 6 caracteres, incluindo uma letra e um número.
            </div>
          </div>
        </div>
        <div v-if="errorMsg" class="text-danger text-sm">{{ errorMsg }}</div>
        <div class="flex justify-end">
          <button type="submit" class="btn-primary" :disabled="form.password && !usersStore.validatePassword(form.password)">
            {{ editId ? 'Salvar Alterações' : 'Adicionar Usuário' }}
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <h3 class="text-lg font-medium mb-4">Usuários Cadastrados</h3>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button @click="editUser(user)" class="btn">Editar</button>
                <button @click="deleteUser(user.id)" class="btn text-danger ml-2">Excluir</button>
              </td>
            </tr>
            <tr v-if="usersStore.users.length === 0">
              <td colspan="4" class="text-center">Nenhum usuário cadastrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg font-medium mb-4">Autenticação</h3>
      <div v-if="usersStore.loggedUser">
        <p>Usuário logado: <b>{{ usersStore.loggedUser.name }}</b> ({{ usersStore.loggedUser.email }})</p>
        <button @click="logout" class="btn mt-2">Logout</button>
      </div>
      <form v-else @submit.prevent="doLogin" class="space-y-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">E-mail</label>
            <input type="email" v-model="loginForm.email" class="input" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Senha</label>
            <input type="password" v-model="loginForm.password" class="input" required>
          </div>
        </div>
        <div v-if="loginError" class="text-danger text-sm">{{ loginError }}</div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useUsersStore } from '../stores/users'
import gsap from 'gsap'

const usersStore = useUsersStore()

const form = ref({
  name: '',
  email: '',
  password: ''
})
const editId = ref(null)
const errorMsg = ref('')

const mainRef = ref(null)

onMounted(async () => {
  gsap.from(mainRef.value, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' })
  await nextTick()
  const btns = mainRef.value.querySelectorAll('button')
  btns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.06, boxShadow: '0 4px 16px #1976d233', duration: 0.18, ease: 'power2.out' })
    })
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, boxShadow: '0 2px 8px #1976d220', duration: 0.18, ease: 'power2.in' })
    })
    btn.addEventListener('mousedown', () => {
      gsap.to(btn, { scale: 0.96, duration: 0.12, ease: 'power1.in' })
    })
    btn.addEventListener('mouseup', () => {
      gsap.to(btn, { scale: 1.06, duration: 0.12, ease: 'power1.out' })
    })
  })
})

const handleSubmit = () => {
  errorMsg.value = ''
  try {
    if (editId.value) {
      usersStore.updateUser(editId.value, { ...form.value })
      editId.value = null
    } else {
      usersStore.addUser({ ...form.value })
    }
    form.value = { name: '', email: '', password: '' }
  } catch (e) {
    errorMsg.value = e.message
  }
}

const editUser = (user) => {
  form.value = { name: user.name, email: user.email, password: user.password }
  editId.value = user.id
}

const deleteUser = (id) => {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    usersStore.removeUser(id)
    if (editId.value === id) {
      editId.value = null
      form.value = { name: '', email: '', password: '' }
    }
  }
}

// Autenticação
const loginForm = ref({ email: '', password: '' })
const loginError = ref('')

const doLogin = () => {
  loginError.value = ''
  if (!usersStore.login(loginForm.value.email, loginForm.value.password)) {
    loginError.value = 'E-mail ou senha inválidos.'
  } else {
    loginForm.value = { email: '', password: '' }
  }
}

const logout = () => {
  usersStore.logout()
}
</script> 