import { NextResponse } from "next/server";

export async function GET() {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!BOT_TOKEN || !GUILD_ID) {
        return NextResponse.json({ error: "Missing Discord Credentials" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch roles" }, { status: response.status });
        }

        const roles = await response.json();
        // Return only pertinent role data
        const mappedRoles = roles
            .filter((role: any) => role.name !== "@everyone")
            .map((role: any) => ({
                id: role.id,
                name: role.name,
                color: `#${role.color.toString(16).padStart(6, "0")}`, // Convert decimal color to Hex
            }));

        return NextResponse.json(mappedRoles);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
