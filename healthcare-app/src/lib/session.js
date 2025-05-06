// import { IronSessionOptions } from 'iron-session'; // Removed type import
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
// import { GetServerSidePropsContext, NextApiHandler } from 'next'; // Removed type imports

// Removed type annotation
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'medilearn-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Wrapper for API routes
// Removed type annotation from handler
export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Wrapper for SSR pages
// Removed type annotation from handler
export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}

// Extend the session type
// Removed TypeScript's declare module syntax
/*
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      username: string;
      isLoggedIn: boolean;
    };
  }
}
*/ 