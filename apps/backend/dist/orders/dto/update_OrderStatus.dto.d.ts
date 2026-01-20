export declare class UpdateOrderStatusDto {
    status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'rejected' | 'cancelled';
    adminNotes?: string;
}
