export const discordApi = {
  async getTickets() {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/tickets`, {
      headers: { "X-API-Key": process.env.DISCORD_API_KEY || "" },
    });
    return res.json();
  },
  
  async closeTicket(id: string) {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/tickets/${id}/close`, {
      method: "POST",
      headers: { "X-API-Key": process.env.DISCORD_API_KEY || "" },
    });
    return res.json();
  },

  async sendMessage(channelId: string, message: string) {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/channels/${channelId}/message`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.DISCORD_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  async broadcast(message: string, roleId?: string) {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/broadcast/start`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.DISCORD_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, role_id: roleId }),
    });
    return res.json();
  },

  async getAutoReplies() {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/auto-replies`, {
      headers: { "X-API-Key": process.env.DISCORD_API_KEY || "" },
    });
    return res.json();
  },

  async addAutoReply(keyword: string, response: string) {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/auto-replies`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.DISCORD_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword, response }),
    });
    return res.json();
  },

  async deleteAutoReply(keyword: string) {
    const res = await fetch(`${process.env.DISCORD_API_URL}/api/auto-replies/${encodeURIComponent(keyword)}`, {
      method: "DELETE",
      headers: { "X-API-Key": process.env.DISCORD_API_KEY || "" },
    });
    return res.json();
  },
};
