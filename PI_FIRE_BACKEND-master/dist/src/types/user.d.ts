export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    grupamento?: string;
    role: 'admin' | 'firefighter';
    created_at?: Date;
    updated_at?: Date;
}
export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
export type RegisterUserPayload = Pick<User, 'name' | 'email'> & {
    password: string;
    role?: 'admin' | 'firefighter';
};
//# sourceMappingURL=user.d.ts.map