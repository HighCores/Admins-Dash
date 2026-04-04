import { NextResponse } from "next/server";

export async function GET() {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!BOT_TOKEN || !GUILD_ID) {
        return NextResponse.json({ error: "Missing Discord Credentials" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch categories" }, { status: response.status });
        }

        const channels = await response.json();
        // Filter for Categories (type 4)
        const categories = channels
            .filter((ch: any) => ch.type === 4)
            .map((ch: any) => ({
                id: ch.id,
                name: ch.name,
            }));

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
