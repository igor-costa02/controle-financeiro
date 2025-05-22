<template>
  <div class="space-y-6">
    <!-- Formulário de Nova Transação -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Nova Transação</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
                {{ new Date(transaction.date).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.type === 'income' ? 'Entrada' : 'Saída' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.category }}
              </td>
              <td :class="['px-6 py-4 whitespace-nowrap text-sm font-medium', 
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600']">
                R$ {{ transaction.amount.toFixed(2) }}
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
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'

const store = useTransactionsStore()
const search = ref('')

const form = ref({
  type: 'income',
  category: store.categories[0],
  amount: '',
  description: ''
})

const handleSubmit = () => {
  store.addTransaction({
    type: form.value.type,
    category: form.value.category,
    amount: parseFloat(form.value.amount),
    description: form.value.description
  })
  
  form.value = {
    type: 'income',
    category: store.categories[0],
    amount: '',
    description: ''
  }
}

const removeTransaction = (id) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    store.removeTransaction(id)
  }
}

const filteredTransactions = computed(() => {
  return store.transactions.filter(transaction => {
    const searchLower = search.value.toLowerCase()
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower)
    )
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const exportData = () => {
  store.exportToCSV()
}
</script> 