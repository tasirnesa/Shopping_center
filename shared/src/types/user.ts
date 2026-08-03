export type Role =
  | "SYSTEM_ADMIN"
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "STORE_KEEPER";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  organizationId?: string | null;
  branchId?: string | null;
  organization?: {
    id: string;
    name: string;
    businessType?: string | null;
  } | null;
  branch?: {
    id: string;
    name: string;
  } | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export type PaymentMethod = "CASH" | "CARD" | "TRANSFER";
