<template>
  <div class="space-y-6" ref="mainRef">
    <div v-if="store.error" class="text-danger text-center text-sm mb-2">{{ store.error }}</div>
    <!-- Formulário de Nova Transação -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Nova Transação</h3>
      <form @submit.prevent="handleSubmitTransacao" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo
            </label>
            <select 
              v-model="form.type"
              class="input-field"
              required
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria
            </label>
            <select 
              v-model="form.category"
              class="input-field"
              required
            >
              <option v-for="category in store.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor
            </label>
            <input 
              type="number" 
              v-model="form.amount"
              step="0.01"
              min="0"
              class="input-field"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <input 
              type="text" 
              v-model="form.description"
              class="input-field"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data
            </label>
            <input 
              type="date" 
              v-model="form.date"
              class="input-field"
            >
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit"
            class="btn-primary"
          >
            Adicionar Transação
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de Transações -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Transações</h3>
        <div class="flex space-x-2">
          <input 
            type="text"
            v-model="search"
            placeholder="Buscar..."
            class="input-field max-w-xs"
          >
          <button 
            @click="exportData"
            class="btn-primary"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.data.split('-').reverse().join('/') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.tipo === 'income' ? 'Entrada' : 'Saída' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.descricao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.categoria }}
              </td>
              <td :class="['px-6 py-4 whitespace-nowrap text-sm font-medium', 
                transaction.tipo === 'income' ? 'text-green-600' : 'text-red-600']">
                R$ {{ transaction.valor.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <button 
                  @click="removeTransaction(transaction.id)"
                  class="text-red-600 hover:text-red-900 dark:hover:text-red-400"
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
import { useUsersStore } from '../stores/users'
import gsap from 'gsap'

const store = useTransactionsStore()
const usersStore = useUsersStore()
const search = ref('')
const mainRef = ref(null)

onMounted(async () => {
  gsap.from(mainRef.value, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' })
  await store.fetchTransactions()
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

const form = ref({
  type: 'income',
  category: store.categories[0],
  amount: '',
  description: '',
  date: ''
})
const errorMsg = ref('')

const handleSubmitTransacao = async () => {
  errorMsg.value = ''
  console.log('handleSubmitTransacao chamado')
  const payload = {
    user_id: usersStore.loggedUser?.id,
    type: form.value.type,
    category: form.value.category,
    description: form.value.description,
    amount: parseFloat(form.value.amount),
    date: form.value.date || new Date().toISOString().split('T')[0]
  }
  console.log('Payload correto enviado para backend:', payload)
  try {
    await store.addTransaction(payload)
    form.value = {
      type: 'income',
      category: store.categories[0],
      amount: '',
      description: '',
      date: ''
    }
  } catch (e) {
    errorMsg.value = store.error || e.message
  }
}

const removeTransaction = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    errorMsg.value = ''
    try {
      await store.removeTransaction(id)
    } catch (e) {
      errorMsg.value = store.error || e.message
    }
  }
}

const filteredTransactions = computed(() => {
  return store.transactions.filter(transaction => {
    const searchLower = search.value.toLowerCase()
    return (
      transaction.descricao.toLowerCase().includes(searchLower) ||
      transaction.categoria.toLowerCase().includes(searchLower)
    )
  }).sort((a, b) => new Date(b.data) - new Date(a.data))
})

const exportData = () => {
  store.exportToCSV()
}
</script> 