import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(request: Request, { params }: { params: { id: string } }) {
    if (!BOT_TOKEN) {
        return NextResponse.json({ error: "Missing Bot Token" }, { status: 500 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${params.id}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ username: `User_${params.id.slice(0, 5)}` });
        }

        const user = await response.json();
        return NextResponse.json({ 
            username: user.global_name || user.username,
            avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null
        });
    } catch (error) {
        return NextResponse.json({ username: `User_${params.id.slice(0, 5)}` });
    }
}
