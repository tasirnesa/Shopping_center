/**
 * Property-Based Tests for CreateOrderDto validation
 *
 * Property 1: Sales Order Required Field Validation
 *   Any DTO missing a mandatory field is rejected with a validation error
 *   listing that field.
 *
 * Property 3: Sales Order Quantity Positivity
 *   Any line with quantity ≤ 0 is rejected.
 *
 * Validates: Requirements 1.1, 1.5, 1.6
 */

import 'reflect-metadata';
import * as fc from 'fast-check';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto, CreateOrderLineDto } from './create-order.dto';

// ---------------------------------------------------------------------------
// Helpers / generators
// ---------------------------------------------------------------------------

/** A valid line object that passes all constraints. */
const validLine = () => ({
  productId: 'product-uuid-1234',
  quantity: 1,
  unitPrice: 10,
  discount: 0,
});

/** Arbitrary that generates a non-empty string (≥ 1 char). */
const nonEmptyString = fc.string({ minLength: 1, maxLength: 80 });

/** Arbitrary that produces a fully valid CreateOrderDto plain object. */
const validOrderArb = fc.record({
  customerName: nonEmptyString,
  tin: nonEmptyString,
  deliveryAddress: nonEmptyString,
  branchId: nonEmptyString,
  customerPhone: fc.option(nonEmptyString, { nil: undefined }),
  paymentMethod: fc.constantFrom('CASH', 'CHEQUE', 'CREDIT', 'CARD', 'TRANSFER'),
  lines: fc.array(
    fc.record({
      productId: nonEmptyString,
      quantity: fc.integer({ min: 1, max: 1000 }),
      unitPrice: fc.float({ min: 0, max: 100_000, noNaN: true }),
      discount: fc.option(
        fc.float({ min: 0, max: 10_000, noNaN: true }),
        { nil: undefined },
      ),
    }),
    { minLength: 1, maxLength: 10 },
  ),
});

/** Validate a plain object against CreateOrderDto and return the errors array. */
async function validateDto(plain: object) {
  const instance = plainToInstance(CreateOrderDto, plain);
  return validate(instance, { whitelist: true });
}

async function validateLineDto(plain: object) {
  const instance = plainToInstance(CreateOrderLineDto, plain);
  return validate(instance, { whitelist: true });
}

// ---------------------------------------------------------------------------
// Property 1 — Required Field Validation
// Validates: Requirements 1.1, 1.5
// ---------------------------------------------------------------------------

describe('Property 1: Sales Order Required Field Validation — Validates: Requirements 1.1, 1.5', () => {

  it('accepts a fully valid DTO without errors', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const errors = await validateDto(order);
        expect(errors).toHaveLength(0);
      }),
      { numRuns: 100 },
    );
  });

  it('rejects a DTO when customerName is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { customerName: _omitted, ...withoutField } = order;
        const errors = await validateDto(withoutField);
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('customerName');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when customerName is empty string', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const errors = await validateDto({ ...order, customerName: '' });
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('customerName');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when tin is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { tin: _omitted, ...withoutField } = order;
        const errors = await validateDto(withoutField);
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('tin');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when tin is empty string', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const errors = await validateDto({ ...order, tin: '' });
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('tin');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when deliveryAddress is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { deliveryAddress: _omitted, ...withoutField } = order;
        const errors = await validateDto(withoutField);
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('deliveryAddress');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when deliveryAddress is empty string', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const errors = await validateDto({ ...order, deliveryAddress: '' });
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('deliveryAddress');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when branchId is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { branchId: _omitted, ...withoutField } = order;
        const errors = await validateDto(withoutField);
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('branchId');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when lines array is empty', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const errors = await validateDto({ ...order, lines: [] });
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('lines');
      }),
      { numRuns: 50 },
    );
  });

  it('rejects a DTO when lines is missing', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { lines: _omitted, ...withoutField } = order;
        const errors = await validateDto(withoutField);
        const fieldNames = errors.map((e) => e.property);
        expect(fieldNames).toContain('lines');
      }),
      { numRuns: 50 },
    );
  });

  it('does not report an error for the optional customerPhone field when absent', async () => {
    await fc.assert(
      fc.asyncProperty(validOrderArb, async (order) => {
        const { customerPhone: _omitted, ...withoutPhone } = order;
        const errors = await validateDto({ ...withoutPhone, customerPhone: undefined });
        // Errors must NOT be due to customerPhone being absent
        const phoneErrors = errors.filter((e) => e.property === 'customerPhone');
        expect(phoneErrors).toHaveLength(0);
      }),
      { numRuns: 50 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3 — Sales Order Quantity Positivity
// Validates: Requirements 1.6
// ---------------------------------------------------------------------------

describe('Property 3: Sales Order Quantity Positivity — Validates: Requirements 1.6', () => {

  it('rejects a line when quantity is 0', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          productId: nonEmptyString,
          unitPrice: fc.float({ min: 0, max: 100_000, noNaN: true }),
          discount: fc.option(fc.float({ min: 0, max: 10_000, noNaN: true }), { nil: undefined }),
        }),
        async (lineBase) => {
          const errors = await validateLineDto({ ...lineBase, quantity: 0 });
          const fieldNames = errors.map((e) => e.property);
          expect(fieldNames).toContain('quantity');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('rejects a line when quantity is negative', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          productId: nonEmptyString,
          unitPrice: fc.float({ min: 0, max: 100_000, noNaN: true }),
          discount: fc.option(fc.float({ min: 0, max: 10_000, noNaN: true }), { nil: undefined }),
        }),
        // Generate strictly negative integers
        fc.integer({ min: -10_000, max: -1 }),
        async (lineBase, negativeQty) => {
          const errors = await validateLineDto({ ...lineBase, quantity: negativeQty });
          const fieldNames = errors.map((e) => e.property);
          expect(fieldNames).toContain('quantity');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('accepts a line when quantity is a positive integer', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10_000 }),
        async (quantity) => {
          const errors = await validateLineDto({
            ...validLine(),
            quantity,
          });
          const qtyErrors = errors.filter((e) => e.property === 'quantity');
          expect(qtyErrors).toHaveLength(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('rejects the parent order DTO when any line has quantity ≤ 0', async () => {
    await fc.assert(
      fc.asyncProperty(
        validOrderArb,
        fc.integer({ min: -100, max: 0 }),
        async (order, badQty) => {
          // Replace the first line's quantity with an invalid value
          const badLines = [
            { ...order.lines[0], quantity: badQty },
            ...order.lines.slice(1),
          ];
          const errors = await validateDto({ ...order, lines: badLines });
          // There should be nested validation errors on 'lines'
          expect(errors.length).toBeGreaterThan(0);
          const linesError = errors.find((e) => e.property === 'lines');
          expect(linesError).toBeDefined();
        },
      ),
      { numRuns: 100 },
    );
  });
});
