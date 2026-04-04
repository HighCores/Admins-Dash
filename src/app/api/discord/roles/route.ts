import { NextResponse } from "next/server";
import { fetchDiscordRoles } from "@/lib/discord-api";

export async function GET() {
    const roles = await fetchDiscordRoles();
    return NextResponse.json(roles);
}
