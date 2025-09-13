import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainUser } from '../entities/main-user.entity';
import { RegisterDto, LoginDto } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MainUser)
    private userRepo: Repository<MainUser>,
  ) {}

  private sendTokenResponse(user: MainUser) {
    const token = user.getSignedJwtToken();
    return {
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password, phone, company } = registerDto;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('Please provide all required fields');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Check if user exists
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // Create user
    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
    });

    // Hash password
    await user.hashPassword();
    await this.userRepo.save(user);

    return this.sendTokenResponse(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new BadRequestException('Please provide email and password');
    }

    // Find user with password
    const user = await this.userRepo.findOne({ 
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'company', 'role', 'isVerified', 'password']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.sendTokenResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }
}
