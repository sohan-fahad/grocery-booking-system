import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

export const imageStorageOptions = {
    storage: diskStorage({
        destination: (_req, _file, cb) => {
            const uploadPath = join(process.cwd(), 'uploads', 'temp');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
        },
    }),
    fileFilter: (_req: any, file: any, cb: any) => {
        if (!file.mimetype.match(/^image\//)) {
            return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
};
