<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Cotacoes from './views/Cotacoes.vue'

const routes = [
  { path: '/', name: 'Dashboard' },
  { path: '/reports', name: 'Relatórios' },
  { path: '/users', name: 'Usuários' }
]
</script>

<template>
  <header class="header-bar">
    <div class="container header-content">
      <div class="brand-area">
        <span class="brand-icon">
          <!-- Ícone SVG moderno de finanças -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="8" rx="2" fill="#1976D2"/>
            <rect x="7" y="7" width="10" height="4" rx="1.5" fill="#64B5F6"/>
            <circle cx="12" cy="15" r="2.5" fill="#fff"/>
          </svg>
        </span>
        <h1 class="brand modern-font">FinanSense</h1>
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
.modern-font {
  font-family: 'Montserrat', 'Inter', Arial, sans-serif;
  letter-spacing: 1px;
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
