<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const isDarkMode = ref(false)

const routes = [
  { path: '/', name: 'Dashboard' },
  { path: '/reports', name: 'Relatórios' }
]

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark')
  localStorage.setItem('darkMode', isDarkMode.value)
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true'
  isDarkMode.value = savedDarkMode
  if (savedDarkMode) {
    document.body.classList.add('dark')
  }
})

watch(isDarkMode, (newValue) => {
  document.body.classList.toggle('dark', newValue)
})
</script>

<template>
  <header class="header-bar">
    <div class="container header-content">
      <div class="brand-area">
        <span class="brand-icon">💸</span>
        <h1 class="brand">Controle Financeiro</h1>
      </div>
      <nav class="nav-links">
        <RouterLink 
          v-for="route in routes" 
          :key="route.path"
          :to="route.path"
          class="nav-link"
          :class="{ 'active': $route.path === route.path }"
        >
          {{ route.name }}
        </RouterLink>
      </nav>
      <button @click="toggleDarkMode" class="btn btn-theme" :title="isDarkMode ? 'Modo claro' : 'Modo escuro'">
        <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </header>
  <main class="container main-content">
    <RouterView />
  </main>
</template>

<style>
.header-bar {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  padding: 0.5rem 0;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
}
.brand-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.brand-icon {
  font-size: 2rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.08));
}
.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-link {
  color: #e0e7ef;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background 0.2s, color 0.2s;
}
.nav-link.active, .nav-link:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.btn-theme {
  background: transparent;
  border: none;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
  margin-left: 1rem;
}
.btn-theme:hover {
  background: rgba(255,255,255,0.15);
}
@media (max-width: 600px) {
  .header-content { flex-direction: column; gap: 0.5rem; }
  .brand { font-size: 1.1rem; }
  .nav-links { gap: 0.5rem; }
}
</style>
