<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Cotacoes from './views/Cotacoes.vue'
import { onMounted, ref, nextTick } from 'vue'
import gsap from 'gsap'

const routes = [
  { path: '/', name: 'Dashboard' },
  { path: '/reports', name: 'Relatórios' },
  { path: '/users', name: 'Usuários' }
]

const isDark = ref(false)
const themeBtn = ref(null)
const cursorRef = ref(null)
const brandTitle = ref(null)

function setDarkClass(val) {
  const html = document.documentElement
  if (val) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  setDarkClass(isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  gsap.fromTo('.theme-toggle-anim', { rotate: 0 }, { rotate: 360, duration: 0.5, ease: 'power2.out' })
}

function setupCursor() {
  const cursor = cursorRef.value
  if (!cursor) return
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let cursorX = mouseX
  let cursorY = mouseY

  function animate() {
    cursorX += (mouseX - cursorX) * 0.22
    cursorY += (mouseY - cursorY) * 0.22
    gsap.set(cursor, { x: cursorX - 16, y: cursorY - 16 })
    requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // Hover em botões
  document.querySelectorAll('button, .btn, .btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover')
    })
    btn.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover')
    })
  })
}

onMounted(async () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
  } else {
    isDark.value = false
  }
  setDarkClass(isDark.value)
  gsap.from('.brand-anim', {
    opacity: 0,
    y: 30,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.15
  })
  await nextTick()
  if (themeBtn.value) {
    themeBtn.value.addEventListener('mouseenter', () => {
      gsap.to(themeBtn.value, { scale: 1.09, boxShadow: '0 4px 16px #1976d233', duration: 0.18, ease: 'power2.out' })
    })
    themeBtn.value.addEventListener('mouseleave', () => {
      gsap.to(themeBtn.value, { scale: 1, boxShadow: '0 2px 8px #1976d220', duration: 0.18, ease: 'power2.in' })
    })
    themeBtn.value.addEventListener('mousedown', () => {
      gsap.to(themeBtn.value, { scale: 0.95, duration: 0.12, ease: 'power1.in' })
    })
    themeBtn.value.addEventListener('mouseup', () => {
      gsap.to(themeBtn.value, { scale: 1.09, duration: 0.12, ease: 'power1.out' })
    })
  }
  setupCursor()
  // Animação minimalista no título
  if (brandTitle.value) {
    gsap.fromTo(
      brandTitle.value,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    )
  }
})
</script>

<template>
  <header class="header-bar">
    <div class="container header-content">
      <div class="brand-area">
        <span class="brand-icon brand-anim">
          <!-- Ícone SVG moderno de finanças -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="8" rx="2" :fill="isDark ? '#0D47A1' : '#1976D2'"/>
            <rect x="7" y="7" width="10" height="4" rx="1.5" :fill="isDark ? '#64B5F6' : '#64B5F6'"/>
            <circle cx="12" cy="15" r="2.5" :fill="isDark ? '#222' : '#fff'"/>
          </svg>
        </span>
        <h1 ref="brandTitle" class="brand poppins-title brand-anim">FinanSense</h1>
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
      <button ref="themeBtn" @click="toggleDark" class="theme-toggle-anim theme-toggle-btn ml-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow transition-colors duration-200" :title="isDark ? 'Modo claro' : 'Modo escuro'">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </header>
  <main class="container main-content">
    <RouterView />
  </main>
  <footer class="footer-bar">
    <Cotacoes />
  </footer>
  <div ref="cursorRef" class="cursor-gsap"></div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Poppins:wght@700&display=swap');

body, .main-content, .container, .card, .table, .nav-link, .footer-bar, .input, .input-field, label, .text-lg, .font-bold, .brand-area, .brand-icon, .brand, .header-bar, .header-content, .brand-anim, .theme-toggle-btn {
  font-family: 'Inter', Arial, sans-serif !important;
}

.poppins-title {
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 700;
  font-size: 2.3rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
  line-height: 1.1;
  margin-left: 0.1em;
}

.footer-bar {
  background: #F5F9FB;
  border-top: 1px solid #BBDEFB;
  padding: 1.2rem 0 0.5rem 0;
  margin-top: 2rem;
  text-align: center;
  color: #1976D2;
  font-size: 1rem;
}
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
