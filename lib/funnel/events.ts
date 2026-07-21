/** Tunnel Détecter → Décider → Prouver (Vercel Analytics). */
export const FUNNEL_EVENTS = {
  detect_welhr: "funnel_detect_welhr",
  decide_playbook: "funnel_decide_playbook",
  decide_playbook_pdf: "funnel_decide_playbook_pdf",
  decide_roi: "funnel_decide_roi",
  decide_brief: "funnel_decide_brief",
  prove_verify: "funnel_prove_verify",
} as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[keyof typeof FUNNEL_EVENTS];
