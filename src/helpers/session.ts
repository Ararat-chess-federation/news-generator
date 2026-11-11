import { cookies, headers } from "next/headers";
import { AUTH_COOKIE, createSessionToken, SESSION_MAX_AGE, verifySessionToken } from "./auth";

export async function isAuthenticated() {
    return verifySessionToken((await cookies()).get(AUTH_COOKIE)?.value);
}

export async function startSession() {
    const isHttps = (await headers()).get("x-forwarded-proto") === "https";

    (await cookies()).set(AUTH_COOKIE, await createSessionToken(), {
        httpOnly: true,
        sameSite: "lax",
        secure: isHttps,
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
}

export async function endSession() {
    (await cookies()).delete(AUTH_COOKIE);
}
