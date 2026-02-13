import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATION_SECRET;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  try {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (e) {
    return NextResponse.json({ message: "Revalidation failed", error: String(e) }, { status: 500 });
  }
}
