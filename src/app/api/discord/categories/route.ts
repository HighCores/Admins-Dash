import { NextResponse } from "next/server";
import { DISCORD_CONFIG } from "@/lib/discord-config";

export async function GET() {
    const BOT_TOKEN = DISCORD_CONFIG.BOT_TOKEN;
    const GUILD_ID = DISCORD_CONFIG.GUILD_ID;

    if (!BOT_TOKEN) return NextResponse.json({ error: "Missing BOT_TOKEN in Config Layer" }, { status: 401 });
    if (!GUILD_ID) return NextResponse.json({ error: "Missing GUILD_ID in Config Layer" }, { status: 400 });

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
            next: { revalidate: 0 }
        });

        if (response.status === 401) return NextResponse.json({ error: "Invalid Discord Bot Token" }, { status: 401 });
        if (response.status === 404) return NextResponse.json({ error: "Guild Not Found" }, { status: 404 });
        if (!response.ok) return NextResponse.json({ error: `Discord API Error: ${response.statusText}` }, { status: response.status });

        const channels = await response.json();
        const categories = channels
            .filter((ch: any) => ch.type === 4)
            .map((ch: any) => ({ id: ch.id, name: ch.name }));

        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ error: `Relay Shield Fault: ${error.message}` }, { status: 500 });
    }
}
