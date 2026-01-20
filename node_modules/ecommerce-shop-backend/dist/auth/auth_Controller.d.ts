import { AuthService } from './auth_Service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<any>;
}
