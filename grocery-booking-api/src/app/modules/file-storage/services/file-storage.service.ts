import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IFileMeta } from '@src/interfaces';
import { SuccessResponse } from '@src/app/types';
import { ENV } from '@src/env';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import { join } from 'path';
import { FileStorage } from '../entities/file-storage.entity';
import { Repository } from 'typeorm';
import { BaseService } from '@src/app/base';
import { asyncForEach } from '@src/shared';

@Injectable()
export class FileStorageService extends BaseService<FileStorage> {
    private r2Client: S3Client;

    constructor(
        @InjectRepository(FileStorage)
        private readonly _repo: Repository<FileStorage>,
    ) {
        super(_repo);
        if (ENV.storage.type === 'r2') {
            this.r2Client = new S3Client({
                credentials: {
                    accessKeyId: ENV.r2.accessKey,
                    secretAccessKey: ENV.r2.secretKey,
                },
                endpoint: ENV.r2.endpoint,
                region: ENV.r2.region || 'auto',
                forcePathStyle: true,
            });
        }
    }

    async uploadImage(files: IFileMeta[], folder: string): Promise<SuccessResponse> {
        const uploadedFiles: FileStorage[] = [];
        const errors: string[] = [];
        const folderPath = folder || 'others';

        await asyncForEach(files, async (file: IFileMeta) => {
            try {
                let link: string;

                if (ENV.storage.type === 'r2') {
                    link = await this.uploadToR2(file, folderPath);
                } else {
                    link = await this.saveLocally(file, folderPath);
                }

                if (!link) throw new Error('File upload failed');

                const createdFile = await this.createOneBase({
                    storageType: ENV.storage.type,
                    fileType: file.mimetype,
                    folder: `images/${folderPath}`,
                    fileName: file.filename,
                    link,
                } as FileStorage);

                uploadedFiles.push(createdFile);
            } catch (error) {
                errors.push(error.message);
            }
        });

        if (errors.length > 0) throw new BadRequestException(errors);
        return new SuccessResponse('Uploaded successfully', uploadedFiles);
    }

    async uploadToR2(file: IFileMeta, folder: string): Promise<string> {
        const extension = file.path.split('.').pop();
        const fileContent = await fs.promises.readFile(file.path);
        const key = `${folder}/${Date.now()}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: ENV.r2.bucket,
            Key: key,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await this.r2Client.send(command);
        await fs.promises.unlink(file.path);

        return `${ENV.r2.cdnEndpoint}/${key}`;
    }

    async saveLocally(file: IFileMeta, folder: string): Promise<string> {
        const extension = file.path.split('.').pop();
        const destFolder = join(process.cwd(), 'uploads', 'images', folder);
        fs.mkdirSync(destFolder, { recursive: true });

        const fileName = `${Date.now()}.${extension}`;
        const destPath = join(destFolder, fileName);
        await fs.promises.rename(file.path, destPath);

        return `/uploads/images/${folder}/${fileName}`;
    }

    async deleteFile(id: string): Promise<SuccessResponse> {
        return this.deleteOneBase(id);
    }
}
