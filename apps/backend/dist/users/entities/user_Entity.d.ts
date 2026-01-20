export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    fullName: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
