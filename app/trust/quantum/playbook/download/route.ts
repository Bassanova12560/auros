import { quantumPlaybookMarkdown } from "@/lib/wets/quantum-playbook";

export const dynamic = "force-static";

export function GET() {
  const body = quantumPlaybookMarkdown();
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="auros-quantum-recourse-playbook.md"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
