import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  
  const categories = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Cartão de Crédito',
    'Investimentos',
    'Outros'
  ]

  const addTransaction = (transaction) => {
    transactions.value.push({
      id: Date.now(),
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    })
  }

  const removeTransaction = (id) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value.splice(index, 1)
    }
  }

  const updateTransaction = (id, updates) => {
    const transaction = transactions.value.find(t => t.id === id)
    if (transaction) {
      Object.assign(transaction, updates)
    }
  }

  const balance = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount
    }, 0)
  })
  
  const incomes = computed(() => {
    return transactions.value.filter(t => t.type === 'income')
  })
  
  const expenses = computed(() => {
    return transactions.value.filter(t => t.type === 'expense')
  })
  
  const groupByCategory = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0
      }
      acc[transaction.category] += transaction.amount
      return acc
    }, {})
  })

  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']
    const data = transactions.value.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type === 'income' ? 'Entrada' : 'Saída',
      t.category,
      t.description,
      t.amount.toFixed(2)
    ])
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'transacoes.csv'
    link.click()
  }

  return {
    transactions,
    categories,
    addTransaction,
    removeTransaction,
    updateTransaction,
    balance,
    incomes,
    expenses,
    groupByCategory,
    exportToCSV
  }
}) 