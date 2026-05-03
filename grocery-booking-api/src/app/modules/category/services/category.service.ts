import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BaseService } from '@src/app/base';
import { SuccessResponse } from '@src/app/types';
import { toNumber } from '@src/shared';
import { Category } from '../entities/category.entity';
import { CreateCategoryDTO, GetCategoryDTO } from '../dtos/category.dto';

@Injectable()
export class CategoryService extends BaseService<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly _repo: Repository<Category>,
    ) {
        super(_repo);
    }

    async addCategory(payload: CreateCategoryDTO): Promise<Category> {
        return this.createOneBase({ ...payload } as any);
    }

    async getAllCategories(filters: GetCategoryDTO): Promise<SuccessResponse> {
        const { searchTerm, page, limit } = filters;
        const query: any = { where: { isActive: true } };

        if (searchTerm) query.where.name = ILike(`%${searchTerm}%`);
        if (page && limit) {
            query.skip = (toNumber(page) - 1) * toNumber(limit);
            query.take = toNumber(limit);
        }

        const result = await this._repo.findAndCount(query);
        return new SuccessResponse('Categories fetched successfully', result[0], {
            total: result[1],
            page: toNumber(page),
            limit: toNumber(limit),
            skip: toNumber(page) * toNumber(limit),
        });
    }

    async getCategoryById(id: string): Promise<Category> {
        const category = await this.findByIdBase(id);
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async getCategoriesWithProducts(): Promise<Category[]> {
        return this._repo.find({
            where: { isActive: true },
            relations: ['products'],
            order: { name: 'ASC' },
        });
    }
}
