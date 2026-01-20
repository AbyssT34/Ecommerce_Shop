export declare class CreateProductDto {
    name: string;
    sku?: string;
    description?: string;
    price: number;
    stockQuantity: number;
    categoryId?: number;
    imageUrl?: string;
    ingredientIds?: number[];
}
