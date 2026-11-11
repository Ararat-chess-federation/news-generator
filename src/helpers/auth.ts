export const AUTH_COOKIE = "news_generator_session";
export const SESSION_MAX_AGE = 15 * 60;

const encoder = new TextEncoder();

export function isAuthConfigured() {
    return Boolean(process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD);
}

const KEY_DERIVATION_ITERATIONS = 600_000;
const KEY_DERIVATION_SALT = "ararat-chess-news-generator-session";

let signingKey: { credentials: string; key: Promise<CryptoKey> } | undefined;

async function deriveSigningKey(credentials: string) {
    const baseKey = await crypto.subtle.importKey("raw", encoder.encode(credentials), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(KEY_DERIVATION_SALT), iterations: KEY_DERIVATION_ITERATIONS },
        baseKey,
        { name: "HMAC", hash: "SHA-256", length: 256 },
        false,
        ["sign"]
    );
}

function getSigningKey() {
    const credentials = `${process.env.AUTH_USERNAME}:${process.env.AUTH_PASSWORD}`;
    if (signingKey?.credentials !== credentials) {
        signingKey = { credentials, key: deriveSigningKey(credentials) };
    }
    return signingKey.key;
}

function toBase64Url(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function safeEqual(a: string, b: string) {
    if (a.length !== b.length) {
        return false;
    }

    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

async function hmac(value: string) {
    return toBase64Url(await crypto.subtle.sign("HMAC", await getSigningKey(), encoder.encode(value)));
}

async function sha256(value: string) {
    return toBase64Url(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

export async function credentialsMatch(username: string, password: string) {
    if (!isAuthConfigured()) {
        return false;
    }

    const [usernameHash, passwordHash, expectedUsernameHash, expectedPasswordHash] = await Promise.all([
        sha256(username),
        sha256(password),
        sha256(process.env.AUTH_USERNAME!),
        sha256(process.env.AUTH_PASSWORD!),
    ]);

    const usernameMatches = safeEqual(usernameHash, expectedUsernameHash);
    const passwordMatches = safeEqual(passwordHash, expectedPasswordHash);
    return usernameMatches && passwordMatches;
}

export async function createSessionToken() {
    const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
    return `${expiresAt}.${await hmac(`${process.env.AUTH_USERNAME}.${expiresAt}`)}`;
}

export async function verifySessionToken(token: string | undefined) {
    if (!token || !isAuthConfigured()) {
        return false;
    }

    const [expiresAtValue, signature] = token.split(".");
    const expiresAt = Number(expiresAtValue);
    if (!signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
        return false;
    }

    return safeEqual(signature, await hmac(`${process.env.AUTH_USERNAME}.${expiresAt}`));
}

export function getSafeRedirect(value: unknown) {
    const path = typeof value === "string" ? value : "";
    return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\") && !path.startsWith("/login")
        ? path
        : "/";
}
