<template>
  <div class="space-y-6" ref="mainRef">
    <!-- Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <h3 class="text-lg font-medium mb-2">Saldo Total</h3>
        <p :class="['text-2xl font-bold', balance >= 0 ? 'text-success' : 'text-danger']">
          {{ formatCurrency(balance) }}
        </p>
      </div>
      
      <div class="card">
        <h3 class="text-lg font-medium mb-2">Entradas do Mês</h3>
        <p class="text-2xl font-bold text-success">
          {{ formatCurrency(monthlyIncomes) }}
        </p>
      </div>
      
      <div class="card">
        <h3 class="text-lg font-medium mb-2">Saídas do Mês</h3>
        <p class="text-2xl font-bold text-danger">
          {{ formatCurrency(monthlyExpenses) }}
        </p>
      </div>

      <div class="card">
        <h3 class="text-lg font-medium mb-2">Saldo do Mês</h3>
        <p :class="['text-2xl font-bold', monthlyBalance >= 0 ? 'text-success' : 'text-danger']">
          {{ formatCurrency(monthlyBalance) }}
        </p>
      </div>
    </div>

    <!-- Nova Transação -->
    <div class="card">
      <h3 class="text-lg font-medium mb-4">Nova Transação</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tipo</label>
            <select v-model="newTransaction.type" class="input">
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Categoria</label>
            <select v-model="newTransaction.category" class="input">
              <option v-for="category in store.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Descrição</label>
            <input 
              type="text" 
              v-model="newTransaction.description" 
              class="input"
              placeholder="Digite a descrição"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Valor</label>
            <input 
              type="text" 
              v-model="amount" 
              class="input"
              placeholder="0,00"
              @input="formatAmount"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Data</label>
          <input 
            type="date" 
            v-model="newTransaction.date" 
            class="input"
          >
        </div>

        <button type="submit" class="btn btn-primary w-full">
          Adicionar Transação
        </button>
      </form>
    </div>

    <!-- Últimas Transações -->
    <div class="card" style="overflow-x:auto;">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Últimas Transações</h3>
        <button @click="store.exportToCSV" class="btn">
          Exportar CSV
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in recentTransactions" :key="transaction.id">
              <td>{{ new Date(transaction.date).toLocaleDateString() }}</td>
              <td>
                <span :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
                  {{ transaction.type === 'income' ? 'Entrada' : 'Saída' }}
                </span>
              </td>
              <td>{{ transaction.category }}</td>
              <td>{{ transaction.description }}</td>
              <td :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td>
                <button 
                  @click="store.removeTransaction(transaction.id)"
                  class="text-danger hover:text-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import { useCurrency } from '../composables/useCurrency'
import gsap from 'gsap'

const store = useTransactionsStore()
const { formatCurrency, usdRate, eurRate, isLoading, error } = useCurrency()

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

const newTransaction = ref({
  type: 'income',
  category: store.categories[0],
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
})

const amount = ref('')

const formatAmount = () => {
  // Remove tudo exceto números
  let value = amount.value.replace(/\D/g, '')
  
  // Converte para número com 2 casas decimais
  value = (parseInt(value) / 100).toFixed(2)
  
  // Formata com separadores
  amount.value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  // Atualiza o valor da transação
  newTransaction.value.amount = parseFloat(value)
}

const handleSubmit = () => {
  store.addTransaction({
    ...newTransaction.value
  })
  
  // Limpa o formulário
  newTransaction.value = {
    type: 'income',
    category: store.categories[0],
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  }
  amount.value = ''
}

const recentTransactions = computed(() => {
  return [...store.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

const currentMonth = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
})

const monthlyTransactions = computed(() => {
  return store.transactions.filter(t => new Date(t.date) >= currentMonth.value)
})

const monthlyIncomes = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
})

const monthlyExpenses = computed(() => {
  return monthlyTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
})

const monthlyBalance = computed(() => monthlyIncomes.value - monthlyExpenses.value)

const balance = computed(() => {
  return store.transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount
  }, 0)
})
</script> 