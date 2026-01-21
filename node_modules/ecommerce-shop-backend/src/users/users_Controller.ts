import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users_Service';
import { JwtAuthGuard } from '../auth/guards/jwt_Auth.guard';
import { AdminGuard } from '../auth/guards/admin_Guard.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(AdminGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
