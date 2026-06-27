import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, OTP_TTL_MS } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
        intent: { label: "Intent", type: "text" },
        name: { label: "Name", type: "text" },
        address: { label: "Address", type: "text" },
      },
      async authorize(credentials) {
        const phone = normalizePhone(String(credentials?.phone ?? ""));
        const code = String(credentials?.code ?? "").trim();
        const intent = String(credentials?.intent ?? "login");

        if (!phone || code.length !== 6) return null;

        const record = await prisma.phoneOtp.findUnique({ where: { phone } });
        if (!record || record.code !== code || record.expiresAt < new Date()) {
          return null;
        }

        await prisma.phoneOtp.delete({ where: { phone } }).catch(() => null);

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
          if (intent !== "signup") return null;
          const name = String(credentials?.name ?? "").trim() || "کاربر کوبار";
          const address = String(credentials?.address ?? "").trim() || "";
          user = await prisma.user.create({
            data: { phone, name, address },
          });
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.name ?? "کاربر کوبار",
          address: user.address ?? "",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.address = user.address;
        token.role = user.role;
      } else if (token.sub && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        token.role = dbUser?.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.phone = (token.phone as string) ?? "";
        session.user.name = (token.name as string) ?? "";
        session.user.address = (token.address as string) ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
});

export async function createAndLogOtp(phone: string) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.phoneOtp.upsert({
    where: { phone },
    create: { phone, code, expiresAt },
    update: { code, expiresAt },
  });

  console.log(
    `\n[SMS — Koubar] کد ورود برای ${phone}: ${code}\n(اعتبار ۵ دقیقه — فقط توسعه)\n`,
  );

  return { expiresAt };
}
