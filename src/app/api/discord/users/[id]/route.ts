import { NextResponse } from "next/server";

// Next.js 15: params is now a Promise and must be awaited.
export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
        console.error("CRITICAL_ERR: DISCORD_BOT_TOKEN is missing from environment variables.");
        return NextResponse.json({ 
            error: "Missing Bot Token",
            username: `User_${id.slice(0, 5)}` // Return fallback even on 500
        }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            const errData = await response.json();
            console.warn(`DISCORD_API_WARN: Failed to fetch user ${id}`, errData);
            return NextResponse.json({ username: `User_${id.slice(0, 5)}` });
        }

        const user = await response.json();
        return NextResponse.json({ 
            username: user.global_name || user.username || user.id,
            avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null
        });
    } catch (error) {
        console.error(`DISCORD_API_ERR: Exception fetching user ${id}`, error);
        return NextResponse.json({ username: `User_${id.slice(0, 5)}` });
    }
}
