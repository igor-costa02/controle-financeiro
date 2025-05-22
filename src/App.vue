<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const isDarkMode = ref(false)

const routes = [
  { path: '/', name: 'Dashboard' },
  { path: '/transactions', name: 'Transações' },
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
  <div class="app">
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="nav-left">
          <h1 class="brand">Controle Financeiro</h1>
          <div class="nav-links">
            <RouterLink 
              v-for="route in routes" 
              :key="route.path"
              :to="route.path"
              class="nav-link"
              :class="{ 'active': $route.path === route.path }"
            >
              {{ route.name }}
            </RouterLink>
          </div>
        </div>
        <div class="nav-right">
          <button
            @click="toggleDarkMode"
            class="btn"
          >
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main class="container main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-right {
  display: flex;
  align-items: center;
}

.h-6 {
  height: 1.5rem;
}

.w-6 {
  width: 1.5rem;
}
</style>
