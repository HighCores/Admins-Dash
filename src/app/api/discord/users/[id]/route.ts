import { NextResponse } from "next/server";
import { DISCORD_CONFIG } from "@/lib/discord-config";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const BOT_TOKEN = DISCORD_CONFIG.BOT_TOKEN;

    if (!BOT_TOKEN) return NextResponse.json({ username: "Missing Token" }, { status: 401 });

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({ username: data.global_name || data.username || id });
        }

        return NextResponse.json({ username: `User_${id.slice(-6)}` });
    } catch (error) {
        return NextResponse.json({ username: id });
    }
}
