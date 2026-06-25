import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, targetType, targetId, message, attachmentUrl } = body;

    const apiUrl = platform === "discord" ? process.env.DISCORD_API_URL : process.env.TELEGRAM_API_URL;
    const apiKey = platform === "discord" ? process.env.DISCORD_API_KEY : process.env.TELEGRAM_API_KEY;

    if (!apiUrl) {
      return NextResponse.json({ error: "API URL not configured for " + platform }, { status: 500 });
    }

    let url = `${apiUrl}/api/broadcast`;
    let payload: any = { message };

    if (platform === "discord") {
      if (targetType === "channel" && targetId) {
        url = `${apiUrl}/api/channels/${targetId}/message`;
        if (attachmentUrl) payload.files = [attachmentUrl];
      } else {
        if (attachmentUrl) payload.attachment_url = attachmentUrl;
      }
    } else {
      // Telegram
      if (targetType === "channel" && targetId) payload.target_id = targetId; // Assuming Telegram expects target_id
      if (attachmentUrl) payload.attachment_url = attachmentUrl;
    }

    // Call the bot's REST API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey || '',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        return NextResponse.json({ error: err.error || "Bot API returned error" }, { status: response.status });
    }

    try {
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
      const session = await getServerSession(authOptions);
      if (session?.user?.name) {
        const { logAction } = await import("@/lib/logger");
        await logAction(session.user.name, "Broadcast Sent", `Sent a broadcast to ${targetType === "channel" ? targetId : "ALL"} on ${platform}`, platform);
      }
    } catch(e) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
