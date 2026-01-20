import { ProductsService } from './products_Service';
import { CreateProductDto } from './dto/create_Product.dto';
import { UpdateProductDto } from './dto/update_Product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product_Entity").Product>;
    findAll(inStock?: string): Promise<import("./entities/product_Entity").Product[]>;
    findByCategory(categoryId: string): Promise<import("./entities/product_Entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product_Entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product_Entity").Product>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number): Promise<import("./entities/product_Entity").Product>;
}
