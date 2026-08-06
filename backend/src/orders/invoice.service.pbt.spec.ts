/**
 * Property-Based Tests for InvoiceService arithmetic
 *
 * Property 6: Invoice Arithmetic Invariant
 *   For any approved SalesOrder with subtotal S and taxRate R (0 ≤ R ≤ 100),
 *   the generated Invoice SHALL satisfy:
 *     taxAmount  = S × (R / 100)
 *     grandTotal = S + taxAmount
 *
 * Validates: Requirements 2.2
 */

import * as fc from 'fast-check';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../prisma/prisma.service';

// ---------------------------------------------------------------------------
// Minimal mock prisma client
//
// generateInvoice calls: invoiceSequence.upsert, invoiceSequence.update,
// and invoice.create.  We only care about the data passed to invoice.create,
// so we capture it and return a minimal stub.
// ---------------------------------------------------------------------------
function makeMockPrismaClient(capturedData: { data?: any }) {
  return {
    invoiceSequence: {
      upsert: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({ lastNumber: 1 }),
    },
    invoice: {
      create: jest.fn().mockImplementation(({ data }: { data: any }) => {
        capturedData.data = data;
        return Promise.resolve({
          ...data,
          id: 'mock-invoice-id',
          lines: [],
        });
      }),
    },
  };
}

/** Builds a minimal SalesOrder stub with the given subtotal and taxRate. */
function makeSalesOrder(subtotal: number, taxRate: number) {
  return {
    id: 'order-id-001',
    subtotal,
    taxRate,
    lines: [],
  };
}

// ---------------------------------------------------------------------------
// Property 6: Invoice Arithmetic Invariant
// Validates: Requirements 2.2
// ---------------------------------------------------------------------------

describe(
  'Property 6: Invoice Arithmetic Invariant — Validates: Requirements 2.2',
  () => {
    let service: InvoiceService;

    beforeEach(() => {
      // PrismaService is injected but generateInvoice receives the client
      // as its first argument, so the injected instance is never used here.
      service = new InvoiceService({} as PrismaService);
    });

    it('taxAmount = subtotal × (taxRate / 100) for any subtotal ≥ 0 and 0 ≤ taxRate ≤ 100', async () => {
      await fc.assert(
        fc.asyncProperty(
          // subtotal: any non-negative float (up to 1,000,000 for realism)
          fc.float({ min: 0, max: 1_000_000, noNaN: true }),
          // taxRate: any value in [0, 100]
          fc.float({ min: 0, max: 100, noNaN: true }),
          async (subtotal, taxRate) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(subtotal, taxRate);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            const expectedTaxAmount = subtotal * (taxRate / 100);

            // Use a relative tolerance to handle floating-point representation
            // (same precision JavaScript multiplication produces).
            expect(taxAmount).toBeCloseTo(expectedTaxAmount, 10);
          },
        ),
        { numRuns: 200 },
      );
    });

    it('grandTotal = subtotal + taxAmount for any subtotal ≥ 0 and 0 ≤ taxRate ≤ 100', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 1_000_000, noNaN: true }),
          fc.float({ min: 0, max: 100, noNaN: true }),
          async (subtotal, taxRate) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(subtotal, taxRate);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount, grandTotal } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            const expectedGrandTotal = subtotal + taxAmount;

            expect(grandTotal).toBeCloseTo(expectedGrandTotal, 10);
          },
        ),
        { numRuns: 200 },
      );
    });

    it('both invariants hold simultaneously for any (subtotal, taxRate) pair', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 1_000_000, noNaN: true }),
          fc.float({ min: 0, max: 100, noNaN: true }),
          async (subtotal, taxRate) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(subtotal, taxRate);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount, grandTotal } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            const expectedTaxAmount = subtotal * (taxRate / 100);
            const expectedGrandTotal = subtotal + expectedTaxAmount;

            // taxAmount invariant
            expect(taxAmount).toBeCloseTo(expectedTaxAmount, 10);
            // grandTotal invariant (derived from persisted taxAmount, not re-derived)
            expect(grandTotal).toBeCloseTo(expectedGrandTotal, 10);
          },
        ),
        { numRuns: 500 },
      );
    });

    it('holds at boundary: subtotal = 0 produces taxAmount = 0 and grandTotal = 0', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 100, noNaN: true }), // any valid taxRate
          async (taxRate) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(0, taxRate);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount, grandTotal } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            expect(taxAmount).toBe(0);
            expect(grandTotal).toBe(0);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('holds at boundary: taxRate = 0 produces taxAmount = 0 and grandTotal = subtotal', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 1_000_000, noNaN: true }), // any valid subtotal
          async (subtotal) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(subtotal, 0);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount, grandTotal } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            expect(taxAmount).toBe(0);
            expect(grandTotal).toBeCloseTo(subtotal, 10);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('holds at boundary: taxRate = 100 produces taxAmount = subtotal and grandTotal = 2 × subtotal', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 1_000_000, noNaN: true }), // any valid subtotal
          async (subtotal) => {
            const capturedData: { data?: any } = {};
            const mockPrisma = makeMockPrismaClient(capturedData);
            const salesOrder = makeSalesOrder(subtotal, 100);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            const { taxAmount, grandTotal } = capturedData.data as {
              taxAmount: number;
              grandTotal: number;
            };

            expect(taxAmount).toBeCloseTo(subtotal, 10);
            expect(grandTotal).toBeCloseTo(subtotal * 2, 10);
          },
        ),
        { numRuns: 100 },
      );
    });
  },
);

// ---------------------------------------------------------------------------
// Property 7: Invoice Number Sequential Monotonicity
//
// For any sequence of invoice generations within the same org, the assigned
// invoice numbers SHALL be strictly increasing integers with no gaps
// (e.g. INV-0001, INV-0002, INV-0003, …).
//
// Validates: Requirements 2.2
// ---------------------------------------------------------------------------

/**
 * Builds a mock prisma client whose `invoiceSequence.update` simulates
 * the real atomic increment by returning a counter that starts at
 * `startFrom` and increments by 1 on every call.
 *
 * All generated invoice numbers are appended to `generatedNumbers`.
 */
function makeSequentialMockPrismaClient(
  startFrom: number,
  generatedNumbers: string[],
) {
  let counter = startFrom;

  return {
    invoiceSequence: {
      upsert: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockImplementation(() => {
        counter += 1;
        return Promise.resolve({ lastNumber: counter });
      }),
    },
    invoice: {
      create: jest.fn().mockImplementation(({ data }: { data: any }) => {
        generatedNumbers.push(data.invoiceNumber as string);
        return Promise.resolve({
          ...data,
          id: `mock-invoice-id-${counter}`,
          lines: [],
        });
      }),
    },
  };
}

describe(
  'Property 7: Invoice Number Sequential Monotonicity — Validates: Requirements 2.2',
  () => {
    let service: InvoiceService;

    beforeEach(() => {
      service = new InvoiceService({} as PrismaService);
    });

    it(
      'invoice numbers are strictly increasing with no gaps for any sequence of N generations within the same org',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            // Number of sequential invoices to generate: between 2 and 20
            fc.integer({ min: 2, max: 20 }),
            // Starting sequence value: any non-negative integer (simulates a pre-existing sequence)
            fc.integer({ min: 0, max: 9990 }),
            async (count, startFrom) => {
              const generatedNumbers: string[] = [];
              const mockPrisma = makeSequentialMockPrismaClient(
                startFrom,
                generatedNumbers,
              );

              const salesOrder = makeSalesOrder(100, 15);

              // Generate `count` invoices sequentially against the same mock client
              for (let i = 0; i < count; i++) {
                await service.generateInvoice(
                  mockPrisma as any,
                  { ...salesOrder, id: `order-id-${i}` },
                  'invoice-maker-id',
                  'org-id-001',
                );
              }

              // We should have exactly `count` invoice numbers
              expect(generatedNumbers).toHaveLength(count);

              // Extract the numeric portions from each "INV-XXXX" string
              const numericParts = generatedNumbers.map((inv) => {
                const match = inv.match(/^INV-(\d+)$/);
                expect(match).not.toBeNull(); // format must be INV-XXXX
                return parseInt(match![1], 10);
              });

              // Strictly increasing: each number must be exactly 1 more than the previous
              for (let i = 1; i < numericParts.length; i++) {
                expect(numericParts[i]).toBe(numericParts[i - 1] + 1);
              }

              // No gaps: first number must be startFrom + 1, last must be startFrom + count
              expect(numericParts[0]).toBe(startFrom + 1);
              expect(numericParts[numericParts.length - 1]).toBe(
                startFrom + count,
              );
            },
          ),
          { numRuns: 200 },
        );
      },
    );

    it('invoice numbers across different orgs are independent (each org starts its own sequence)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 10 }), // invoices for org A
          fc.integer({ min: 1, max: 10 }), // invoices for org B
          async (countA, countB) => {
            const generatedA: string[] = [];
            const generatedB: string[] = [];

            // Each org gets its own independent mock client (separate counter)
            const mockPrismaA = makeSequentialMockPrismaClient(0, generatedA);
            const mockPrismaB = makeSequentialMockPrismaClient(0, generatedB);

            const salesOrder = makeSalesOrder(200, 10);

            for (let i = 0; i < countA; i++) {
              await service.generateInvoice(
                mockPrismaA as any,
                { ...salesOrder, id: `order-a-${i}` },
                'invoice-maker-id',
                'org-A',
              );
            }

            for (let i = 0; i < countB; i++) {
              await service.generateInvoice(
                mockPrismaB as any,
                { ...salesOrder, id: `order-b-${i}` },
                'invoice-maker-id',
                'org-B',
              );
            }

            // Each org's sequence starts at 1 independently
            const numericA = generatedA.map((inv) =>
              parseInt(inv.match(/^INV-(\d+)$/)![1], 10),
            );
            const numericB = generatedB.map((inv) =>
              parseInt(inv.match(/^INV-(\d+)$/)![1], 10),
            );

            // Org A: 1..countA with no gaps
            numericA.forEach((n, idx) => expect(n).toBe(idx + 1));
            // Org B: 1..countB with no gaps
            numericB.forEach((n, idx) => expect(n).toBe(idx + 1));
          },
        ),
        { numRuns: 150 },
      );
    });

    it('single invoice generation always produces INV-0001 when sequence starts at 0', async () => {
      const generatedNumbers: string[] = [];
      const mockPrisma = makeSequentialMockPrismaClient(0, generatedNumbers);
      const salesOrder = makeSalesOrder(500, 5);

      await service.generateInvoice(
        mockPrisma as any,
        salesOrder,
        'invoice-maker-id',
        'org-id-001',
      );

      expect(generatedNumbers).toHaveLength(1);
      expect(generatedNumbers[0]).toBe('INV-0001');
    });

    it('invoice number format is always INV-XXXX (zero-padded to at least 4 digits) for any sequence number', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Sequence numbers from 1 to 9999 (4-digit range)
          fc.integer({ min: 1, max: 9999 }),
          async (seqNum) => {
            const generatedNumbers: string[] = [];
            // Start counter at seqNum - 1 so the first increment yields seqNum
            const mockPrisma = makeSequentialMockPrismaClient(
              seqNum - 1,
              generatedNumbers,
            );
            const salesOrder = makeSalesOrder(100, 10);

            await service.generateInvoice(
              mockPrisma as any,
              salesOrder,
              'invoice-maker-id',
              'org-id-001',
            );

            expect(generatedNumbers).toHaveLength(1);
            const invoiceNumber = generatedNumbers[0];

            // Must match INV-XXXX format with correct numeric value
            const match = invoiceNumber.match(/^INV-(\d{4,})$/);
            expect(match).not.toBeNull();
            expect(parseInt(match![1], 10)).toBe(seqNum);
          },
        ),
        { numRuns: 200 },
      );
    });
  },
);
