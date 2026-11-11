"use server";

import { generateAdFromParams, getAdKey, isValidAd, readDefaultAdImage } from "../src/helpers/adParams";
import { getFinishedTournaments, getHtml, getTournaments } from "../src/helpers/extractData";
import {
  createDraftPost,
  findExistingPost,
  formatPostDate,
  getNewsKey,
  getPostUrl,
  getRecentPosts,
  isFacebookConfigured,
  toFacebookStatus,
} from "../src/helpers/facebook";
import { generateCombinedText, generateTournamentText } from "../src/helpers/generateNewsText";
import { isAuthenticated } from "../src/helpers/session";
import type { IAdParams } from "../src/models/ad";
import type { IFacebookStatus, INewsKey, ISaveDraftResult } from "../src/models/facebook";
import type { ITournament } from "../src/models/tournament";

const NOT_CONFIGURED = "Facebook-ը կարգավորված չէ (FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN)";
const UNAUTHORIZED = "Սեսիան ավարտվել է, թարմացրեք էջը և մուտք գործեք կրկին";

async function saveDraft(text: string, key: INewsKey, images: File[] = []): Promise<ISaveDraftResult> {
  const existing = await findExistingPost(key, await getRecentPosts());
  if (existing) {
    const { postId, postUrl, postedAt } = toFacebookStatus(existing);
    return { status: "duplicate", message: "Այս նորությունն արդեն կա Facebook էջում", postId, postUrl, postedAt };
  }

  const postId = await createDraftPost(text, key, images);
  return {
    status: "created",
    message: "Սևագիրը պահպանված է Facebook էջում",
    postId,
    postUrl: getPostUrl("draft", postId),
    postedAt: formatPostDate(new Date()),
  };
}

function toErrorResult(error: unknown): ISaveDraftResult {
  console.error("Failed to save Facebook draft", error);
  return { status: "error", message: error instanceof Error ? error.message : "Անհայտ սխալ" };
}

export async function saveFacebookDraft(links: string[]): Promise<ISaveDraftResult> {
  if (!(await isAuthenticated())) {
    return { status: "error", message: UNAUTHORIZED };
  }

  if (!isFacebookConfigured()) {
    return { status: "error", message: NOT_CONFIGURED };
  }

  if (!Array.isArray(links) || links.length < 1 || links.length > 2 || !links.every((link) => typeof link === "string")) {
    return { status: "error", message: "Սխալ հարցում" };
  }

  try {
    const tournaments = getTournaments(await getHtml());
    const selected = links.map((link) => tournaments.find((t) => t.link === link));
    if (selected.some((t) => !t)) {
      return { status: "error", message: "Մրցաշարը չի գտնվել" };
    }

    const finished = await getFinishedTournaments(selected as ITournament[]);
    if (finished.length !== selected.length) {
      return { status: "error", message: "Մրցաշարը դեռ ավարտված չէ" };
    }

    const text = finished.length === 2
      ? generateCombinedText(finished as [ITournament, ITournament])
      : generateTournamentText(finished[0]);

    return await saveDraft(text, getNewsKey(finished));
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function saveAdDraft(ad: IAdParams): Promise<ISaveDraftResult> {
  if (!(await isAuthenticated())) {
    return { status: "error", message: UNAUTHORIZED };
  }

  if (!isFacebookConfigured()) {
    return { status: "error", message: NOT_CONFIGURED };
  }

  if (!isValidAd(ad)) {
    return { status: "error", message: "Հայտարարության տվյալները սխալ են" };
  }

  try {
    const defaultImage = await readDefaultAdImage(ad);
    return await saveDraft(generateAdFromParams(ad), getAdKey(ad), defaultImage ? [defaultImage] : []);
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function checkAdStatus(ad: IAdParams): Promise<IFacebookStatus> {
  if (!(await isAuthenticated())) {
    return { configured: true, status: "unknown", error: UNAUTHORIZED };
  }

  if (!isFacebookConfigured()) {
    return { configured: false, status: "unknown" };
  }

  if (!isValidAd(ad)) {
    return { configured: true, status: "unknown" };
  }

  try {
    return toFacebookStatus(await findExistingPost(getAdKey(ad), await getRecentPosts()));
  } catch (error) {
    console.error("Failed to check Facebook ad status", error);
    return { configured: true, status: "unknown", error: error instanceof Error ? error.message : String(error) };
  }
}
