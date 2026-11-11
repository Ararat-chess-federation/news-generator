"use server";

import { redirect } from "next/navigation";
import { credentialsMatch, getSafeRedirect, isAuthConfigured } from "../../src/helpers/auth";
import { endSession, startSession } from "../../src/helpers/session";

export interface ILoginState {
  error?: string;
}

const FAILED_LOGIN_DELAY = 1000;

export async function login(_prevState: ILoginState, formData: FormData): Promise<ILoginState> {
  if (!isAuthConfigured()) {
    return { error: "Մուտքը կարգավորված չէ (AUTH_USERNAME, AUTH_PASSWORD)" };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!(await credentialsMatch(username, password))) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY));
    return { error: "Սխալ մուտքանուն կամ գաղտնաբառ" };
  }

  await startSession();
  redirect(getSafeRedirect(formData.get("from")));
}

export async function logout() {
  await endSession();
  redirect("/login");
}
