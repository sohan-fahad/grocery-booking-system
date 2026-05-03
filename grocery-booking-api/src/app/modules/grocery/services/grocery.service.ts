import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BaseService } from '@src/app/base';
import { SuccessResponse } from '@src/app/types';
import { GroceryItem } from '../entities/grocery-item.entity';
import { CreateGroceryItemDTO, GetGroceryItemDTO } from '../dtos/grocery-item.dto';
import { toNumber } from '@src/shared';

@Injectable()
export class GroceryService extends BaseService<GroceryItem> {
    constructor(
        @InjectRepository(GroceryItem)
        private readonly _repo: Repository<GroceryItem>,
    ) {
        super(_repo);
    }

    async addItem(payload: CreateGroceryItemDTO, imageId?: string): Promise<GroceryItem> {
        return this.createOneBase({ ...payload, ...(imageId && { imageId }) } as any);
    }

    async getAllItems(filters: GetGroceryItemDTO): Promise<SuccessResponse> {

        const { searchTerm, page, limit, categoryId } = filters;
        const where: FindOptionsWhere<GroceryItem> = { isActive: true };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (searchTerm) {
            where.name = ILike(`%${searchTerm}%`);
        }
        const query: FindManyOptions<GroceryItem> = { where };
        if (page && limit) {
            query.skip = (page - 1) * limit;
            query.take = limit;
        }
        const result = await this._repo.findAndCount(query);

        return new SuccessResponse(
            `Grocery items fetched successfully`,
            result[0],
            {
                total: result[1],
                page: toNumber(page),
                limit: toNumber(limit),
                skip: toNumber(page) * toNumber(limit),
            },
        );
    }


    async getItemById(id: string): Promise<GroceryItem> {
        const item = await this.findByIdBase(id);
        if (!item) throw new NotFoundException('Grocery item not found');
        return item;
    }

    // async updateItem(id: string, payload: UpdateGroceryItemDTO): Promise<GroceryItem> {
    //     await this.getItemById(id);
    //     return this.updateOneBase(id, payload as any);
    // }

    // async removeItem(id: string): Promise<SuccessResponse> {
    //     await this.getItemById(id);
    //     return this.deleteOneBase(id);
    // }

    // async updateItemImage(id: string, imageId: string): Promise<GroceryItem> {
    //     await this.getItemById(id);
    //     return this.updateOneBase(id, { imageId } as any);
    // }

    // async manageInventory(id: string, payload: ManageInventoryDTO): Promise<GroceryItem> {
    //     const item = await this.getItemById(id);
    //     let newQuantity: number;

    //     if (payload.action === InventoryAction.ADD) {
    //         newQuantity = Number(item.quantity) + payload.quantity;
    //     } else if (payload.action === InventoryAction.SUBTRACT) {
    //         newQuantity = Number(item.quantity) - payload.quantity;
    //         if (newQuantity < 0) throw new BadRequestException('Insufficient stock');
    //     } else {
    //         newQuantity = payload.quantity;
    //     }

    //     return this.updateOneBase(id, { quantity: newQuantity } as any);
    // }
}
