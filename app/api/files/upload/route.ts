import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;
  const blob = await put(file.name, file, { access: "public" });

  return NextResponse.json(blob);
}
