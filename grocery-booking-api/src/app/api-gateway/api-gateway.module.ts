import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { GroceryModule } from '../modules/grocery/grocery.module';
import { OrderModule } from '../modules/order/order.module';
import { HelpersModule } from '../helpers/helper.module';
import { FileStorageModule } from '../modules/file-storage/file-storage.module';
import { CategoryModule } from '../modules/category/category.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { SeedModule } from '../modules/seed/seed.module';
import { WebAuthGatewayController } from './controllers/web/web.auth.gateway.controller';
import { WebGroceryGatewayController } from './controllers/web/web.grocery.gateway.controller';
import { WebCategoryGatewayController } from './controllers/web/web.category.gateway.controller';
import { WebOrderGatewayController } from './controllers/web/web.order.gateway.controller';
import { AdminFileStorageGatewayController } from './controllers/admin/admin.file-storage.gateway.controller';
import { AdminGroceryGatewayController } from './controllers/admin/admin.grocery.gateway.controller';
import { AdminInventoryLogGatewayController } from './controllers/admin/admin.inventory-log.gateway.controller';
import { AdminCategoryGatewayController } from './controllers/admin/admin.category.gateway.controller';
import { AdminSeedGatewayController } from './controllers/admin/admin.seed.gateway.controller';
import { AdminOrderGatewayController } from './controllers/admin/admin.order.gateway.controller';
import { AdminDashboardGatewayController } from './controllers/admin/admin.dashboard.gateway.controller';

const modules = [
    UserModule,
    GroceryModule,
    OrderModule,
    HelpersModule,
    FileStorageModule,
    CategoryModule,
    SeedModule,
    DashboardModule,
];

const webControllers = [
    WebAuthGatewayController,
    WebGroceryGatewayController,
    WebCategoryGatewayController,
    WebOrderGatewayController,
];

const adminControllers = [
    AdminFileStorageGatewayController,
    AdminGroceryGatewayController,
    AdminInventoryLogGatewayController,
    AdminCategoryGatewayController,
    AdminSeedGatewayController,
    AdminOrderGatewayController,
    AdminDashboardGatewayController,
];

@Module({
    imports: [...modules],
    controllers: [...webControllers, ...adminControllers],
})
export class APIGatewayModule {}
