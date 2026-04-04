const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function fetchDiscordRoles() {
    if (!BOT_TOKEN || !GUILD_ID) {
        console.error("Missing Discord Bot Token or Guild ID");
        return [];
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch roles");

        const roles = await response.json();
        return roles
            .filter((r: any) => !r.managed && r.name !== "@everyone")
            .map((r: any) => ({
                id: r.id,
                name: r.name,
                color: r.color ? `#${r.color.toString(16).padStart(6, "0")}` : null,
            }));
    } catch (error) {
        console.error("Error fetching Discord roles:", error);
        return [];
    }
}

export async function fetchDiscordChannels() {
    if (!BOT_TOKEN || !GUILD_ID) {
        console.error("Missing Discord Bot Token or Guild ID");
        return [];
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch channels");

        const channels = await response.json();
        // Text channels (0) and Announcement channels (5)
        return channels
            .filter((c: any) => c.type === 0 || c.type === 5)
            .map((c: any) => ({
                id: c.id,
                name: c.name,
                type: c.type,
            }));
    } catch (error) {
        console.error("Error fetching Discord channels:", error);
        return [];
    }
}
