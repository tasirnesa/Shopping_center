/**
 * Property-Based Tests for AuditService
 *
 * Property 21: Audit Event Completeness
 *   For any transition (previousStatus, newStatus, actorId), exactly one
 *   OrderStatusEvent is created with correct fields:
 *     salesOrderId, previousStatus, newStatus, actorId, createdAt
 *
 * Validates: Requirements 9.1, 9.2, 9.4
 */

import * as fc from 'fast-check';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All valid OrderStatus values as a tuple for fc.constantFrom */
const allStatuses = Object.values(OrderStatus) as OrderStatus[];

/** Arbitrary that picks any OrderStatus */
const arbStatus = fc.constantFrom(...allStatuses);

/**
 * Builds a minimal mock Prisma client that captures every call made to
 * orderStatusEvent.create and returns a synthesised record.
 *
 * `calls` is mutated in place so the test can inspect what was passed.
 */
function makeMockPrismaClient(calls: Array<{ data: any; result: any }>) {
  return {
    orderStatusEvent: {
      create: jest.fn().mockImplementation(({ data }: { data: any }) => {
        const result = {
          id: `evt-${calls.length + 1}`,
          salesOrderId: data.salesOrderId,
          previousStatus: data.previousStatus ?? null,
          newStatus: data.newStatus,
          actorId: data.actorId,
          note: data.note ?? null,
          createdAt: new Date(),
        };
        calls.push({ data, result });
        return Promise.resolve(result);
      }),
    },
  };
}

// ---------------------------------------------------------------------------
// Property 21: Audit Event Completeness
// Validates: Requirements 9.1, 9.2, 9.4
// ---------------------------------------------------------------------------

describe(
  'Property 21: Audit Event Completeness — Validates: Requirements 9.1, 9.2, 9.4',
  () => {
    let service: AuditService;

    beforeEach(() => {
      // PrismaService is injected but recordTransition receives the client
      // as its first argument, so the injected instance is never used here.
      service = new AuditService({} as PrismaService);
    });

    // -----------------------------------------------------------------------
    // Core property: exactly one event is created, with all fields correct
    // -----------------------------------------------------------------------
    it(
      'creates exactly one OrderStatusEvent with correct fields for any (salesOrderId, previousStatus, newStatus, actorId)',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uuid(),       // salesOrderId
            arbStatus,       // previousStatus
            arbStatus,       // newStatus
            fc.uuid(),       // actorId
            async (salesOrderId, previousStatus, newStatus, actorId) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              const event = await service.recordTransition(
                mockPrisma as any,
                salesOrderId,
                previousStatus,
                newStatus,
                actorId,
              );

              // Exactly one DB call
              expect(mockPrisma.orderStatusEvent.create).toHaveBeenCalledTimes(1);
              expect(calls).toHaveLength(1);

              // The returned event has the correct fields
              expect(event.salesOrderId).toBe(salesOrderId);
              expect(event.previousStatus).toBe(previousStatus);
              expect(event.newStatus).toBe(newStatus);
              expect(event.actorId).toBe(actorId);

              // createdAt is set (non-null Date)
              expect(event.createdAt).toBeInstanceOf(Date);

              // The data passed to prisma matches what was provided
              const passedData = calls[0].data;
              expect(passedData.salesOrderId).toBe(salesOrderId);
              expect(passedData.previousStatus).toBe(previousStatus);
              expect(passedData.newStatus).toBe(newStatus);
              expect(passedData.actorId).toBe(actorId);
            },
          ),
          { numRuns: 300 },
        );
      },
    );

    // -----------------------------------------------------------------------
    // previousStatus = null is valid (first-ever transition, no prior status)
    // -----------------------------------------------------------------------
    it(
      'creates exactly one event when previousStatus is null (initial creation)',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uuid(),   // salesOrderId
            arbStatus,   // newStatus
            fc.uuid(),   // actorId
            async (salesOrderId, newStatus, actorId) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              const event = await service.recordTransition(
                mockPrisma as any,
                salesOrderId,
                null,       // no previous status
                newStatus,
                actorId,
              );

              expect(calls).toHaveLength(1);
              expect(event.previousStatus).toBeNull();
              expect(event.newStatus).toBe(newStatus);
              expect(event.salesOrderId).toBe(salesOrderId);
              expect(event.actorId).toBe(actorId);
            },
          ),
          { numRuns: 200 },
        );
      },
    );

    // -----------------------------------------------------------------------
    // Optional note field is forwarded verbatim when supplied
    // -----------------------------------------------------------------------
    it(
      'forwards the optional note field verbatim when provided',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uuid(),                          // salesOrderId
            arbStatus,                          // previousStatus
            arbStatus,                          // newStatus
            fc.uuid(),                          // actorId
            fc.string({ minLength: 1, maxLength: 200 }), // note
            async (salesOrderId, previousStatus, newStatus, actorId, note) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              const event = await service.recordTransition(
                mockPrisma as any,
                salesOrderId,
                previousStatus,
                newStatus,
                actorId,
                note,
              );

              expect(calls).toHaveLength(1);
              expect(calls[0].data.note).toBe(note);
              expect(event.note).toBe(note);
            },
          ),
          { numRuns: 200 },
        );
      },
    );

    // -----------------------------------------------------------------------
    // note field is absent (undefined) when not supplied
    // -----------------------------------------------------------------------
    it(
      'does not set the note field when it is not provided',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uuid(),
            arbStatus,
            arbStatus,
            fc.uuid(),
            async (salesOrderId, previousStatus, newStatus, actorId) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              await service.recordTransition(
                mockPrisma as any,
                salesOrderId,
                previousStatus,
                newStatus,
                actorId,
                // note intentionally omitted
              );

              expect(calls).toHaveLength(1);
              // note should be undefined (not supplied) or null
              const passedNote = calls[0].data.note;
              expect(passedNote == null).toBe(true);
            },
          ),
          { numRuns: 150 },
        );
      },
    );

    // -----------------------------------------------------------------------
    // Idempotency / independence: multiple calls produce independent events
    // (the service MUST NOT coalesce or deduplicate calls)
    // -----------------------------------------------------------------------
    it(
      'produces N independent events for N sequential calls (append-only guarantee)',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.integer({ min: 2, max: 10 }),  // number of transitions
            fc.uuid(),                         // shared salesOrderId
            fc.uuid(),                         // shared actorId
            async (n, salesOrderId, actorId) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              // Pick n distinct (prev, next) status pairs
              const statusPairs: Array<[OrderStatus | null, OrderStatus]> = [];
              for (let i = 0; i < n; i++) {
                statusPairs.push([
                  i === 0 ? null : allStatuses[i % allStatuses.length],
                  allStatuses[(i + 1) % allStatuses.length],
                ]);
              }

              for (const [prev, next] of statusPairs) {
                await service.recordTransition(
                  mockPrisma as any,
                  salesOrderId,
                  prev,
                  next,
                  actorId,
                );
              }

              // Exactly n DB inserts — no deduplication
              expect(calls).toHaveLength(n);
              expect(
                mockPrisma.orderStatusEvent.create,
              ).toHaveBeenCalledTimes(n);

              // Each event carries its own (prev, next) pair
              for (let i = 0; i < n; i++) {
                expect(calls[i].data.previousStatus ?? null).toBe(
                  statusPairs[i][0],
                );
                expect(calls[i].data.newStatus).toBe(statusPairs[i][1]);
              }
            },
          ),
          { numRuns: 150 },
        );
      },
    );

    // -----------------------------------------------------------------------
    // Return value matches the persisted record
    // -----------------------------------------------------------------------
    it(
      'returns the object that was persisted (return value equals the created record)',
      async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.uuid(),
            arbStatus,
            arbStatus,
            fc.uuid(),
            async (salesOrderId, previousStatus, newStatus, actorId) => {
              const calls: Array<{ data: any; result: any }> = [];
              const mockPrisma = makeMockPrismaClient(calls);

              const returned = await service.recordTransition(
                mockPrisma as any,
                salesOrderId,
                previousStatus,
                newStatus,
                actorId,
              );

              // The returned value should be exactly what prisma.create resolved with
              expect(returned).toBe(calls[0].result);
            },
          ),
          { numRuns: 200 },
        );
      },
    );
  },
);
