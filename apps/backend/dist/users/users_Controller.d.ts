import { UsersService } from './users_Service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user_Entity").User[]>;
    findOne(id: string): Promise<import("./entities/user_Entity").User>;
    update(id: string, updateUserDto: any): Promise<import("./entities/user_Entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
