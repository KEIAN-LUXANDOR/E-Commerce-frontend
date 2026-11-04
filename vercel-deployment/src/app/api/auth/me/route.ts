import { NextResponse, type NextRequest } from "next/server";
import { SERVER_API_BASE } from "@/lib/api/config";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (
    process.env.NEXT_PUBLIC_USE_MOCK_API !== "false" ||
    !request.cookies.has("JSESSIONID")
  ) {
    return NextResponse.json(null, { headers: noStoreHeaders });
  }

  const response = await fetch(`${SERVER_API_BASE}/auth/me`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (response.status === 401) {
    return NextResponse.json(null, { headers: noStoreHeaders });
  }

  const headers = new Headers(noStoreHeaders);
  const contentType = response.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
