export type PartnerStatus = "pending" | "active" | "disabled";

export type PartnerRecord = {
  id: string;
  code: string;
  company: string;
  email: string;
  contact_name: string | null;
  clerk_user_id: string | null;
  status: PartnerStatus;
  created_at: string;
  activated_at: string | null;
};

export type PartnerStats = {
  partnerCode: string;
  leads: number;
  dossiers: number;
  total: number;
  commissionStatus: "estimated";
};
