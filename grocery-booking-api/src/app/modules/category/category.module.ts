import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/category.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
