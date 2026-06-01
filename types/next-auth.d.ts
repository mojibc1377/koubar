import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    phone: string;
    name: string;
    address: string;
  }

  interface Session {
    user: {
      id: string;
      phone: string;
      name: string;
      address: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone?: string;
    address?: string;
  }
}
