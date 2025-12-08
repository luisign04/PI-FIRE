import { User } from '../types/user';
export declare class UserModel {
    findByEmail(email: string): Promise<User | undefined>;
    create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number>;
}
export declare const userModel: UserModel;
//# sourceMappingURL=userModel.d.ts.map