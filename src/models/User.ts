/**
 * Model: User
 * Responsável pela estrutura de dados e regras de negócio dos usuários
 * Persistência via SQLite (sql.js)
 */

import { getDb, persistDb } from '../config/database';
import {
    UserData,
    UserCreateInput,
    UserPublic,
    UserList,
    ValidationResult,
    CreateUserResult
} from '../types/user.types';

interface UserRow {
    id: number;
    name: string;
    email: string;
    password: string | null;
    age: number | null;
    is_active: number;
    created_at: string;
    updated_at: string;
}

class User {
    id?: number;
    name: string;
    email: string;
    password: string | null;
    age: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password || null;
        this.age = data.age ?? null;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }

    /**
     * Converte uma linha do SQLite para UserData
     */
    private static fromRow(row: UserRow): UserData {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            age: row.age,
            is_active: row.is_active === 1,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }

    /**
     * Valida os dados do usuário
     */
    validate(): ValidationResult {
        const errors: string[] = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('O nome é obrigatório');
        } else if (this.name.trim().length < 2) {
            errors.push('O nome deve ter pelo menos 2 caracteres');
        }

        if (!this.email || this.email.trim() === '') {
            errors.push('O email é obrigatório');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                errors.push('O email deve ser válido');
            }
        }

        if (this.age !== null && this.age !== undefined) {
            if (this.age < 0 || this.age > 150) {
                errors.push('A idade deve ser um número entre 0 e 150');
            }
        }

        return { valid: errors.length === 0, errors };
    }

    /**
     * Retorna dados públicos do usuário (sem senha)
     */
    toPublicJSON(): UserPublic {
        return {
            id: this.id!,
            name: this.name,
            email: this.email,
            age: this.age,
            is_active: this.is_active,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    /**
     * Retorna dados básicos para listagem (Issue001)
     */
    toListJSON(): UserList {
        return {
            name: this.name,
            email: this.email,
            age: this.age
        };
    }

    /**
     * Salva o usuário no banco SQLite
     */
    save(): User {
        const db = getDb();
        this.updated_at = new Date().toISOString();

        if (this.id) {
            db.run(
                `UPDATE users SET name = ?, email = ?, password = ?, age = ?, is_active = ?, updated_at = ? WHERE id = ?`,
                [this.name, this.email, this.password, this.age, this.is_active ? 1 : 0, this.updated_at, this.id]
            );
        } else {
            db.run(
                `INSERT INTO users (name, email, password, age, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [this.name, this.email, this.password, this.age, this.is_active ? 1 : 0, this.created_at, this.updated_at]
            );
            // Pega o ID gerado
            const result = db.exec('SELECT last_insert_rowid() as id');
            if (result.length > 0 && result[0].values.length > 0) {
                this.id = result[0].values[0][0] as number;
            }
        }

        persistDb();
        return this;
    }

    // ==================== MÉTODOS ESTÁTICOS ====================

    /**
     * Busca todos os usuários ativos
     */
    static findAll(): User[] {
        const db = getDb();
        const result = db.exec('SELECT * FROM users WHERE is_active = 1');

        if (result.length === 0) return [];

        const columns = result[0].columns;
        return result[0].values.map((row: unknown[]) => {
            const obj: Record<string, unknown> = {};
            columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
            return new User(User.fromRow(obj as unknown as UserRow));
        });
    }

    /**
     * Busca usuário por ID
     */
    static findById(id: number): User | null {
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM users WHERE id = ? AND is_active = 1');
        stmt.bind([id]);

        if (stmt.step()) {
            const row = stmt.getAsObject() as unknown as UserRow;
            stmt.free();
            return new User(User.fromRow(row));
        }

        stmt.free();
        return null;
    }

    /**
     * Busca usuário por email
     */
    static findByEmail(email: string): User | null {
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND is_active = 1');
        stmt.bind([email]);

        if (stmt.step()) {
            const row = stmt.getAsObject() as unknown as UserRow;
            stmt.free();
            return new User(User.fromRow(row));
        }

        stmt.free();
        return null;
    }

    /**
     * Verifica se email já existe
     */
    static emailExists(email: string): boolean {
        const db = getDb();
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE LOWER(email) = LOWER(?)');
        stmt.bind([email]);
        stmt.step();
        const row = stmt.getAsObject() as { count: number };
        stmt.free();
        return row.count > 0;
    }

    /**
     * Cria um novo usuário
     */
    static create(data: UserCreateInput): CreateUserResult {
        const user = new User(data as UserData);

        const validation = user.validate();
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        if (User.emailExists(user.email)) {
            return { success: false, errors: ['Este email já está cadastrado'] };
        }

        user.save();
        return { success: true, user };
    }

    /**
     * Deleta um usuário (soft delete)
     */
    static delete(id: number): boolean {
        const user = User.findById(id);
        if (user) {
            user.is_active = false;
            user.save();
            return true;
        }
        return false;
    }

    /**
     * Retorna a contagem de usuários ativos
     */
    static count(): number {
        const db = getDb();
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
        stmt.step();
        const row = stmt.getAsObject() as { count: number };
        stmt.free();
        return row.count;
    }
}

export default User;
