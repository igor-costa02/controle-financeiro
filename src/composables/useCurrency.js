import { ref, onMounted } from 'vue'

export function useCurrency() {
  const usdRate = ref(null)
  const eurRate = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL')
      const data = await response.json()
      
      // Convertendo de BRL para USD e EUR (invertendo a taxa)
      usdRate.value = (1 / data.rates.USD).toFixed(2)
      eurRate.value = (1 / data.rates.EUR).toFixed(2)
      isLoading.value = false
    } catch (e) {
      error.value = 'Erro ao carregar cotações'
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchExchangeRates()
  })

  return {
    formatCurrency,
    usdRate,
    eurRate,
    isLoading,
    error
  }
} 