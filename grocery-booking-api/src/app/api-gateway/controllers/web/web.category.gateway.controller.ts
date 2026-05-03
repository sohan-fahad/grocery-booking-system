import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '@src/app/modules/category/services/category.service';
import { GetCategoryDTO } from '@src/app/modules/category/dtos/category.dto';
import { SuccessResponse } from '@src/app/types';

@ApiTags('Categories')
@Controller('web/categories')
export class WebCategoryGatewayController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async getAllCategories(@Query() query: GetCategoryDTO) {
        return this.categoryService.getAllCategories(query);
    }

    @Get('with-products')
    @ApiOperation({ summary: 'Get all categories with their products (for home page)' })
    async getCategoriesWithProducts() {
        const categories = await this.categoryService.getCategoriesWithProducts();
        return new SuccessResponse('Categories with products fetched successfully', categories);
    }
}
