import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const login_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_LOGIN}`;
const refresh_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_REFRESH}`;
const google_login_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_AUTH_GOOGLE}`;

console.log("=== NextAuth Config Loaded ===");
console.log("login_url:", login_url);
console.log("refresh_url:", refresh_url);
console.log("google_login_url:", google_login_url);

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    role: string;
    error?: string;
  }

  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    role: string;
    error?: string;
  }

  interface Profile {
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    role: string;
    error?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
           console.error("Credentials is null")
           return null;
        }
        console.log("Attempting login with email:", credentials.email);

        const res = await fetch(login_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const text = await res.text();
        console.log("API Response:", text);

        if (!res.ok) {
          console.error("Login failed:", res.status, res.statusText);
          return null;
        }

        console.log("refresh_url = ", refresh_url);

        const data = JSON.parse(text);
        if (data.success) {
          console.log("Login successful for:", credentials.email);
          return {
            id : credentials.email,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            accessTokenExpires: data.data.accessTokenExpires,
            refreshTokenExpires: data.data.refreshTokenExpires,
            role: data.data.role,
          };
        } else {
          console.error("Login API returned failure");
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback Triggered");
    
      if (account?.provider === 'google') {
        if (!profile) {
          console.error("profile is null");
          return { ...token, error: "GoogleProfileMissing" }; // Ensure token structure remains valid
        }
        console.log("Google Sign-In detected for:", profile.email);
    
        try {
          const res = await fetch(google_login_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              profilePictureUrl: profile.picture,
            }),
          });
    
          if (!res.ok) throw new Error("Google login API failed");
    
          const data = await res.json();
          console.log("Google login API response:", data);
    
          if (data.success) {
            console.log("Google login successful for:", profile.email);
            return {
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              accessTokenExpires: data.data.accessTokenExpires,
              refreshTokenExpires: data.data.refreshTokenExpires,
              role: data.data.role,
            };
          } else {
            console.error("Google login API returned failure for:", profile.email);
            return { ...token, error: "GoogleLoginFailed" };
          }
        } catch (error) {
          console.error("Google login error:", error);
          return { ...token, error: "GoogleLoginError" };
        }
      }
    
      if (user) {
        console.log("User authenticated:", user);
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          refreshTokenExpires: user.refreshTokenExpires,
          role: user.role,
        };
      }
    
      const now = Date.now();
      if (token.accessTokenExpires && now >= token.accessTokenExpires) {
        console.log("Access token expired. Refreshing...");
    
        if (token.refreshTokenExpires && now >= token.refreshTokenExpires) {
          console.log("Refresh token expired. Logging out...");
          return { ...token, error: "RefreshTokenExpired" };
        }
    
        try {
          console.log("Attempting token refresh...");
          const res = await fetch(refresh_url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.refreshToken}`,
            },
          });
    
          if (!res.ok) throw new Error("Failed to refresh token");
    
          const refreshedData = await res.json();
          console.log("Token refreshed successfully:", refreshedData);
    
          return {
            accessToken: refreshedData.data.accessToken,
            refreshToken: refreshedData.data.refreshToken,
            accessTokenExpires: refreshedData.data.accessTokenExpires,
            refreshTokenExpires: refreshedData.data.refreshTokenExpires,
            role: refreshedData.data.role,
          };
        } catch (error) {
          console.error("Error refreshing token:", error);
          return { ...token, error: "RefreshTokenError" };
        }
      }
    
      console.log("Returning existing token.");
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback triggered");

      if (token.error === "RefreshTokenExpired") {
        console.log("Session expired. Logging out user.");
        session.error = "RefreshTokenExpired";
        return session;
      }

      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
