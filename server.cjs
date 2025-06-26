const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const dbPath = path.join(__dirname, 'banco.db');
console.log('Banco de dados SQLite em:', dbPath);
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());

// Criação das tabelas se não existirem
const createTables = () => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NULL,
    tipo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    valor REAL NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);
};
createTables();

// Usuários
app.get('/api/usuarios', (req, res) => {
  db.all('SELECT id, nome, email FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;
  console.log('Recebendo novo usuário:', req.body);
  db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha], function(err) {
    if (err) {
      console.error('Erro ao inserir usuário:', err.message);
      return res.status(400).json({ error: err.message });
    }
    console.log('Usuário inserido com sucesso, id:', this.lastID);
    res.json({ id: this.lastID });
  });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Credenciais inválidas' });
    res.json(row);
  });
});

// Transações
app.get('/api/transacoes', (req, res) => {
  db.all('SELECT * FROM transacoes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/transacoes', (req, res) => {
  // Loga o body cru recebido
  console.log('Body recebido:', req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('Body vazio ou malformado!');
    return res.status(400).json({ error: 'Body vazio ou malformado!' });
  }
  // Aceita tanto em inglês quanto em português
  const usuario_id = req.body.usuario_id || req.body.user_id;
  const tipo = req.body.tipo || req.body.type;
  const categoria = req.body.categoria || req.body.category;
  const descricao = req.body.descricao || req.body.description;
  const valor = req.body.valor || req.body.amount;
  const data = req.body.data || req.body.date;

  console.log('Campos mapeados:', { usuario_id, tipo, categoria, descricao, valor, data });

  if (!tipo) {
    console.error('Campo tipo está vazio ou undefined!');
    return res.status(400).json({ error: 'Campo tipo é obrigatório!' });
  }

  console.log('Recebendo nova transação:', { usuario_id, tipo, categoria, descricao, valor, data });

  db.run(
    'INSERT INTO transacoes (usuario_id, tipo, categoria, descricao, valor, data) VALUES (?, ?, ?, ?, ?, ?)',
    [usuario_id, tipo, categoria, descricao, valor, data],
    function(err) {
      if (err) {
        console.error('Erro ao inserir transação:', err.message);
        return res.status(400).json({ error: err.message });
      }
      console.log('Transação inserida com sucesso, id:', this.lastID);
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/api/transacoes/:id', (req, res) => {
  db.run('DELETE FROM transacoes WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(3001, () => console.log('API rodando em http://localhost:3001')); 