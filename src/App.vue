<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Cotacoes from './views/Cotacoes.vue'
import { onMounted, ref, nextTick, watch } from 'vue'
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
const switchRef = ref(null)
const switchCircleRef = ref(null)
const brandIcon = ref(null)

function setDarkClass(val) {
  const html = document.documentElement
  if (val) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

watch(isDark, (val) => {
  if (!switchRef.value || !switchCircleRef.value) return
  if (val) {
    gsap.to(switchRef.value, { background: '#1976D2', duration: 0.3 })
    gsap.to(switchCircleRef.value, { x: 24, background: '#232B3B', borderColor: '#232B3B', duration: 0.3 })
  } else {
    gsap.to(switchRef.value, { background: '#e5e7eb', duration: 0.3 })
    gsap.to(switchCircleRef.value, { x: 0, background: '#fff', borderColor: '#4FC3F7', duration: 0.3 })
  }
})

function toggleDarkSwitch() {
  isDark.value = !isDark.value
  setDarkClass(isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
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
  if (brandIcon.value) {
    // Animação bounce ao entrar
    gsap.fromTo(
      brandIcon.value,
      { y: -60, scale: 0.7, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'bounce.out', delay: 0.1 }
    )
    // Animação de "respiração" contínua
    gsap.to(brandIcon.value, {
      scale: 1.08,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2
    })
  }
})
</script>

<template>
  <header class="header-bar">
    <div class="container header-content">
      <div class="brand-area">
        <span class="brand-icon brand-anim" ref="brandIcon">
          <!-- Cifrão SVG estilizado -->
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
            <defs>
              <linearGradient :id="isDark ? 'cifrao-dark' : 'cifrao-light'" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
                <stop :stop-color="isDark ? '#4FC3F7' : '#1976D2'" />
                <stop offset="1" :stop-color="isDark ? '#1976D2' : '#00E5FF'" />
              </linearGradient>
            </defs>
            <path d="M22 6V38" :stroke="`url(#${isDark ? 'cifrao-dark' : 'cifrao-light'})`" stroke-width="3.2" stroke-linecap="round"/>
            <path d="M32 14C32 9.02944 27.5228 5 22 5C16.4772 5 12 9.02944 12 14C12 18.9706 16.4772 23 22 23C27.5228 23 32 27.0294 32 32C32 36.9706 27.5228 41 22 41C16.4772 41 12 36.9706 12 32" :stroke="`url(#${isDark ? 'cifrao-dark' : 'cifrao-light'})`" stroke-width="3.2" stroke-linecap="round"/>
          </svg>
        </span>
        <h1 ref="brandTitle" class="logo-finansense">FINANSENSE</h1>
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
      <div class="gsap-switch ml-4" :aria-checked="isDark" role="switch" tabindex="0" @click="toggleDarkSwitch" @keydown.enter.space="toggleDarkSwitch" ref="switchRef">
        <div class="gsap-switch-circle" ref="switchCircleRef"></div>
      </div>
    </div>
  </header>
  <main class="container main-content">
    <RouterView />
  </main>
  <footer class="footer-bar">
    <Cotacoes />
  </footer>
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
@media (max-width: 900px) {
  .container { padding: 0 0.5rem; }
  .header-content { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
  .brand-area { gap: 0.3rem; }
  .brand-icon { height: 1.7em !important; min-width: 1.7em !important; }
  .logo-finansense { font-size: 1.5rem !important; letter-spacing: 0.18em; }
}
@media (max-width: 600px) {
  .header-content { flex-direction: column; gap: 0.3rem; align-items: flex-start; }
  .brand-area { gap: 0.2rem; }
  .brand-icon { height: 1.2em !important; min-width: 1.2em !important; }
  .logo-finansense { font-size: 1.1rem !important; letter-spacing: 0.12em; }
}
.logo-finansense {
  font-family: 'Poppins', Arial, sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  letter-spacing: 0.5em;
  color: #29B6F6;
  text-transform: uppercase;
  text-align: center;
  margin-left: 0.1em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
}
.gsap-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  border-radius: 34px;
  background: #e5e7eb;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
  outline: none;
}
.gsap-switch:focus {
  box-shadow: 0 0 0 2px #4FC3F7;
}
.gsap-switch-circle {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #4FC3F7;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.10);
  transition: background 0.3s, border 0.3s;
}
html.dark .gsap-switch {
  background: #232B3B;
}
html.dark .gsap-switch[aria-checked="true"] {
  background: #64B5F6;
}
html.dark .gsap-switch-circle {
  border-color: #232B3B;
}
</style>
