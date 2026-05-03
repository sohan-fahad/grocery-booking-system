import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { FileStorageService } from '@src/app/modules/file-storage/services/file-storage.service';
import { FileStorage } from '@src/app/modules/file-storage/entities/file-storage.entity';
import { CreateGroceryItemDTO, GetGroceryItemDTO, UpdateGroceryItemDTO } from '@src/app/modules/grocery/dtos/grocery-item.dto';
import { ManageInventoryDTO } from '@src/app/modules/grocery/dtos/manage-inventory.dto';
import { GroceryService } from '@src/app/modules/grocery/services/grocery.service';
import { SuccessResponse } from '@src/app/types';
import { IFileMeta } from '@src/interfaces';
import { imageStorageOptions, UserRole } from '@src/shared';

@ApiTags('Admin - Grocery')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/grocery')
export class AdminGroceryGatewayController {
    constructor(
        private readonly groceryService: GroceryService,
        private readonly fileStorageService: FileStorageService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Add a new grocery item' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['name', 'price', 'quantity'],
            properties: {
                name: { type: 'string', example: 'Organic Apples' },
                description: { type: 'string', example: 'Fresh organic apples' },
                price: { type: 'number', example: 2.99 },
                quantity: { type: 'number', example: 100 },
                file: { type: 'string', format: 'binary', description: 'Optional product image' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', imageStorageOptions))
    async addItem(
        @Body() body: CreateGroceryItemDTO,
        @UploadedFile() file?: IFileMeta,
    ) {
        let imageId: string | undefined;
        if (file) {
            const uploadResult = await this.fileStorageService.uploadImage([file], 'grocery-items');
            const fileStorage = (uploadResult.data as FileStorage[])[0];
            imageId = fileStorage.id;
        }
        const item = await this.groceryService.addItem(body, imageId);
        return new SuccessResponse('Grocery item added successfully', item);
    }

    @Get()
    @ApiOperation({ summary: 'View all grocery items' })
    async getAllItems(@Query() query: GetGroceryItemDTO) {
        return await this.groceryService.getAllItems(query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update grocery item details' })
    async updateItem(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateGroceryItemDTO,
    ) {
        const item = await this.groceryService.updateOneBase(id, body);
        return new SuccessResponse('Grocery item updated successfully', item);
    }

    // @Patch(':id/image')
    // @ApiOperation({ summary: 'Upload image for a grocery item' })
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         required: ['file'],
    //         properties: {
    //             file: { type: 'string', format: 'binary' },
    //         },
    //     },
    // })
    // @UseInterceptors(FileInterceptor('file', imageStorageOptions))
    // async uploadItemImage(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @UploadedFile() file: IFileMeta,
    // ) {
    //     const uploadResult = await this.fileStorageService.uploadImage([file], 'grocery-items');
    //     const fileStorage = (uploadResult.data as FileStorage[])[0];
    //     const item = await this.groceryService.updateItemImage(id, fileStorage.id);
    //     return new SuccessResponse('Image uploaded successfully', item);
    // }

    // @Patch(':id/inventory')
    // @ApiOperation({ summary: 'Manage inventory levels' })
    // async manageInventory(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @Body() body: ManageInventoryDTO,
    // ) {
    //     const item = await this.groceryService.manageInventory(id, body);
    //     return new SuccessResponse('Inventory updated successfully', item);
    // }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a grocery item' })
    async removeItem(@Param('id', ParseUUIDPipe) id: string) {
        return this.groceryService.updateOneBase(id, {
            deletedAt: new Date(),
        });
    }
}
