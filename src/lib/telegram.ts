export const telegramApi = {
  async sendMessage(chatId: string, message: string) {
    const res = await fetch(`${process.env.TELEGRAM_API_URL}/api/send_message`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.TELEGRAM_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, message }),
    });
    return res.json();
  },

  async closeTicket(userId: string, message: string = "Your ticket has been closed.") {
    const res = await fetch(`${process.env.TELEGRAM_API_URL}/api/tickets/close`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.TELEGRAM_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, message }),
    });
    return res.json();
  },
};
