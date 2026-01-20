import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders_Service';
import { CreateOrderDto } from './dto/create_Order.dto';
import { UpdateOrderStatusDto } from './dto/update_OrderStatus.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_Auth.guard';
import { AdminGuard } from '../auth/guards/admin_Guard.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  findAll(@Request() req) {
    // If admin, return all orders; otherwise return user's orders
    if (req.user.role === 'admin') {
      return this.ordersService.findAll();
    }
    return this.ordersService.findByUser(req.user.id);
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(+id, req.user.id, updateStatusDto);
  }

  @Patch(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(+id, req.user.id);
  }
}
