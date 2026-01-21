import { Repository } from 'typeorm';
import { User } from './entities/user_Entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: Partial<User>): Promise<User>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
