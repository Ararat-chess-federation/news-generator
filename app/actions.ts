"use server";

import { getFinishedTournaments, getHtml, getTournaments } from "../src/helpers/extractData";
import { createDraftPost, findExistingPost, getNewsKey, getRecentPosts, isFacebookConfigured } from "../src/helpers/facebook";
import { generateCombinedText, generateTournamentText } from "../src/helpers/generateNewsText";
import type { ISaveDraftResult } from "../src/models/facebook";
import type { ITournament } from "../src/models/tournament";

export async function saveFacebookDraft(links: string[]): Promise<ISaveDraftResult> {
  if (!isFacebookConfigured()) {
    return { status: "error", message: "Facebook-ը կարգավորված չէ (FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN)" };
  }

  if (!Array.isArray(links) || links.length < 1 || links.length > 2 || !links.every((l) => typeof l === "string")) {
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

    const key = getNewsKey(finished);
    const duplicate = await findExistingPost(key, await getRecentPosts());
    if (duplicate) {
      return { status: "duplicate", message: "Այս նորությունն արդեն կա Facebook էջում", postId: duplicate.id };
    }

    const postId = await createDraftPost(text, key);
    return { status: "created", message: "Սևագիրը պահպանված է Facebook էջում", postId };
  } catch (error) {
    console.error("Failed to save Facebook draft", error);
    return { status: "error", message: error instanceof Error ? error.message : "Անհայտ սխալ" };
  }
}
