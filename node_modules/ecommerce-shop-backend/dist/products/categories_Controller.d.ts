import { CategoriesService } from './categories_Service';
import { CreateCategoryDto } from './dto/create_Category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category_Entity").Category>;
    findAll(): Promise<import("./entities/category_Entity").Category[]>;
    findOne(id: string): Promise<import("./entities/category_Entity").Category>;
    update(id: string, updateCategoryDto: CreateCategoryDto): Promise<import("./entities/category_Entity").Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
