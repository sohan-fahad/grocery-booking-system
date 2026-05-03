import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { GroceryModule } from '../grocery/grocery.module';
import { SeedService } from './seed.service';

@Module({
    imports: [UserModule, CategoryModule, GroceryModule],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule {}
