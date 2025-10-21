import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setAxiosAuthToken } from "@/api/instance";

export async function POST(request: NextRequest) {
  const data1 = await request.json();
  cookies().set("access_token", data1.access_token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 1, // One week
    path: "/",
  });
  setAxiosAuthToken(data1.access_token);
  return NextResponse.json({ status: "success" });
}
