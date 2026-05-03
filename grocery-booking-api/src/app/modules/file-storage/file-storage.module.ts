import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorage } from './entities/file-storage.entity';
import { FileStorageService } from './services/file-storage.service';

@Module({
    imports: [TypeOrmModule.forFeature([FileStorage])],
    providers: [FileStorageService],
    exports: [FileStorageService],
})
export class FileStorageModule {}
