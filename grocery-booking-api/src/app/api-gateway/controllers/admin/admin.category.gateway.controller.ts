import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { CategoryService } from '@src/app/modules/category/services/category.service';
import { CreateCategoryDTO, GetCategoryDTO, UpdateCategoryDTO } from '@src/app/modules/category/dtos/category.dto';
import { SuccessResponse } from '@src/app/types';
import { UserRole } from '@src/shared';

@ApiTags('Admin - Categories')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/categories')
export class AdminCategoryGatewayController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    async createCategory(@Body() body: CreateCategoryDTO) {
        const category = await this.categoryService.addCategory(body);
        return new SuccessResponse('Category created successfully', category);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async getAllCategories(@Query() query: GetCategoryDTO) {
        return this.categoryService.getAllCategories(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    async getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
        const category = await this.categoryService.getCategoryById(id);
        return new SuccessResponse('Category fetched successfully', category);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    async updateCategory(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateCategoryDTO,
    ) {
        const category = await this.categoryService.updateOneBase(id, body);
        return new SuccessResponse('Category updated successfully', category);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' })
    async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
        await this.categoryService.getCategoryById(id);
        return this.categoryService.updateOneBase(id, { deletedAt: new Date() } as any);
    }
}
