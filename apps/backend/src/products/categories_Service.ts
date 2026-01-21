import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category_Entity';
import { CreateCategoryDto } from './dto/create_Category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

    // Check validation
    const existing = await this.categoriesRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug "${slug}" already exists`);
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      slug
    });
    return await this.categoriesRepository.save(category);
  }

  async findAll() {
    return await this.categoriesRepository.find({
      relations: ['products'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: CreateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      // Only update slug if name changed AND slug not provided? 
      // Or keep old slug? Usually keep old slug unless explicitly changed.
      // Let's keep it simple: if slug provided, use it. Else keep existing.
    }

    // If slug is being updated, check conflict
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existing = await this.categoriesRepository.findOne({ where: { slug: updateCategoryDto.slug } });
      if (existing) {
        throw new ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`);
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
