import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setAxiosAuthToken } from "@/api/instance";

export async function POST(request: NextRequest) {
  try {
    cookies().delete("access_token");
    setAxiosAuthToken(null);
    return NextResponse.json({ status: "success" });
  } catch (ex) {
    console.error(ex);
  }
}
