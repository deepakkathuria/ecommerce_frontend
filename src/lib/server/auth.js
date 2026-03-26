import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function getBearerToken(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  const parts = auth.split(" ");
  return parts.length > 1 ? parts[1].trim() : null;
}

export function verifyUserId(request) {
  const token = getBearerToken(request);
  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized access" }, { status: 401 }) };
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { userId: decoded.id };
  } catch {
    return { error: NextResponse.json({ error: "Unauthorized access" }, { status: 401 }) };
  }
}
