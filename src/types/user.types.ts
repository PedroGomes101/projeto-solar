/**
 * Types: User Types
 * Define os tipos e interfaces para usuários
 */

export interface UserData {
    id?: number;
    name: string;
    email: string;
    password?: string | null;
    age?: number | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface UserCreateInput {
    name: string;
    email: string;
    password?: string;
    age?: number;
}

export interface UserPublic {
    id: number;
    name: string;
    email: string;
    age: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserList {
    name: string;
    email: string;
    age: number | null;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface CreateUserResult {
    success: boolean;
    user?: UserData;
    errors?: string[];
}
