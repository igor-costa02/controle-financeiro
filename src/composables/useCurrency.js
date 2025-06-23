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
      // Usando AwesomeAPI (https://docs.awesomeapi.com.br/api-de-moedas)
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL')
      const data = await response.json()
      usdRate.value = parseFloat(data.USDBRL.bid)
      eurRate.value = parseFloat(data.EURBRL.bid)
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