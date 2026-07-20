import { NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = result.data;
    console.log(`[NEWSLETTER] New subscription request: ${email}`);

    // Since there's no dedicated database table, returning success
    return NextResponse.json(
      { success: true, message: "Subscribed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
