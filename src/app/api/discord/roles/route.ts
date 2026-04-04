import { NextResponse } from "next/server";

export async function GET() {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!BOT_TOKEN) return NextResponse.json({ error: "Missing DISCORD_BOT_TOKEN in .env.local" }, { status: 401 });
    if (!GUILD_ID) return NextResponse.json({ error: "Missing DISCORD_GUILD_ID in .env.local" }, { status: 400 });

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
            next: { revalidate: 0 }
        });

        if (response.status === 401) return NextResponse.json({ error: "Invalid Discord Bot Token" }, { status: 401 });
        if (response.status === 404) return NextResponse.json({ error: "Guild (Server) Not Found" }, { status: 404 });
        if (!response.ok) return NextResponse.json({ error: `Discord API Error: ${response.statusText}` }, { status: response.status });

        const roles = await response.json();
        const mappedRoles = roles
            .filter((role: any) => role.name !== "@everyone")
            .map((role: any) => ({
                id: role.id,
                name: role.name,
                color: `#${role.color.toString(16).padStart(6, "0")}`,
            }));

        return NextResponse.json(mappedRoles);
    } catch (error: any) {
        return NextResponse.json({ error: `Connection Failed: ${error.message}` }, { status: 500 });
    }
}
