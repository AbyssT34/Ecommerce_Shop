import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes_Service';
import { CreateRecipeDto } from './dto/create_Recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt_Auth.guard';
import { AdminGuard } from '../auth/guards/admin_Guard.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get('available')
  getAvailableRecipes() {
    return this.recipesService.getAvailableRecipes();
  }

  @Post('suggest-from-cart')
  suggestRecipesFromCart(@Body() body: { productIds: number[] }) {
    return this.recipesService.suggestRecipesFromCart(body.productIds);
  }

  @Get(':id/with-products')
  getRecipeWithProducts(@Param('id') id: string) {
    return this.recipesService.getRecipeWithProducts(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateRecipeDto: CreateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.recipesService.remove(+id);
  }
}
