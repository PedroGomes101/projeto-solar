/**
 * Server: Entry Point
 * Configura e inicializa o servidor Express
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================

// Habilita CORS para permitir requisições do front-end
app.use(cors());

// Parse JSON no body das requisições
app.use(express.json());

// Parse URL-encoded bodies (para formulários)
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// ==================== ROTAS ====================

// Rota principal - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rotas da API de usuários
app.use('/api/users', userRoutes);

// ==================== TRATAMENTO DE ERROS ====================

// Rota não encontrada (404)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Handler de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== INICIALIZAÇÃO ====================

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Servidor iniciado com sucesso!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api/users`);
    console.log('='.repeat(50));
});

module.exports = app;
