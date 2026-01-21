import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user_Entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll() {
        return this.usersRepository.find({
            select: ['id', 'email', 'fullName', 'phone', 'address', 'role', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: Partial<User>) {
        const user = await this.findOne(id);

        // Don't allow password updates via this endpoint for now
        delete updateUserDto.passwordHash;

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: number) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return { message: 'User deleted successfully' };
    }
}
