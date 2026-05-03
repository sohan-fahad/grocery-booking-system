import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceryItem } from './entities/grocery-item.entity';
import { InventoryUpdateCircular } from './entities/inventory-update-circular.entity';
import { InventoryUpdateCircularItem } from './entities/inventory-update-circular-item.entity';
import { GroceryService } from './services/grocery.service';
import { InventoryLogService } from './services/inventory-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([GroceryItem, InventoryUpdateCircular, InventoryUpdateCircularItem])],
    providers: [GroceryService, InventoryLogService],
    exports: [GroceryService, InventoryLogService],
})
export class GroceryModule {}
