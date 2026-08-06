export declare class FileUploadService {
    private readonly allowedMimeTypes;
    private readonly maxFileSizeBytes;
    validateFile(file: Express.Multer.File): void;
    store(file: Express.Multer.File, subPath: string, attachmentType?: string): Promise<string>;
}
