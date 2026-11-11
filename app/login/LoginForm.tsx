"use client";

import { useActionState } from "react";
import { login, type ILoginState } from "./actions";

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, isPending] = useActionState<ILoginState, FormData>(login, {});

  return (
    <form action={formAction} className="login_form">
      <input type="hidden" name="from" value={from} />
      <div className="field">
        <label htmlFor="username" className="field_label">Մուտքանուն</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          autoFocus
        />
      </div>
      <div className="field">
        <label htmlFor="password" className="field_label">Գաղտնաբառ</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p className="login_error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn--primary login_submit" disabled={isPending}>
        {isPending ? "Ստուգվում է..." : "Մուտք գործել"}
      </button>
    </form>
  );
}
