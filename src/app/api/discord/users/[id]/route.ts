import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Next.js 15: params is now a Promise and must be awaited.
export async function GET(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!BOT_TOKEN) {
        return NextResponse.json({ error: "Missing Bot Token" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ username: `User_${id.slice(0, 5)}` });
        }

        const user = await response.json();
        return NextResponse.json({ 
            username: user.global_name || user.username || user.id,
            avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null
        });
    } catch (error) {
        return NextResponse.json({ username: `User_${id.slice(0, 5)}` });
    }
}
