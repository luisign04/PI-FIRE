import { AuthUser } from '../types/user';
export declare class AuthService {
    register(name: string, email: string, password_input: string, role?: string): Promise<{
        user: AuthUser;
        token: string;
    }>;
    login(email: string, password_input: string): Promise<{
        user: AuthUser;
        token: string;
    }>;
    private generateToken;
    verifyToken(token: string): AuthUser | null;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map