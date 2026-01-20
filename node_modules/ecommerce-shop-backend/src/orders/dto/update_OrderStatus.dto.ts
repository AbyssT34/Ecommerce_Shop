import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'approved', 'processing', 'shipped', 'delivered', 'rejected', 'cancelled'])
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'rejected' | 'cancelled';

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
