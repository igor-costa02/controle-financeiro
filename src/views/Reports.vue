<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Período
          </label>
          <select 
            v-model="period"
            class="input-field"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoria
          </label>
          <select 
            v-model="selectedCategory"
            class="input-field"
          >
            <option value="">Todas</option>
            <option v-for="category in store.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo
          </label>
          <select 
            v-model="type"
            class="input-field"
          >
            <option value="">Todos</option>
            <option value="income">Entradas</option>
            <option value="expense">Saídas</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Resumo do Período -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Total de Entradas</h3>
        <p class="text-2xl font-bold text-green-600">
          R$ {{ totalIncomes.toFixed(2) }}
        </p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Total de Saídas</h3>
        <p class="text-2xl font-bold text-red-600">
          R$ {{ totalExpenses.toFixed(2) }}
        </p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Saldo do Período</h3>
        <p :class="['text-2xl font-bold', balance >= 0 ? 'text-green-600' : 'text-red-600']">
          R$ {{ balance.toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card" style="min-height: 400px;">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Evolução no Período</h3>
        <div class="relative" style="height: 300px; width: 100%;">
          <Line 
            :data="lineChartData" 
            :options="lineChartOptions" 
            style="max-height: 300px;"
          />
        </div>
      </div>
      <div class="card" style="min-height: 400px;">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Distribuição por Categoria</h3>
        <div class="relative" style="height: 300px; width: 100%;">
          <Doughnut 
            :data="doughnutChartData" 
            :options="doughnutChartOptions"
            style="max-height: 300px;"
          />
        </div>
      </div>
    </div>

    <!-- Análise por Categoria -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Análise por Categoria</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">% do Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Média Mensal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(stats, category) in categoryStats" :key="category">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                R$ {{ stats.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ stats.percentage.toFixed(2) }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                R$ {{ stats.average.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const store = useTransactionsStore()
const period = ref('30')
const selectedCategory = ref('')
const type = ref('')

const filteredTransactions = computed(() => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(period.value))

  return store.transactions.filter(transaction => {
    const matchesDate = new Date(transaction.date) >= cutoffDate
    const matchesCategory = !selectedCategory.value || transaction.category === selectedCategory.value
    const matchesType = !type.value || transaction.type === type.value
    return matchesDate && matchesCategory && matchesType
  })
})

const totalIncomes = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
)

const totalExpenses = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
)

const balance = computed(() => totalIncomes.value - totalExpenses.value)

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0 // Desabilita animações que podem causar problemas de layout
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 10,
        boxWidth: 10,
        font: {
          size: 11
        },
        color: document.body.classList.contains('dark') ? '#e5e5e5' : '#374151'
      }
    }
  }
}

const lineChartOptions = {
  ...baseChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: document.body.classList.contains('dark') ? '#e5e5e5' : '#374151',
        font: {
          size: 11
        }
      },
      grid: {
        color: document.body.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      ticks: {
        color: document.body.classList.contains('dark') ? '#e5e5e5' : '#374151',
        font: {
          size: 11
        }
      },
      grid: {
        display: false
      }
    }
  }
}

const doughnutChartOptions = {
  ...baseChartOptions,
  cutout: '60%',
  layout: {
    padding: {
      top: 20,
      bottom: 20
    }
  },
  plugins: {
    ...baseChartOptions.plugins,
    legend: {
      ...baseChartOptions.plugins.legend,
      position: 'right'
    }
  }
}

const lineChartData = computed(() => {
  const data = {}
  filteredTransactions.value.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString()
    if (!data[date]) {
      data[date] = { income: 0, expense: 0 }
    }
    if (transaction.type === 'income') {
      data[date].income += transaction.amount
    } else {
      data[date].expense += transaction.amount
    }
  })

  const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b))
  const incomes = sortedDates.map(date => data[date].income)
  const expenses = sortedDates.map(date => data[date].expense)

  return {
    labels: sortedDates,
    datasets: [
      {
        label: 'Entradas',
        data: incomes,
        borderColor: '#10B981',
        backgroundColor: '#10B98133',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Saídas',
        data: expenses,
        borderColor: '#EF4444',
        backgroundColor: '#EF444433',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const doughnutChartData = computed(() => {
  const categoryData = {}
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
    '#F97316'
  ]

  filteredTransactions.value.forEach(transaction => {
    if (!categoryData[transaction.category]) {
      categoryData[transaction.category] = 0
    }
    categoryData[transaction.category] += transaction.amount
  })

  const categories = Object.keys(categoryData)
  const values = Object.values(categoryData)

  return {
    labels: categories,
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, categories.length),
      borderWidth: 1,
      borderColor: document.body.classList.contains('dark') ? '#2D2D2D' : '#FFFFFF'
    }]
  }
})

const categoryStats = computed(() => {
  const stats = {}
  const total = filteredTransactions.value.reduce((acc, t) => acc + t.amount, 0)
  const monthsInPeriod = parseInt(period.value) / 30

  filteredTransactions.value.forEach(transaction => {
    if (!stats[transaction.category]) {
      stats[transaction.category] = { total: 0, percentage: 0, average: 0 }
    }
    stats[transaction.category].total += transaction.amount
  })

  Object.keys(stats).forEach(category => {
    stats[category].percentage = (stats[category].total / total) * 100
    stats[category].average = stats[category].total / monthsInPeriod
  })

  return stats
})
</script> 