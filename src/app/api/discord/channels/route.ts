import { NextResponse } from "next/server";
import { fetchDiscordChannels } from "@/lib/discord-api";

export async function GET() {
    const channels = await fetchDiscordChannels();
    return NextResponse.json(channels);
}
