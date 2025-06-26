import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const error = ref(null)

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

  async function fetchTransactions() {
    try {
      const res = await fetch('http://localhost:3001/api/transacoes')
      transactions.value = await res.json()
    } catch {
      error.value = 'Erro ao buscar transações'
    }
  }

  async function addTransaction(transaction) {
    try {
      const res = await fetch('http://localhost:3001/api/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      })
      if (!res.ok) throw new Error('Erro ao criar transação')
      await fetchTransactions()
    } catch {
      error.value = 'Erro ao criar transação'
    }
  }

  async function removeTransaction(id) {
    try {
      await fetch(`http://localhost:3001/api/transacoes/${id}`, { method: 'DELETE' })
      await fetchTransactions()
    } catch {
      error.value = 'Erro ao remover transação'
    }
  }

  const balance = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      return transaction.tipo === 'income' 
        ? acc + transaction.valor 
        : acc - transaction.valor
    }, 0)
  })

  const incomes = computed(() => transactions.value.filter(t => t.tipo === 'income'))
  const expenses = computed(() => transactions.value.filter(t => t.tipo === 'expense'))

  const groupByCategory = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      if (!acc[transaction.categoria]) {
        acc[transaction.categoria] = 0
      }
      acc[transaction.categoria] += transaction.valor
      return acc
    }, {})
  })

  function exportToCSV() {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']
    const data = transactions.value.map(t => [
      new Date(t.data).toLocaleDateString(),
      t.tipo === 'income' ? 'Entrada' : 'Saída',
      t.categoria,
      t.descricao,
      t.valor.toFixed(2)
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
    error,
    fetchTransactions,
    addTransaction,
    removeTransaction,
    balance,
    incomes,
    expenses,
    groupByCategory,
    exportToCSV
  }
}) 