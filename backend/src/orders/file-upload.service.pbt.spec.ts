import * as fc from 'fast-check';
import { BadRequestException } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

/**
 * Property-Based Tests for FileUploadService
 *
 * Validates: Requirements 1.8, 8.4
 */
describe('FileUploadService — Property-Based Tests', () => {
  let service: FileUploadService;

  const VALID_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10,485,760 bytes

  beforeEach(() => {
    service = new FileUploadService();
  });

  /**
   * Helper to build a minimal Express.Multer.File stub.
   */
  function makeFile(
    mimetype: string,
    size: number,
  ): Express.Multer.File {
    return {
      fieldname: 'file',
      originalname: 'test-file',
      encoding: '7bit',
      mimetype,
      size,
      buffer: Buffer.alloc(0),
      destination: '',
      filename: '',
      path: '',
      stream: null as any,
    };
  }

  // ---------------------------------------------------------------------------
  // Property 4: Attachment File Validation
  //
  // For any file with valid MIME type AND size ≤ 10 MB → validateFile MUST NOT throw.
  // For any file where MIME type ∉ valid set OR size > 10 MB → validateFile MUST throw.
  //
  // Validates: Requirements 1.8, 8.4
  // ---------------------------------------------------------------------------
  describe('Property 4: Attachment File Validation', () => {
    it('should accept any file with a valid MIME type AND size ≤ 10 MB', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * For all (mimeType, size) pairs where mimeType ∈ {application/pdf, image/jpeg, image/png}
       * and 0 ≤ size ≤ 10,485,760, validateFile SHALL NOT throw.
       */
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_MIME_TYPES),
          fc.integer({ min: 0, max: MAX_FILE_SIZE }),
          (mimetype: string, size: number) => {
            const file = makeFile(mimetype, size);
            expect(() => service.validateFile(file)).not.toThrow();
          },
        ),
      );
    });

    it('should reject any file with an invalid MIME type regardless of size', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * For any mimeType ∉ {application/pdf, image/jpeg, image/png} and any size,
       * validateFile SHALL throw BadRequestException.
       */
      const invalidMimeArb = fc
        .string({ minLength: 1, maxLength: 50 })
        .filter((m) => !VALID_MIME_TYPES.includes(m));

      fc.assert(
        fc.property(
          invalidMimeArb,
          fc.integer({ min: 0, max: MAX_FILE_SIZE }),
          (mimetype: string, size: number) => {
            const file = makeFile(mimetype, size);
            expect(() => service.validateFile(file)).toThrow(
              BadRequestException,
            );
          },
        ),
      );
    });

    it('should reject any file exceeding 10 MB regardless of MIME type', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * For any mimeType (valid or not) and size > 10,485,760,
       * validateFile SHALL throw BadRequestException.
       */
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_MIME_TYPES),
          fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 10 }),
          (mimetype: string, size: number) => {
            const file = makeFile(mimetype, size);
            expect(() => service.validateFile(file)).toThrow(
              BadRequestException,
            );
          },
        ),
      );
    });

    it('should reject files with both invalid MIME type AND size > 10 MB', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * When both conditions fail (invalid MIME AND oversized), the file is still rejected.
       */
      const invalidMimeArb = fc
        .string({ minLength: 1, maxLength: 50 })
        .filter((m) => !VALID_MIME_TYPES.includes(m));

      fc.assert(
        fc.property(
          invalidMimeArb,
          fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 10 }),
          (mimetype: string, size: number) => {
            const file = makeFile(mimetype, size);
            expect(() => service.validateFile(file)).toThrow(
              BadRequestException,
            );
          },
        ),
      );
    });

    it('should accept files at the exact 10 MB boundary (size = 10,485,760)', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * The boundary value (exactly 10 MB) is within the allowed range and
       * must not be rejected.
       */
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_MIME_TYPES),
          (mimetype: string) => {
            const file = makeFile(mimetype, MAX_FILE_SIZE);
            expect(() => service.validateFile(file)).not.toThrow();
          },
        ),
      );
    });

    it('should reject files at exactly 1 byte above the 10 MB boundary', () => {
      /**
       * **Validates: Requirements 1.8, 8.4**
       *
       * size = 10,485,761 (MAX + 1) must be rejected even with a valid MIME type.
       */
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_MIME_TYPES),
          (mimetype: string) => {
            const file = makeFile(mimetype, MAX_FILE_SIZE + 1);
            expect(() => service.validateFile(file)).toThrow(
              BadRequestException,
            );
          },
        ),
      );
    });
  });
});
