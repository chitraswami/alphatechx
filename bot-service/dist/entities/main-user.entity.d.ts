export declare class MainUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string | null;
    company: string | null;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    comparePassword(candidatePassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
}
