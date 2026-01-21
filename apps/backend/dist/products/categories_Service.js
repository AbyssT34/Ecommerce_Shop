"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_Entity_1 = require("./entities/category_Entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }
    async create(createCategoryDto) {
        const slug = createCategoryDto.slug || this.generateSlug(createCategoryDto.name);
        const existing = await this.categoriesRepository.findOne({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException(`Category with slug "${slug}" already exists`);
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
    async findOne(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['products'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.name && !updateCategoryDto.slug) {
        }
        if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
            const existing = await this.categoriesRepository.findOne({ where: { slug: updateCategoryDto.slug } });
            if (existing) {
                throw new common_1.ConflictException(`Category with slug "${updateCategoryDto.slug}" already exists`);
            }
        }
        Object.assign(category, updateCategoryDto);
        return await this.categoriesRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_Entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories_Service.js.map