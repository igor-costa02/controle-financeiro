<template>
  <div class="cotacoes-bar">
    <div class="cotacao-item">
      <span class="cotacao-icon cotacao-usd">$</span>
      <span class="cotacao-label">Dólar</span>
      <span class="cotacao-value" v-if="!isLoading && !error">{{ formatCurrency(usdRate) }}</span>
      <span v-if="isLoading" class="cotacao-loading">...</span>
      <span v-if="error" class="cotacao-error">!</span>
    </div>
    <div class="cotacao-item">
      <span class="cotacao-icon cotacao-eur">€</span>
      <span class="cotacao-label">Euro</span>
      <span class="cotacao-value" v-if="!isLoading && !error">{{ formatCurrency(eurRate) }}</span>
      <span v-if="isLoading" class="cotacao-loading">...</span>
      <span v-if="error" class="cotacao-error">!</span>
    </div>
  </div>
</template>

<script setup>
import { useCurrency } from '../composables/useCurrency'
const { formatCurrency, usdRate, eurRate, isLoading, error } = useCurrency()
</script>

<style scoped>
.cotacoes-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  background: #F5F9FB;
  border-radius: 1.2rem;
  box-shadow: 0 1px 6px rgba(25, 118, 210, 0.08);
  padding: 0.5rem 1.5rem;
  margin: 0 auto;
  max-width: 420px;
}
.cotacao-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #1976D2;
  font-weight: 500;
}
.cotacao-icon {
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #E3F2FD;
}
.cotacao-usd {
  color: #1976D2;
  background: #E3F2FD;
}
.cotacao-eur {
  color: #F9A825;
  background: #FFF8E1;
}
.cotacao-label {
  color: #90A4AE;
  font-size: 0.95rem;
  font-weight: 400;
}
.cotacao-value {
  font-size: 1.08rem;
  font-weight: 700;
  color: #1976D2;
  margin-left: 0.2rem;
}
.cotacao-loading {
  color: #90A4AE;
  font-size: 1.1rem;
  margin-left: 0.2rem;
}
.cotacao-error {
  color: #EF4444;
  font-size: 1.1rem;
  margin-left: 0.2rem;
}
@media (max-width: 600px) {
  .cotacoes-bar {
    gap: 1.2rem;
    padding: 0.4rem 0.5rem;
    max-width: 98vw;
  }
  .cotacao-item {
    font-size: 0.97rem;
  }
  .cotacao-icon {
    font-size: 1.1rem;
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style> 