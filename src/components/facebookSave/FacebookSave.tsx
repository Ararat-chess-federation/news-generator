"use client";

import { useRef, useState, useTransition } from "react";
import { SESSION_HINT_COOKIE } from "../../constants/session";
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

function hasSession() {
  return document.cookie.split("; ").includes(`${SESSION_HINT_COOKIE}=1`);
}

function openPendingTab() {
  const tab = window.open("", "_blank");
  if (tab) {
    tab.opener = null;
    tab.document.title = "Facebook";
    tab.document.body.textContent = "Պահպանվում է...";
  }
  return tab;
}

export default function FacebookSave({ status, postUrl, postedAt, onSave, onSaved }: IFacebookSaveProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const tabRef = useRef<Window | null>(null);

  const closeTab = () => {
    tabRef.current?.close();
    tabRef.current = null;
  };

  const save = () => {
    setError("");
    startTransition(async () => {
      const result = await onSave();
      if (result.status === "unauthorized") {
        closeTab();
        setNeedsLogin(true);
        return;
      }
      if (result.status === "error") {
        closeTab();
        setError(result.message);
        return;
      }
      if (tabRef.current && result.postUrl) {
        tabRef.current.location.href = result.postUrl;
        tabRef.current = null;
      } else {
        closeTab();
      }
      onSaved(result);
    });
  };

  const handleSave = () => {
    if (!hasSession()) {
      setNeedsLogin(true);
      return;
    }
    tabRef.current = openPendingTab();
    save();
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
            onStart={() => {
              tabRef.current = openPendingTab();
            }}
            onFailure={closeTab}
            onSuccess={() => {
              setNeedsLogin(false);
              save();
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
