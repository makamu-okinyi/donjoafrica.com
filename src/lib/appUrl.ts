/** Hiring app (sign up and log in live here). */
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined) || "https://hr.donjoafrica.com";
export const SIGNUP_URL = `${APP_URL}/auth`;
export const SIGNUP_LABEL = "Start with proof";
