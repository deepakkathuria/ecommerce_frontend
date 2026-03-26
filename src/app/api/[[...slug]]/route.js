import { handleApi } from "@/lib/server/handleApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const slug = context.params?.slug;
  return handleApi(request, "GET", slug);
}

export async function POST(request, context) {
  const slug = context.params?.slug;
  return handleApi(request, "POST", slug);
}

export async function PUT(request, context) {
  const slug = context.params?.slug;
  return handleApi(request, "PUT", slug);
}

export async function PATCH(request, context) {
  const slug = context.params?.slug;
  return handleApi(request, "PATCH", slug);
}

export async function DELETE(request, context) {
  const slug = context.params?.slug;
  return handleApi(request, "DELETE", slug);
}
