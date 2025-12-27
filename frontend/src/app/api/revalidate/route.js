import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * API Route để revalidate cache bằng tag
 * POST /api/revalidate?tag=questions-list
 * 
 * Authentication:
 * - Header: Authorization: Bearer <REVALIDATE_SECRET>
 * - Hoặc query param: ?secret=<REVALIDATE_SECRET>
 * 
 * Environment variable:
 * - REVALIDATE_SECRET: Secret token để bảo vệ API (optional, nhưng recommended)
 */
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const secretFromQuery = searchParams.get("secret");

    // Authentication check
    const revalidateSecret = process.env.REVALIDATE_SECRET;
    if (revalidateSecret) {
      // Check secret from header
      const authHeader = request.headers.get("authorization");
      const secretFromHeader = authHeader?.replace("Bearer ", "");
      
      // Check secret from query param (fallback)
      const providedSecret = secretFromHeader || secretFromQuery;
      
      if (providedSecret !== revalidateSecret) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    if (!tag) {
      return NextResponse.json(
        { error: "Tag parameter is required" },
        { status: 400 }
      );
    }

    // Revalidate cache với tag được chỉ định
    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error revalidating cache", message: error.message },
      { status: 500 }
    );
  }
}

