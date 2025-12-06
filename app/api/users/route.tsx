import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const data = await request.json();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  return Response.json(data);
}
