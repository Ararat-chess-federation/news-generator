"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { login } from "../../../app/actions";

interface ILoginPromptProps {
  onStart: () => void;
  onFailure: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LoginPrompt({ onStart, onFailure, onSuccess, onCancel }: ILoginPromptProps) {
  const id = useId();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    onStart();
    startTransition(async () => {
      const result = await login(String(form.get("username") ?? ""), String(form.get("password") ?? ""));
      if (result.error) {
        onFailure();
        setError(result.error);
        return;
      }
      onSuccess();
    });
  };

  return (
    <form className="login_prompt" onSubmit={handleSubmit}>
      <p className="login_prompt_title">Մուտք գործեք՝ Facebook-ում պահպանելու համար</p>
      <div className="login_prompt_fields">
        <div className="field">
          <label htmlFor={`${id}-username`} className="field_label">Մուտքանուն</label>
          <input
            id={`${id}-username`}
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
          <label htmlFor={`${id}-password`} className="field_label">Գաղտնաբառ</label>
          <input id={`${id}-password`} name="password" type="password" autoComplete="current-password" required />
        </div>
      </div>
      {error && <p className="fb_save_error" role="alert">{error}</p>}
      <div className="login_prompt_actions">
        <button type="submit" className="btn btn--facebook" disabled={isPending}>
          {isPending ? "Ստուգվում է..." : "Մուտք գործել և պահպանել"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={isPending}>
          Չեղարկել
        </button>
      </div>
    </form>
  );
}
