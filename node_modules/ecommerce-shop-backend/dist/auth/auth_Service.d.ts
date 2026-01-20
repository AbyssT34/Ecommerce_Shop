import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user_Entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: number;
            email: string;
            fullName: string;
            role: "user" | "admin";
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: number;
            email: string;
            fullName: string;
            phone: string;
            address: string;
            role: "user" | "admin";
        };
        accessToken: string;
    }>;
    validateUser(userId: number): Promise<User>;
}
