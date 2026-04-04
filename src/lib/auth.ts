import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds+guilds.members.read",
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account && account.provider === "discord") {
        try {
          const guildId = process.env.DISCORD_GUILD_ID;
          // Fetch the user's member details for our specific guild
          const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });

          if (!res.ok) {
            console.error("User is not in the guild or token lacks guilds.members.read scope.");
            return false;
          }

          const member = await res.json();
          const userRoles: string[] = member.roles || [];

          const allowedRoles = [
            process.env.DISCORD_ROLE_HIGH,
            process.env.DISCORD_ROLE_FOUNDER,
            process.env.DISCORD_ROLE_MODERATOR
          ];

          const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

          if (hasAccess) {
            return true;
          } else {
            console.log("Access Denied: User in guild but missing required roles.");
            return "/?error=AccessDenied"; // Redirects back with error
          }
        } catch (error) {
          console.error("Error verifying Discord roles:", error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
