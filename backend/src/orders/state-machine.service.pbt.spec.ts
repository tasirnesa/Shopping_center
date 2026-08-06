import * as fc from 'fast-check';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import {
  StateMachineService,
  TRANSITIONS,
} from './state-machine.service';

/**
 * Property-Based Tests for StateMachineService
 *
 * Validates: Requirements 1.4, 2.3, 9.1
 */
describe('StateMachineService — Property-Based Tests', () => {
  let service: StateMachineService;

  beforeEach(() => {
    service = new StateMachineService();
  });

  // ---------------------------------------------------------------------------
  // Property 5: Draft Order Submit Transition
  //
  // For any DRAFT order with all required fields, submitting SHALL transition
  // its status to SUBMITTED.
  //
  // Validates: Requirements 1.4, 9.1
  // ---------------------------------------------------------------------------
  describe('Property 5: Draft Order Submit Transition', () => {
    it('should always transition DRAFT → SUBMITTED when submitted by SALES_REP', () => {
      /**
       * The StateMachineService is a pure function: given (DRAFT, "submit", SALES_REP)
       * it must always return SUBMITTED, regardless of any other order data.
       * We use fc.constant() for the fixed inputs but wrap in fc.assert() to
       * document the universal-quantification intent and benefit from fast-check
       * shrinking on any future regression.
       */
      fc.assert(
        fc.property(
          // Arbitrary placeholder representing "any order id" — the state
          // machine is stateless so this just proves the property holds over
          // arbitrary caller contexts.
          fc.uuid(),
          (_orderId: string) => {
            const result = service.transition(
              OrderStatus.DRAFT,
              'submit',
              Role.SALES_REP,
            );
            return result === OrderStatus.SUBMITTED;
          },
        ),
      );
    });

    it('should reject the submit event from DRAFT for any non-SALES_REP role', () => {
      const nonSalesRepRoles = Object.values(Role).filter(
        (r) => r !== Role.SALES_REP,
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...nonSalesRepRoles),
          (role: Role) => {
            expect(() =>
              service.transition(OrderStatus.DRAFT, 'submit', role),
            ).toThrow(ForbiddenException);
          },
        ),
      );
    });

    it('should reject any event other than "submit" or "cancel" from DRAFT status by SALES_REP', () => {
      const validDraftEvents = new Set(['submit', 'cancel']);
      const allKnownEvents = Array.from(
        new Set(
          Object.values(TRANSITIONS).flatMap((eventMap) =>
            Object.keys(eventMap),
          ),
        ),
      ).filter((e) => !validDraftEvents.has(e));

      if (allKnownEvents.length === 0) return; // nothing to test

      fc.assert(
        fc.property(
          fc.constantFrom(...allKnownEvents),
          (event: string) => {
            expect(() =>
              service.transition(OrderStatus.DRAFT, event, Role.SALES_REP),
            ).toThrow(BadRequestException);
          },
        ),
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Property 8: Approval Status Transition Completeness
  //
  // For any SUBMITTED order, when the Invoice Maker approves it, the system
  // SHALL record OrderStatusEvent entries for each intermediate status
  // (WAITING_FOR_INVOICE, INVOICE_APPROVED) and the final status SHALL be
  // WAITING_FOR_WAREHOUSE.
  //
  // The StateMachineService is responsible for:
  //   1. Returning the correct final status (WAITING_FOR_WAREHOUSE)
  //   2. Exposing the correct intermediate statuses via getIntermediates()
  //
  // The audit recording itself is done by the caller (OrdersService), which
  // iterates getIntermediates() to create OrderStatusEvent rows — tested here
  // via the service interface that drives that contract.
  //
  // Validates: Requirements 2.3, 9.1
  // ---------------------------------------------------------------------------
  describe('Property 8: Approval Status Transition Completeness', () => {
    it('should return WAITING_FOR_WAREHOUSE as final status when INVOICE_MAKER approves a SUBMITTED order', () => {
      fc.assert(
        fc.property(
          fc.uuid(), // any order id — state machine is pure
          (_orderId: string) => {
            const result = service.transition(
              OrderStatus.SUBMITTED,
              'approve',
              Role.INVOICE_MAKER,
            );
            return result === OrderStatus.WAITING_FOR_WAREHOUSE;
          },
        ),
      );
    });

    it('should expose exactly [WAITING_FOR_INVOICE, INVOICE_APPROVED] as intermediate statuses for the approve event', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          (_orderId: string) => {
            const intermediates = service.getIntermediates(
              OrderStatus.SUBMITTED,
              'approve',
            );

            // Must contain both intermediate statuses
            const hasWaitingForInvoice = intermediates.includes(
              OrderStatus.WAITING_FOR_INVOICE,
            );
            const hasInvoiceApproved = intermediates.includes(
              OrderStatus.INVOICE_APPROVED,
            );
            // Must be in the correct order: WAITING_FOR_INVOICE before INVOICE_APPROVED
            const correctOrder =
              intermediates.indexOf(OrderStatus.WAITING_FOR_INVOICE) <
              intermediates.indexOf(OrderStatus.INVOICE_APPROVED);

            return hasWaitingForInvoice && hasInvoiceApproved && correctOrder;
          },
        ),
      );
    });

    it('should record all intermediate statuses before the final status (audit trail completeness)', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          (_orderId: string) => {
            const finalStatus = service.transition(
              OrderStatus.SUBMITTED,
              'approve',
              Role.INVOICE_MAKER,
            );
            const intermediates = service.getIntermediates(
              OrderStatus.SUBMITTED,
              'approve',
            );

            // Simulate what OrdersService does: record each intermediate then the final
            const auditTrail: OrderStatus[] = [
              ...intermediates,
              finalStatus,
            ];

            // The audit trail must include all three statuses in sequence
            expect(auditTrail).toEqual([
              OrderStatus.WAITING_FOR_INVOICE,
              OrderStatus.INVOICE_APPROVED,
              OrderStatus.WAITING_FOR_WAREHOUSE,
            ]);
          },
        ),
      );
    });

    it('should reject the approve event for any role other than INVOICE_MAKER', () => {
      const nonInvoiceMakerRoles = Object.values(Role).filter(
        (r) => r !== Role.INVOICE_MAKER,
      );

      fc.assert(
        fc.property(
          fc.constantFrom(...nonInvoiceMakerRoles),
          (role: Role) => {
            expect(() =>
              service.transition(OrderStatus.SUBMITTED, 'approve', role),
            ).toThrow(ForbiddenException);
          },
        ),
      );
    });

    it('should reject any event from SUBMITTED status that is not approve, reject, or cancel', () => {
      const validSubmittedEvents = new Set(['approve', 'reject', 'cancel']);
      const invalidEvents = Array.from(
        new Set(
          Object.values(TRANSITIONS).flatMap((eventMap) =>
            Object.keys(eventMap),
          ),
        ),
      ).filter((e) => !validSubmittedEvents.has(e));

      if (invalidEvents.length === 0) return;

      fc.assert(
        fc.property(
          fc.constantFrom(...invalidEvents),
          fc.constantFrom(...Object.values(Role)),
          (event: string, role: Role) => {
            expect(() =>
              service.transition(OrderStatus.SUBMITTED, event, role),
            ).toThrow(BadRequestException);
          },
        ),
      );
    });
  });
});
