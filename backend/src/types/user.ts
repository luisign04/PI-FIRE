// src/types/user.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  grupamento?: string; // Opcional, como na migration
  role: 'admin' | 'firefighter';
  created_at?: Date;
  updated_at?: Date;
}

// O tipo AuthUser é o que será retornado no login e salvo no JWT, 
// excluindo a senha_hash por segurança.
export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;

// Tipo de dados que chegam na requisição de registro (sem id, hash, etc.)
export type RegisterUserPayload = Pick<User, 'name' | 'email'> & { 
    password: string; 
    role?: 'admin' | 'firefighter';
};