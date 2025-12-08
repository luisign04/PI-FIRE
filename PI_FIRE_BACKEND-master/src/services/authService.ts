import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel'; // Importa o modelo para interação com o DB
import { User, AuthUser } from '../types/user';


// CHAVE SECRETA para assinar os tokens (DEVE vir de variáveis de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-forte-aqui'; 

export class AuthService {
    
    // 1. REGISTRO (Cria o hash da senha e gera o token)
    public async register(name: string, email: string, password_input: string, role: string = 'firefighter'): Promise<{ user: AuthUser, token: string }> {
        // ... (Verificação se o usuário existe)

        // Gera o hash seguro da senha
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password_input, saltRounds);

        // CORREÇÃO AQUI: Afirmamos que a variável 'role' é do tipo correto
        const userRole = role as User['role']; 

        // Salva no banco de dados, usando a role tipada corretamente
        const id = await userModel.create({ name, email, password_hash, role: userRole });

        // Gera o token de acesso
        const user: AuthUser = { id, name, email, role: userRole };
        const token = this.generateToken(user);

        return { user, token };
    }

    // 2. LOGIN (Compara o hash da senha e gera o token)
        public async login(email: string, password_input: string): Promise<{ user: AuthUser, token: string }> {
        const user = await userModel.findByEmail(email);

        // Se o email não existir ou a senha não bater, retorna erro genérico por segurança
        if (!user) {
            throw new Error('Credenciais inválidas.'); 
        }

        // Compara a senha digitada com o hash salvo
        const isMatch = await bcrypt.compare(password_input, user.password_hash);
        
        if (!isMatch) {
            throw new Error('Credenciais inválidas.');
        }

        // Gera o token de acesso
        const authUser: AuthUser = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = this.generateToken(authUser);

        return { user: authUser, token };
    }

    // 3. GERAÇÃO DE TOKEN (Assina o token)
    private generateToken(user: AuthUser): string {
        return jwt.sign(user, JWT_SECRET, { expiresIn: '1d' }); 
    }
    // 4. VERIFICAÇÃO DE TOKEN (Usado pelo middleware)
    public verifyToken(token: string): AuthUser | null {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
            return decoded;
        } catch (error) {
            return null;
        }
    }
}
export const authService = new AuthService();