import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    const token = process.env.DISCORD_BOT_TOKEN;
    const cwd = process.cwd();
    
    // Check for .env files in CWD
    const files = fs.readdirSync(cwd);
    const envFiles = files.filter(f => f.toLowerCase().includes(".env"));

    return NextResponse.json({
        has_token: !!token,
        token_preview: token ? token.substring(0, 8) + "..." : "MISSING",
        cwd: cwd,
        env_files_found: envFiles,
        timestamp: new Date().toISOString(),
        instructions: "If has_token is false, and .env.local is in env_files_found, YOU MUST RESTART YOUR TERMINAL (Ctrl+C then npm run dev)."
    });
}
