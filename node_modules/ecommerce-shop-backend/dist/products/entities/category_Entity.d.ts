import { Product } from './product_Entity';
export declare class Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    products: Product[];
    createdAt: Date;
}
