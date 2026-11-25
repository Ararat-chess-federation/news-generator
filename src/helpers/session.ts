import { cookies, headers } from "next/headers";
import { SESSION_HINT_COOKIE } from "../constants/session";
import { AUTH_COOKIE, createSessionToken, SESSION_MAX_AGE, verifySessionToken } from "./auth";

export async function isAuthenticated() {
    return verifySessionToken((await cookies()).get(AUTH_COOKIE)?.value);
}

export async function startSession() {
    const isHttps = (await headers()).get("x-forwarded-proto") === "https";
    const cookieStore = await cookies();
    const options = { sameSite: "lax", secure: isHttps, path: "/", maxAge: SESSION_MAX_AGE } as const;

    cookieStore.set(AUTH_COOKIE, await createSessionToken(), { ...options, httpOnly: true });
    cookieStore.set(SESSION_HINT_COOKIE, "1", options);
}
