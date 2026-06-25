import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // In a real app, we fetch the guild member details here using the accessToken
      // For now, we will simulate the connection
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Server Role checking logic conceptually:
      // const res = await fetch(`https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`, {
      //   headers: { Authorization: `Bearer ${account.access_token}` }
      // });
      // const member = await res.json();
      // if (member.roles.includes(process.env.DISCORD_HIGH_ADMIN_ROLE)) return true;
      // return false; // Block user
      
      // Temporarily allow all for testing until secrets are provided
      return true;
    }
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect back to landing on error
  },
};
