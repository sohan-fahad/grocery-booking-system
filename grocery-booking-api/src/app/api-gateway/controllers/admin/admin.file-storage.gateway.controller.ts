import {
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Post,
    Body,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@src/app/decorators/roles.decorator';
import { RolesGuard } from '@src/app/guards/roles.guard';
import { FileStorageService } from '@src/app/modules/file-storage/services/file-storage.service';
import { SuccessResponse } from '@src/app/types';
import { IFileMeta } from '@src/interfaces';
import { imageStorageOptions, UserRole } from '@src/shared';

@ApiTags('Admin - File Storage')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/file-storage')
export class AdminFileStorageGatewayController {
    constructor(private readonly fileStorageService: FileStorageService) {}

    @Post()
    @ApiOperation({ summary: 'Upload images to a folder' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files'],
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
                folder: {
                    type: 'string',
                    example: 'grocery-items',
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('files', 5, imageStorageOptions))
    async uploadImages(
        @UploadedFiles() files: IFileMeta[],
        @Body('folder') folder: string,
    ): Promise<SuccessResponse> {
        return this.fileStorageService.uploadImage(files, folder || 'general');
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a file record' })
    async deleteOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponse> {
        return this.fileStorageService.deleteFile(id);
    }
}
