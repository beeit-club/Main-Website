import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * API Route để revalidate cache bằng tag
 * POST /api/revalidate?tag=questionsList
 */
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (!tag) {
      return NextResponse.json(
        { error: "Tag parameter is required" },
        { status: 400 }
      );
    }

    // Revalidate cache với tag được chỉ định
    revalidateTag(tag);

    console.log(`✅ Revalidated cache for tag: ${tag}`);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    console.error("❌ Error revalidating cache:", error);
    return NextResponse.json(
      { error: "Error revalidating cache", message: error.message },
      { status: 500 }
    );
  }
}

