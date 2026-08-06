# Implementation Plan: Order Fulfillment Workflow

## Overview

Implement the multi-stage order fulfillment pipeline on top of the existing NestJS / Prisma backend and React Native / Expo mobile app. The work is divided into: schema migration, backend `orders` module (state machine, invoice, warehouse, delivery, audit, notification services), REST API endpoints, mobile screens per role, and a role-scoped dashboard extension.

All backend code goes under `backend/src/orders/`. All mobile screens go under `mobile/src/app/(app)/(fulfillment)/`. Tests follow the existing Jest convention — unit tests in `*.spec.ts`, property-based tests in `*.pbt.spec.ts`.

---

## Tasks

- [x] 1. Extend Prisma schema and run migration
  - [x] 1.1 Add new roles and enums to schema
    - Add `SALES_REP`, `INVOICE_MAKER`, `STORE_MAN`, `DRIVER` values to the `Role` enum in `backend/prisma/schema.prisma`
    - Add `OrderStatus`, `AttachmentType`, `DeliveryStatus` enums
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 1.2 Add new Prisma models
    - Add `SalesOrder`, `SalesOrderLine`, `Attachment`, `Invoice`, `InvoiceLine`, `PickingList`, `PickingListLine`, `Delivery`, `OrderStatusEvent`, `Notification`, `InvoiceSequence` models exactly as specified in the design
    - Add the necessary back-relations on existing `User`, `Organization`, `Branch`, `Product`, `Customer` models
    - _Requirements: 1.1, 2.4, 3.1, 4.1, 4.5, 9.1_

  - [x] 1.3 Generate and apply migration
    - Run `npx prisma migrate dev --name order-fulfillment` to create and apply the migration
    - Regenerate the Prisma client with `npx prisma generate`
    - _Requirements: 1.1, 1.2_

- [x] 2. Implement the orders backend module skeleton
  - [x] 2.1 Create module, controller, and service scaffolding
    - Create `src/orders/orders.module.ts`, `orders.controller.ts`, `orders.service.ts`
    - Register `OrdersModule` in `AppModule`
    - _Requirements: 1.1, 6.6_

  - [x] 2.2 Implement `StateMachineService`
    - Create `src/orders/state-machine.service.ts`
    - Implement the complete `TRANSITIONS` map covering all rows in the Allowed Transitions Table
    - Implement `transition(currentStatus, event, role)` — throws `BadRequestException` for invalid events, `ForbiddenException` for wrong roles, returns target `OrderStatus` otherwise
    - _Requirements: 1.4, 2.3, 2.5, 3.2, 3.3, 3.6, 4.2, 4.3, 5.1, 5.2_

  - [x] 2.3 Write property test for StateMachineService
    - Create `src/orders/state-machine.service.pbt.spec.ts`
    - **Property 5: Draft Order Submit Transition** — for any DRAFT order with all required fields, submitting SHALL transition to SUBMITTED
    - **Property 8: Approval Status Transition Completeness** — approval records intermediate statuses and lands at WAITING_FOR_WAREHOUSE
    - **Validates: Requirements 1.4, 2.3, 9.1**

  - [x] 2.4 Implement `AuditService`
    - Create `src/orders/audit.service.ts`
    - Implement `recordTransition(prisma, salesOrderId, previousStatus, newStatus, actorId, note?)` using an append-only insert into `OrderStatusEvent`
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

  - [x] 2.5 Write property test for AuditService
    - Create `src/orders/audit.service.pbt.spec.ts`
    - **Property 21: Audit Event Completeness** — for any transition, exactly one `OrderStatusEvent` is created with correct fields
    - **Validates: Requirements 9.1, 9.2, 9.4**

- [ ] 3. Implement Sales Order creation and submission (Sales Rep)
  - [x] 3.1 Create Sales Order DTOs
    - Create `src/orders/dto/create-order.dto.ts` with `class-validator` decorators for all mandatory fields (`customerName`, `tin`, `deliveryAddress`, lines array)
    - Create `src/orders/dto/update-order.dto.ts` (partial update, DRAFT only)
    - Create `src/orders/dto/submit-order.dto.ts`
    - _Requirements: 1.1, 1.3, 1.5, 1.6_

  - [x] 3.2 Write property test for Sales Order DTO validation
    - Create `src/orders/dto/create-order.dto.pbt.spec.ts`
    - **Property 1: Sales Order Required Field Validation** — any DTO missing a mandatory field is rejected with a validation error listing that field
    - **Property 3: Sales Order Quantity Positivity** — any line with `quantity ≤ 0` is rejected
    - **Validates: Requirements 1.1, 1.5, 1.6**

  - [x] 3.3 Implement order line total computation
    - Create `src/orders/orders.service.ts` helper `computeLineTotal(unitPrice, quantity, discount): number`
    - Ensure subtotal, taxAmount, grandTotal are computed and persisted on `SalesOrder`
    - _Requirements: 1.3_

  - [x] 3.4 Write property test for line total invariant
    - Create `src/orders/orders.service.pbt.spec.ts`
    - **Property 2: Sales Order Line Total Invariant** — `total = (unitPrice × quantity) − discount` for any `unitPrice ≥ 0`, `quantity > 0`, `discount ≥ 0`
    - **Validates: Requirements 1.3**

  - [ ] 3.5 Implement `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id`
    - Apply `@Roles(Role.SALES_REP)` and `@OrderOwner()` guard on mutating endpoints
    - `GET /orders` for SALES_REP returns orders filtered by `salesRepId = user.id`, sorted by `createdAt DESC`
    - _Requirements: 1.1, 1.2, 1.7, 1.10_

  - [~] 3.6 Write property test for orders list sort order
    - **Property 22: Orders List Sort Order** — for any set of orders, `GET /orders` returns them sorted by `createdAt` descending
    - **Validates: Requirements 1.10**

  - [~] 3.7 Implement `POST /orders/:id/submit`
    - Validate all mandatory fields and attachments before transitioning via `StateMachineService`
    - Record audit event via `AuditService`
    - _Requirements: 1.4, 1.5, 2.6, 2.7_

- [ ] 4. Implement file upload and attachment handling
  - [x] 4.1 Implement `FileUploadService`
    - Create `src/orders/file-upload.service.ts`
    - Implement `validateFile(file)` — checks MIME type against `{application/pdf, image/jpeg, image/png}` and size `≤ 10,485,760` bytes; throws `BadRequestException` otherwise
    - Implement `store(file, subPath)` — writes to `uploads/{orgId}/{orderId}/{type}_{ts}_{filename}` and returns the stored path
    - _Requirements: 1.8, 8.4_

  - [-] 4.2 Write property test for attachment file validation
    - Create `src/orders/file-upload.service.pbt.spec.ts`
    - **Property 4: Attachment File Validation** — any file with valid MIME type AND size ≤ 10 MB is accepted; any file failing either condition is rejected
    - **Validates: Requirements 1.8, 8.4**

  - [-] 4.3 Implement `POST /orders/:id/attachments` and `GET /orders/:id/attachments/:attachmentId`
    - Use NestJS Multer interceptor for multipart upload
    - Store path in `Attachment` record; stream file back on GET
    - Apply role guards (all permitted roles can download)
    - _Requirements: 1.9, 8.4_

- [~] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Invoice Verification and Generation (Invoice Maker)
  - [x] 6.1 Create Invoice DTOs and `InvoiceService`
    - Create `src/orders/dto/reject-order.dto.ts` with `@MinLength(10)` on `reason`
    - Create `src/orders/invoice.service.ts`
    - Implement `generateInvoice(prisma, salesOrder, invoiceMakerId)` — atomically increments `InvoiceSequence.lastNumber`, formats `INV-XXXX`, creates `Invoice` + `InvoiceLine` records, computes `taxAmount = subtotal × (taxRate / 100)`, `grandTotal = subtotal + taxAmount`
    - _Requirements: 2.2, 2.4, 2.8, 2.10_

  - [-] 6.2 Write property test for Invoice arithmetic invariant
    - Create `src/orders/invoice.service.pbt.spec.ts`
    - **Property 6: Invoice Arithmetic Invariant** — `taxAmount = subtotal × (taxRate / 100)` and `grandTotal = subtotal + taxAmount` for any `subtotal ≥ 0`, `0 ≤ taxRate ≤ 100`
    - **Validates: Requirements 2.2**

  - [-] 6.3 Write property test for Invoice number sequential monotonicity
    - **Property 7: Invoice Number Sequential Monotonicity** — for any sequence of invoice generations within the same org, invoice numbers are strictly increasing with no gaps
    - **Validates: Requirements 2.2**

  - [-] 6.4 Implement `POST /orders/:id/approve` and `POST /orders/:id/reject`
    - `approve`: validates Trade License and Payment Receipt attachments present, calls `InvoiceService.generateInvoice`, drives state machine through intermediate statuses (`WAITING_FOR_INVOICE` → `INVOICE_APPROVED` → `WAITING_FOR_WAREHOUSE`), records each intermediate `OrderStatusEvent` in a `prisma.$transaction`
    - `reject`: validates rejection reason min length 10, transitions to `REJECTED`, records audit event
    - Apply `@Roles(Role.INVOICE_MAKER)`
    - _Requirements: 2.1, 2.3, 2.5, 2.6, 2.7, 2.9_

  - [~] 6.5 Write property test for approval status transition completeness
    - **Property 8: Approval Status Transition Completeness** — for any SUBMITTED order, approve records WAITING_FOR_INVOICE, INVOICE_APPROVED audit events and final status is WAITING_FOR_WAREHOUSE
    - **Validates: Requirements 2.3, 9.1**

  - [~] 6.6 Write property test for rejection reason minimum length
    - **Property 23: Rejection Reason Minimum Length** — rejection with reason < 10 chars is rejected; ≥ 10 chars succeeds
    - **Validates: Requirements 2.5**

  - [~] 6.7 Implement `GET /invoices/:id` and `GET /invoices/:id/pdf`
    - Fetch invoice with lines; generate PDF via a lightweight library (e.g. `pdfkit`) for the `/pdf` endpoint with `Content-Type: application/pdf`
    - Apply `@Roles(Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER)`
    - _Requirements: 2.1, 2.4, 3.1_

- [ ] 7. Implement Warehouse Picking and Packing (Store Man)
  - [-] 7.1 Implement `WarehouseService`
    - Create `src/orders/warehouse.service.ts`
    - Implement `createPickingList(prisma, salesOrder)` — creates `PickingList` + `PickingListLine` records from order lines
    - Implement `confirmPicking(prisma, salesOrderId, actorId)` — checks each line's `StockBalance`, throws structured `INSUFFICIENT_STOCK` error (listing product + available quantity) if any would go negative, otherwise deducts stock and creates `InventoryTransaction` (type `OUT`) for each line, all inside `prisma.$transaction`
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 9.3_

  - [~] 7.2 Write property test for stock deduction round-trip
    - Create `src/orders/warehouse.service.pbt.spec.ts`
    - **Property 9: Stock Deduction Round-Trip on Packing** — after confirm-picking, each `StockBalance` decreases by exactly `quantity_i` and exactly N `InventoryTransaction OUT` records exist
    - **Validates: Requirements 3.3, 3.4, 9.3**

  - [~] 7.3 Write property test for insufficient stock blocking
    - **Property 10: Insufficient Stock Blocks Packing** — if any line quantity exceeds current `StockBalance`, confirm-picking is rejected and `StockBalance` remains unchanged
    - **Validates: Requirements 3.5**

  - [~] 7.4 Implement `POST /orders/:id/start-picking` and `POST /orders/:id/confirm-picking`
    - `start-picking`: transitions `WAITING_FOR_WAREHOUSE → PICKING`, creates `PickingList` via `WarehouseService`
    - `confirm-picking`: calls `WarehouseService.confirmPicking`, transitions `PICKING → PACKED → READY_FOR_DELIVERY`, records audit events
    - Apply `@Roles(Role.STORE_MAN)`
    - _Requirements: 3.2, 3.3, 3.5, 3.6_

  - [~] 7.5 Implement barcode scan endpoint and picking list endpoints
    - `POST /orders/:id/picking-list/scan` — match barcode against `PickingListLine.product.barcode`; if match, set `picked = true`; if no match, return error
    - `GET /orders/:id/picking-list` — returns picking list with lines and picked status
    - `GET /orders/:id/picking-list/pdf` and `GET /orders/:id/delivery-note/pdf` — generate PDFs
    - _Requirements: 3.1, 3.7, 3.8, 3.10_

  - [~] 7.6 Write property test for barcode scan picking confirmation
    - **Property 11: Barcode Scan Picking Confirmation** — matching barcode marks line as picked; non-matching barcode returns error and picking list is unchanged
    - **Validates: Requirements 3.10**

- [ ] 8. Implement Delivery Execution (Driver)
  - [x] 8.1 Implement `DeliveryService`
    - Create `src/orders/delivery.service.ts`
    - Implement `createDelivery(prisma, salesOrder, invoiceId)` — creates `Delivery` record with `salesOrderId`, `invoiceId`, `customerName`, `deliveryAddress`, `customerPhone`, status `PENDING`
    - Implement `confirmDelivery(prisma, deliveryId, driverId, confirmationPath)` — sets `confirmationPath`, transitions to `DELIVERED`, records `confirmedAt` and `confirmedById`
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.8, 9.4_

  - [~] 8.2 Write property test for delivery record field completeness
    - Create `src/orders/delivery.service.pbt.spec.ts`
    - **Property 12: Delivery Record Field Completeness** — for any order transitioning to READY_FOR_DELIVERY, Delivery record has non-null `salesOrderId`, `invoiceId`, `customerName`, `deliveryAddress`
    - **Validates: Requirements 4.1, 4.5**

  - [~] 8.3 Write property test for delivery confirmation requires upload
    - **Property 13: Delivery Confirmation Requires Upload** — confirm-delivery without a file upload returns validation error and Delivery status is unchanged
    - **Validates: Requirements 4.8**

  - [-] 8.4 Implement `GET /deliveries`, `GET /deliveries/:id`, `POST /deliveries/:id/pickup`, `POST /deliveries/:id/confirm`
    - `GET /deliveries` for DRIVER filters by `driverId = user.id`
    - `POST /deliveries/:id/pickup` transitions Delivery to `OUT_FOR_DELIVERY`, transitions SalesOrder to `OUT_FOR_DELIVERY`
    - `POST /deliveries/:id/confirm` requires file upload, calls `DeliveryService.confirmDelivery`, transitions SalesOrder to `DELIVERED → COMPLETED`
    - Apply `@Roles(Role.DRIVER, Role.MANAGER)` with driver ownership scoping
    - _Requirements: 4.2, 4.3, 4.4, 4.6, 4.9_

  - [~] 8.5 Write property test for driver delivery ownership filtering
    - **Property 14: Driver Delivery Ownership Filtering** — `GET /deliveries` for DRIVER role only returns records where `driverId = user.id`
    - **Validates: Requirements 4.6, 4.9**

- [ ] 9. Implement Order Cancellation and Returns
  - [x] 9.1 Create cancellation and return DTOs
    - `src/orders/dto/cancel-order.dto.ts` — `reason` field with `@MinLength(10)` (required for MANAGER, optional for SALES_REP)
    - `src/orders/dto/return-order.dto.ts`
    - _Requirements: 5.1, 5.2_

  - [-] 9.2 Implement `POST /orders/:id/cancel` and `POST /orders/:id/return`
    - `cancel` for SALES_REP: only allowed from DRAFT or SUBMITTED; no stock reversal needed
    - `cancel` for MANAGER: allowed pre-OUT_FOR_DELIVERY; if stock was deducted (PICKING/PACKED/READY_FOR_DELIVERY), call stock reversal logic in `WarehouseService`
    - `return` for MANAGER: only from COMPLETED or DELIVERED; create compensating `InventoryTransaction IN` for each line
    - All transitions recorded via `AuditService` inside `prisma.$transaction`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [~] 9.3 Write property test for stock reversal on cancellation
    - Create `src/orders/warehouse.service.pbt.spec.ts` (extend or create new file)
    - **Property 15: Stock Reversal on Cancellation** — for any cancelled order where stock was deducted, each `StockBalance` returns to pre-picking value and compensating `InventoryTransaction IN` exists
    - **Validates: Requirements 5.3, 9.3**

  - [~] 9.4 Write property test for return stock compensation
    - **Property 16: Return Stock Compensation** — for any COMPLETED/DELIVERED order with return, `InventoryTransaction IN` with correct quantities exists for each line
    - **Validates: Requirements 5.4**

  - [~] 9.5 Write property test for historical record preservation
    - **Property 17: Historical Record Preservation** — after cancellation or return, all original records remain in DB with original field values
    - **Validates: Requirements 5.5, 9.5**

  - [~] 9.6 Write property test for manager cancellation reason minimum length
    - **Property 24: Manager Cancellation Reason Minimum Length** — cancellation by Manager with reason < 10 chars is rejected; ≥ 10 chars succeeds
    - **Validates: Requirements 5.2**

- [~] 10. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement RBAC guards and notification service
  - [x] 11.1 Implement `@OrderOwner()` guard decorator
    - Create `src/orders/order-owner.guard.ts`
    - For SALES_REP mutations, check `salesOrder.salesRepId === request.user.id`; throw 403 if mismatch
    - _Requirements: 1.7, 6.7_

  - [~] 11.2 Write property test for role-permission matrix enforcement
    - Create `src/orders/rbac.pbt.spec.ts`
    - **Property 18: Role-Permission Matrix Enforcement** — for any (role, endpoint) pair not in permitted roles, system returns HTTP 403
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

  - [~] 11.3 Write property test for Sales Rep order ownership scoping
    - **Property 19: Sales Rep Order Ownership Scoping** — SALES_REP user A reading or mutating an order owned by user B receives HTTP 403
    - **Validates: Requirements 1.7, 6.7**

  - [-] 11.4 Implement `NotificationService`
    - Create `src/orders/notification.service.ts`
    - Subscribe to `EventEmitter2` events (`order.submitted`, `order.invoice_approved`, `order.ready_for_delivery`, `order.rejected`, `order.cancelled`)
    - On each event, create a `Notification` record with `targetRole`, `organizationId`, `type`, and `payload`
    - _Requirements: 2.3, 8.1, 8.2, 8.3_

  - [~] 11.5 Implement notifications polling endpoint
    - Add `GET /notifications?unread=true` endpoint returning unread notifications for the requesting user's role and org
    - Add `PATCH /notifications/:id/read` to mark a notification as read
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 12. Implement Dashboard endpoint
  - [~] 12.1 Implement `GET /orders/dashboard`
    - Query counts per status category (Sales, Invoice, Warehouse, Delivery sections as defined in requirements)
    - Filter returned sections by requesting user's role (SALES_REP sees Sales only, INVOICE_MAKER sees Invoice only, etc.)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [~] 12.2 Write property test for dashboard metric count accuracy
    - Create `src/orders/dashboard.pbt.spec.ts`
    - **Property 20: Dashboard Metric Count Accuracy** — for any set of orders in various statuses, each dashboard metric equals the exact count of records in that status
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

  - [~] 12.3 Implement `GET /orders` (Manager + Invoice Maker filtered view) and `GET /orders` report endpoint
    - Support filter params: `status`, `dateFrom`, `dateTo`, `salesRepId`, `branchId`
    - INVOICE_MAKER list shows only SUBMITTED orders sorted by submission date ascending
    - _Requirements: 2.9, 7.6_

- [~] 13. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement Mobile — Sales Rep screens
  - [~] 14.1 Create `(fulfillment)/_layout.tsx` and route guards
    - Create `mobile/src/app/(app)/(fulfillment)/_layout.tsx`
    - Read `user.role` from auth context; show only tabs relevant to the role; redirect if role has no fulfillment access
    - _Requirements: 6.1, 8.1_

  - [~] 14.2 Implement Sales Rep order list and detail screens
    - Create `mobile/src/app/(app)/(fulfillment)/orders/index.tsx` — displays orders sorted newest first with status badges
    - Create `mobile/src/app/(app)/(fulfillment)/orders/[id].tsx` — shows order detail and `OrderStatusEvent` timeline
    - _Requirements: 1.10, 8.1_

  - [~] 14.3 Implement order creation form screen
    - Create `mobile/src/app/(app)/(fulfillment)/orders/new.tsx`
    - Include customer detail fields (customerName, TIN, deliveryAddress, phone), dynamic product line rows with quantity/price/discount, and Submit button
    - Wire to `POST /orders`
    - _Requirements: 1.1, 1.3, 8.1_

  - [~] 14.4 Implement `<DocumentUpload>` shared component and attachments screen
    - Create `mobile/src/components/DocumentUpload.tsx` using `expo-document-picker` and `expo-image-picker`
    - Validate MIME type and size ≤ 10 MB client-side before upload
    - Show upload progress and error states
    - Create `mobile/src/app/(app)/(fulfillment)/orders/[id]/attachments.tsx`
    - Wire to `POST /orders/:id/attachments`
    - _Requirements: 1.8, 1.9, 8.4_

- [ ] 15. Implement Mobile — Store Man screens
  - [~] 15.1 Implement picking queue and picking list screens
    - Create `mobile/src/app/(app)/(fulfillment)/warehouse/index.tsx` — lists orders in WAITING_FOR_WAREHOUSE
    - Create `mobile/src/app/(app)/(fulfillment)/warehouse/[id]/picking.tsx` — shows `PickingListLine` items with picked status
    - Wire start-picking to `POST /orders/:id/start-picking`
    - _Requirements: 3.1, 3.2, 8.2_

  - [~] 15.2 Implement barcode scan and confirm-all actions
    - Integrate barcode scanning (e.g. `expo-barcode-scanner`) into the picking screen
    - On scan, call `POST /orders/:id/picking-list/scan` and update line state
    - Implement "Confirm All Picked" button that calls `POST /orders/:id/confirm-picking`
    - _Requirements: 3.10, 8.2_

- [ ] 16. Implement Mobile — Driver screens
  - [~] 16.1 Implement driver delivery list and detail screens
    - Create `mobile/src/app/(app)/(fulfillment)/deliveries/index.tsx` — lists driver's own deliveries
    - Create `mobile/src/app/(app)/(fulfillment)/deliveries/[id].tsx` — shows address, customer phone, navigation link
    - Wire pickup to `POST /deliveries/:id/pickup`
    - _Requirements: 4.6, 4.7, 8.3_

  - [~] 16.2 Implement delivery confirmation screen
    - Create `mobile/src/app/(app)/(fulfillment)/deliveries/[id]/confirm.tsx`
    - Reuse `<DocumentUpload>` component for confirmation photo/PDF upload
    - Wire to `POST /deliveries/:id/confirm`
    - _Requirements: 4.3, 4.8, 8.3_

- [ ] 17. Implement Mobile — Manager dashboard screen
  - [~] 17.1 Implement role-scoped dashboard screen
    - Create `mobile/src/app/(app)/(fulfillment)/dashboard.tsx`
    - Fetch `GET /orders/dashboard` and render metric cards per section (visible sections based on role)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [~] 18. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each property-based test file should use `fast-check` (`npm install --save-dev fast-check` in `backend/`)
- Run backend tests with: `cd backend && npx jest --testPathPattern="orders" --runInBand`
- Run E2E tests with: `cd backend && npx jest --config test/jest-e2e.json --runInBand`
- All multi-table mutations (stock deduction, invoice creation, status transitions) must run inside `prisma.$transaction(...)`
- The `@OrderOwner()` guard must be applied to all SALES_REP mutation endpoints
- Mobile screens are gated in `_layout.tsx` by reading `user.role` from the auth context

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["2.1", "2.4"] },
    { "id": 4, "tasks": ["2.2", "3.1", "6.1", "8.1", "9.1"] },
    { "id": 5, "tasks": ["2.3", "2.5", "3.2", "3.3", "4.1", "11.1"] },
    { "id": 6, "tasks": ["3.4", "3.5", "4.2", "4.3", "6.2", "6.3", "6.4", "7.1", "8.4", "9.2", "11.4"] },
    { "id": 7, "tasks": ["3.6", "3.7", "6.5", "6.6", "6.7", "7.2", "7.3", "7.4", "8.2", "8.3", "8.5", "9.3", "9.4", "9.5", "9.6", "11.2", "11.3", "11.5"] },
    { "id": 8, "tasks": ["7.5", "7.6", "12.1", "12.3"] },
    { "id": 9, "tasks": ["12.2", "14.1"] },
    { "id": 10, "tasks": ["14.2", "14.3", "15.1", "16.1", "17.1"] },
    { "id": 11, "tasks": ["14.4", "15.2", "16.2"] }
  ]
}
```
