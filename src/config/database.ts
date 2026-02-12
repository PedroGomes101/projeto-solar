/**
 * Database Configuration
 * Configura e gerencia a conexão com SQLite via sql.js
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'database.sqlite');

let db: SqlJsDatabase;

/**
 * Salva o banco de dados no disco
 */
function saveDatabase(): void {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Inicializa o banco de dados SQLite
 */
export async function initDatabase(): Promise<void> {
    const SQL = await initSqlJs();

    // Cria a pasta data se não existir
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    // Carrega banco existente ou cria novo
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        console.log('✅ Banco de dados SQLite carregado de:', DB_PATH);
    } else {
        db = new SQL.Database();
        console.log('✅ Novo banco de dados SQLite criado');
    }

    // Cria tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT,
            age INTEGER,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
    `);

    saveDatabase();
    console.log('✅ Tabela "users" pronta');
}

/**
 * Retorna a instância do banco de dados
 */
export function getDb(): SqlJsDatabase {
    if (!db) {
        throw new Error('Banco de dados não inicializado. Chame initDatabase() primeiro.');
    }
    return db;
}

/**
 * Salva alterações no disco
 */
export function persistDb(): void {
    saveDatabase();
}
