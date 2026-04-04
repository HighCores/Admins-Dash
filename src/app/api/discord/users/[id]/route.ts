import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Await params as a Promise in Next.js 15
) {
    const { id } = await params;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
        return NextResponse.json({ username: "Missing Token" }, { status: 401 });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({ username: data.global_name || data.username || id });
        }

        // Detailed error logging on server
        console.error(`Discord API_ERR: ${response.status} for UserID: ${id}`);
        
        // Return ID as fallback to prevent 500s
        return NextResponse.json({ username: `User_${id.slice(-6)}` });
    } catch (error) {
        return NextResponse.json({ username: id });
    }
}
