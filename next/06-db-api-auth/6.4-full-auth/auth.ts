import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ה-JWT נשמר ב-cookie מוצפן. Credentials עובד רק עם session מסוג jwt
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    // AUTH_GITHUB_ID ו-AUTH_GITHUB_SECRET נקראים מהסביבה אוטומטית
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials.email ?? "").toLowerCase();
        const password = String(credentials.password ?? "");
        if (!email || !password) throw new CredentialsSignin();

        await connectDB();
        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
          throw new CredentialsSignin();
        }
        return { id: String(user._id), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // רץ בהתחברות (אז יש user/account) ובכל קריאה ל-auth() אחר כך (רק token)
      if (account?.provider === "github" && profile) {
        await connectDB();
        const dbUser = await User.findOneAndUpdate(
          { githubId: String(profile.id) },
          { $setOnInsert: { name: profile.name ?? profile.login, githubId: String(profile.id) } },
          { upsert: true, new: true },
        );
        token.uid = String(dbUser._id);
      } else if (user) {
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // המזהה של המשתמש אצלנו במסד, כדי לבדוק בעלות על מתכונים
      session.user.id = token.uid as string;
      return session;
    },
  },
});
