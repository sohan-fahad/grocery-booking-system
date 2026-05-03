import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '@src/app/base';
import {
    InventoryCircularStatus,
    InventoryUpdateCircular,
} from '../entities/inventory-update-circular.entity';
import { InventoryUpdateCircularItem } from '../entities/inventory-update-circular-item.entity';
import { GroceryItem } from '../entities/grocery-item.entity';
import { InventoryUpdateCircularDTO } from '../dtos/inventory-update-circular.dto';
import { InventoryAction } from '../dtos/manage-inventory.dto';

@Injectable()
export class InventoryLogService extends BaseService<InventoryUpdateCircular> {
    constructor(
        @InjectRepository(InventoryUpdateCircular)
        private readonly _circularRepo: Repository<InventoryUpdateCircular>,
        @InjectRepository(InventoryUpdateCircularItem)
        private readonly _itemRepo: Repository<InventoryUpdateCircularItem>,
        @InjectRepository(GroceryItem)
        private readonly _groceryRepo: Repository<GroceryItem>,
        private readonly dataSource: DataSource,
    ) {
        super(_circularRepo);
    }

    async createCircular(payload: InventoryUpdateCircularDTO): Promise<InventoryUpdateCircular> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const circular = this._circularRepo.create({
                title: payload.title,
                reason: payload.reason,
                status: InventoryCircularStatus.DRAFTED,
            });
            const savedCircular = await queryRunner.manager.save(InventoryUpdateCircular, circular);

            for (const itemPayload of payload.items) {
                const groceryItem = await queryRunner.manager.findOne(GroceryItem, {
                    where: { id: itemPayload.groceryItemId, isActive: true },
                });
                if (!groceryItem) {
                    throw new NotFoundException(`Grocery item ${itemPayload.groceryItemId} not found`);
                }

                const previousQuantity = Number(groceryItem.quantity);
                let newQuantity: number;

                if (itemPayload.action === InventoryAction.ADD) {
                    newQuantity = previousQuantity + itemPayload.quantity;
                } else if (itemPayload.action === InventoryAction.SUBTRACT) {
                    newQuantity = previousQuantity - itemPayload.quantity;
                    if (newQuantity < 0) {
                        throw new BadRequestException(
                            `Insufficient stock for "${groceryItem.name}". Current: ${previousQuantity}, requested: ${itemPayload.quantity}`,
                        );
                    }
                } else {
                    newQuantity = itemPayload.quantity;
                }

                await queryRunner.manager.update(GroceryItem, groceryItem.id, { quantity: newQuantity });

                const logItem = this._itemRepo.create({
                    circularId: savedCircular.id,
                    groceryItemId: groceryItem.id,
                    previousQuantity,
                    newQuantity,
                    quantityChanged: Math.abs(newQuantity - previousQuantity),
                    action: itemPayload.action,
                });
                await queryRunner.manager.save(InventoryUpdateCircularItem, logItem);
            }

            await queryRunner.manager.update(InventoryUpdateCircular, savedCircular.id, {
                status: InventoryCircularStatus.APPLIED,
            });

            await queryRunner.commitTransaction();

            return this._circularRepo.findOne({ where: { id: savedCircular.id } });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
