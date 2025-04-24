const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://black-office-site-1.onrender.com/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // necessário para ambientes como o Neon.tech
  }
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) return res.status(401).json({ message: 'Não autenticado' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const user = userResult.rows[0];
    
    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Enviar token como cookie
    res.cookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }) ;
    
    res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logout bem-sucedido' });
});


app.post('/api/consultas', async (req, res) => {
  try {
    const { name, email, phone, service, specifications } = req.body;
    
    // Validar dados
    if (!name || !email || !phone || !service || !specifications) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Inserir consulta
    const result = await pool.query(
      'INSERT INTO consultas (name, email, phone, service, specifications) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, service, specifications]
    );
    
    res.status(201).json({ message: 'Consulta enviada com sucesso', consulta: result.rows[0] });
    
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para verificar autenticação
app.get('/api/auth/check', (req, res) => {
  const token = "valid_token";
  if (token === 'valid_token') { // <--- Substitua por sua lógica real de autenticação
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Rota para listar consultas (protegida por autenticação)
app.get('/api/consultas', async (req, res) => {
  try {
    const { page = 1, status = 'all' } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM consultas';
    const params = [];

    if (status !== 'all') {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    params.push(limit, offset);

    const { rows: consultas } = await pool.query(query, params);
    const total = await pool.query('SELECT COUNT(*) FROM consultas');

    res.json({
      consultas,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total.rows[0].count / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota para detalhes de uma consulta (protegida)
app.get('/api/consultas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM consultas WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(404).json({ error: 'Consulta não encontrada' });
  }
});

// Rota para atualizar status (protegida)
// Rota para atualizar status (protegida)
app.put('/api/consultas/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE consultas SET status = $1 WHERE id = $2',
      [status, id]
    );
    res.json({ message: 'Status atualizado com sucesso' }); // <--- Correção aqui
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});






// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
