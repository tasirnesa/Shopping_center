export interface OrganizationSummary {
  id: string;
  name: string;
  businessType?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface BranchSummary {
  id: string;
  name: string;
  code?: string | null;
}

export interface OrganizationSettings {
  id: string;
  organizationId: string;
  currency: string;
  taxRate: number;
  receiptFooter?: string | null;
  language: string;
  fiscalYear?: string | null;
  timezone: string;
}
