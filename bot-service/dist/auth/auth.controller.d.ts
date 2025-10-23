import { AuthService } from './auth.service';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getMe(user: any): Promise<{
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
