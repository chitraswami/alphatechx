import { Repository } from 'typeorm';
import { MainUser } from '../entities/main-user.entity';
import { RegisterDto, LoginDto } from './auth.controller';
export declare class AuthService {
    private userRepo;
    constructor(userRepo: Repository<MainUser>);
    private sendTokenResponse;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            company: string | null;
            role: string;
            isVerified: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            company: string | null;
            role: string;
            isVerified: boolean;
        };
    }>;
    getMe(userId: string): Promise<{
        success: boolean;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            company: string | null;
            role: string;
            isVerified: boolean;
        };
    }>;
}
