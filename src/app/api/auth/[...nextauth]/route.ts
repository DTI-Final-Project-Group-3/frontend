import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const login_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_LOGIN}`;
const refresh_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`; // Update this based on your backend

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(login_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const text = await res.text();
        console.log("API Response:", text); // Debugging

        if (!res.ok) {
          console.error("Login failed:", res.status, res.statusText);
          return null;
        }

        const data = JSON.parse(text);
        if (data.success) {
          return {
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            accessTokenExpires: data.data.accessTokenExpires, // Store expiry timestamp
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

    const now = Date.now();
    if (token.accessTokenExpires && now >= token.accessTokenExpires) {
    console.log("Access token expired. Refreshing...");

    try {
      const res = await fetch(refresh_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.refreshToken}`, // Send refresh token in the Authorization header
        },
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const refreshedData = await res.json();
      console.log("Token refreshed:", refreshedData);

      return {
        accessToken: refreshedData.data.accessToken,
        refreshToken: refreshedData.data.refreshToken,
        accessTokenExpires: refreshedData.data.accessTokenExpires,
      };
    } catch (error) {
      console.error("Error refreshing token:", error);
      return { ...token, error: "RefreshTokenError" };
    }
  }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
