/**
 * Server: Entry Point
 * Configura e inicializa o servidor Express com SQLite
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './config/database';
import userRoutes from './routes/userRoutes';

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
app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rotas da API de usuários
app.use('/api/users', userRoutes);

// ==================== TRATAMENTO DE ERROS ====================

// Rota não encontrada (404)
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Handler de erros global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Erro:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== INICIALIZAÇÃO ====================

async function startServer(): Promise<void> {
    // Inicializa o banco de dados SQLite
    await initDatabase();

    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log('🚀 Servidor TypeScript + SQLite iniciado!');
        console.log(`📍 URL: http://localhost:${PORT}`);
        console.log(`📍 API: http://localhost:${PORT}/api/users`);
        console.log(`💾 Banco: SQLite (data/database.sqlite)`);
        console.log('='.repeat(50));
    });
}

startServer().catch((err) => {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
});

export default app;
