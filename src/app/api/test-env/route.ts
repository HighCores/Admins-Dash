import { NextResponse } from "next/server";

export async function GET() {
    const token = process.env.DISCORD_BOT_TOKEN;
    const guild = process.env.DISCORD_GUILD_ID;

    return NextResponse.json({
        has_token: !!token,
        token_prefix: token ? token.substring(0, 10) + "..." : "NONE",
        has_guild: !!guild,
        guild_id: guild || "NONE",
        timestamp: new Date().toISOString(),
        node_version: process.version,
        env_keys: Object.keys(process.env).filter(key => key.includes("DISCORD"))
    });
}
