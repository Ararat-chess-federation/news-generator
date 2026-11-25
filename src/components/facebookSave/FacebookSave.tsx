"use client";

import { useState, useTransition } from "react";
import type { ISaveDraftResult } from "../../models/facebook";
import type { NewsStatus } from "../../models/news";
import LoginPrompt from "./LoginPrompt";
import "./FacebookSave.css";

const DESKTOP_ONLY_NOTICE = "Սևագրերը հասանելի են միայն համակարգչից․ Business Suite հավելվածում դրանք չեն երևում";

interface IFacebookSaveProps {
  status: NewsStatus;
  postUrl?: string;
  postedAt?: string;
  onSave: () => Promise<ISaveDraftResult>;
  onSaved: (result: ISaveDraftResult) => void;
}

export default function FacebookSave({ status, postUrl, postedAt, onSave, onSaved }: IFacebookSaveProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const handleSave = () => {
    setError("");
    startTransition(async () => {
      const result = await onSave();
      if (result.status === "unauthorized") {
        setNeedsLogin(true);
        return;
      }
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      onSaved(result);
    });
  };

  if (status === "draft" || status === "published") {
    return (
      <>
        <p className="fb_save_meta">
          {postedAt && <span>{postedAt}</span>}
          {postUrl && (
            <a href={postUrl} target="_blank" rel="noopener noreferrer">
              {status === "published" ? "Բացել Facebook-ում" : "Բացել Business Suite-ում"} ↗
            </a>
          )}
        </p>
        {status === "draft" && <p className="fb_save_notice">ⓘ {DESKTOP_ONLY_NOTICE}</p>}
      </>
    );
  }

  if (status !== "new") {
    return null;
  }

  return (
    <div className="fb_save">
      <div className="fb_save_actions">
        {needsLogin ? (
          <LoginPrompt
            onSuccess={() => {
              setNeedsLogin(false);
              handleSave();
            }}
            onCancel={() => setNeedsLogin(false)}
          />
        ) : (
          <button type="button" className="btn btn--facebook" onClick={handleSave} disabled={isPending}>
            {isPending ? "Պահպանվում է..." : "Պահպանել որպես Facebook սևագիր"}
          </button>
        )}
        <span className="fb_save_notice">ⓘ {DESKTOP_ONLY_NOTICE}</span>
        {error && <span className="fb_save_error">{error}</span>}
      </div>
    </div>
  );
}
