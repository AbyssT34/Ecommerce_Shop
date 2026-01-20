import { Repository } from 'typeorm';
import { Product } from './entities/product_Entity';
import { Category } from './entities/category_Entity';
import { Ingredient } from './entities/ingredient_Entity';
import { ProductIngredient } from './entities/product_Ingredient_Entity';
import { CreateProductDto } from './dto/create_Product.dto';
import { UpdateProductDto } from './dto/update_Product.dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    private ingredientsRepository;
    private productIngredientsRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>, ingredientsRepository: Repository<Ingredient>, productIngredientsRepository: Repository<ProductIngredient>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    findByCategory(categoryId: number): Promise<Product[]>;
    findInStock(): Promise<Product[]>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: number): Promise<{
        message: string;
    }>;
    updateStock(id: number, quantity: number): Promise<Product>;
    decrementStock(id: number, quantity: number): Promise<Product>;
}
