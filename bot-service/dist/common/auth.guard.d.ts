import { CanActivate, ExecutionContext } from '@nestjs/common';
export interface AuthUser {
    id: string;
}
export declare class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
