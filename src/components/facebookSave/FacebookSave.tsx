"use client";

import { useEffect, useState, useTransition } from "react";
import type { ISaveDraftResult } from "../../models/facebook";
import type { NewsStatus } from "../../models/news";
import "./FacebookSave.css";

interface IFacebookSaveProps {
  status: NewsStatus;
  postUrl?: string;
  postedAt?: string;
  onSave: () => Promise<ISaveDraftResult>;
  onSaved: (result: ISaveDraftResult) => void;
  defaultImage?: string;
}

export default function FacebookSave({ status, postUrl, postedAt, onSave, onSaved, defaultImage }: IFacebookSaveProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isDefaultImageAvailable, setIsDefaultImageAvailable] = useState(false);

  useEffect(() => {
    setIsDefaultImageAvailable(false);
    if (!defaultImage) {
      return;
    }

    const image = new Image();
    image.onload = () => setIsDefaultImageAvailable(true);
    image.src = defaultImage;
  }, [defaultImage]);

  const handleSave = () => {
    setError("");
    startTransition(async () => {
      const result = await onSave();
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      onSaved(result);
    });
  };

  if (status === "draft" || status === "published") {
    return (
      <p className="fb_save_meta">
        {postedAt && <span>{postedAt}</span>}
        {postUrl && (
          <a href={postUrl} target="_blank" rel="noopener noreferrer">
            {status === "published" ? "Բացել Facebook-ում" : "Բացել Business Suite-ում"} ↗
          </a>
        )}
      </p>
    );
  }

  if (status !== "new") {
    return null;
  }

  return (
    <div className="fb_save">
      {isDefaultImageAvailable && (
        <img className="fb_save_image" src={defaultImage} alt="Լռելյայն նկար" />
      )}
      <div className="fb_save_actions">
        <button type="button" className="btn btn--facebook" onClick={handleSave} disabled={isPending}>
          {isPending ? "Պահպանվում է..." : "Պահպանել որպես Facebook սևագիր"}
        </button>
        {error && <span className="fb_save_error">{error}</span>}
      </div>
    </div>
  );
}
