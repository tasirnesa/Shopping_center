import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
    private readonly allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    private readonly maxFileSizeBytes = 10 * 1024 * 1024; // 10 MB = 10,485,760 bytes

    validateFile(file: Express.Multer.File): void {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
        }
        if (file.size > this.maxFileSizeBytes) {
            throw new BadRequestException(`File size exceeds 10 MB limit`);
        }
    }

    /**
     * Stores a file under uploads/{subPath}/{attachmentType}_{timestamp}_{originalname}.
     * @param file         Multer file object (must have buffer, originalname)
     * @param subPath      Relative sub-directory, e.g. "{orgId}/{orderId}"
     * @param attachmentType  Optional type prefix for the filename (e.g. "TRADE_LICENSE")
     * @returns            The stored relative path
     */
    async store(
        file: Express.Multer.File,
        subPath: string,
        attachmentType?: string,
    ): Promise<string> {
        const timestamp = Date.now();
        const destDir = path.join('uploads', subPath);
        await fs.promises.mkdir(destDir, { recursive: true });

        // Build filename: {attachmentType}_{timestamp}_{originalname}
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const typePrefix = attachmentType ? `${attachmentType}_` : '';
        const fileName = `${typePrefix}${timestamp}_${safeName}`;
        const dest = path.join(destDir, fileName);

        // Prefer buffer (memory storage); fall back to reading from disk path (disk storage)
        const data = file.buffer ?? (file.path ? await fs.promises.readFile(file.path) : Buffer.alloc(0));
        await fs.promises.writeFile(dest, data);
        return dest;
    }
}
