import { models } from "@/app/lib/review/model";

export const runtime = "nodejs";
export function GET() {
  return Response.json(
    { configured: Boolean(process.env.DEEPSEEK_API_KEY), models },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
