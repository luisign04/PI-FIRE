import api from './api';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { username, password });
    
    if (response.data.success) {
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    }
    
    return response.data;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  getUser(): User | null {
    if (!this.user) {
      const userStr = localStorage.getItem('user');
      this.user = userStr ? JSON.parse(userStr) : null;
    }
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Verificar se o token ainda é válido
  async checkAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await api.get('/auth/verify');
      return response.data.success;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();