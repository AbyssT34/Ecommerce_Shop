import { Repository } from 'typeorm';
import { Category } from './entities/category_Entity';
import { CreateCategoryDto } from './dto/create_Category.dto';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
