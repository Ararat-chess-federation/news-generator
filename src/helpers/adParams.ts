import { readFile } from "node:fs/promises";
import path from "node:path";
import { AD_IMAGES } from "../constants/adImages";
import { days, months, places, tournaments } from "../constants/selectOptions";
import type { INewsKey } from "../models/facebook";
import type { IAdParams } from "../models/ad";
import { extractCategory, normalize } from "./facebook";
import generateAdText from "./generateAdText";

const TIME_PATTERN = /^\d{2}:\d{2}$/;
const PHONE_PATTERN = /^[\d\s+()-]{0,20}$/;

export function isValidAd(ad: unknown): ad is IAdParams {
    if (!ad || typeof ad !== "object") {
        return false;
    }

    const { place, tournament, days: adDays, months: adMonths, times, deadlineMonth, deadlineDay, phone } = ad as IAdParams;
    const rounds = Array.isArray(adDays) ? adDays.length : 0;

    return places.includes(place)
        && tournaments.includes(tournament)
        && rounds >= 1 && rounds <= 15
        && Array.isArray(adMonths) && adMonths.length === rounds
        && Array.isArray(times) && times.length === rounds
        && adDays.every((day) => days.includes(day))
        && adMonths.every((month) => months.includes(month))
        && times.every((time) => typeof time === "string" && TIME_PATTERN.test(time))
        && months.includes(deadlineMonth)
        && days.includes(deadlineDay)
        && typeof phone === "string" && PHONE_PATTERN.test(phone);
}

export function generateAdFromParams(ad: IAdParams) {
    return generateAdText(
        ad.place,
        ad.tournament,
        ad.days,
        ad.months,
        ad.times,
        ad.deadlineMonth,
        ad.deadlineDay,
        ad.phone
    );
}

export function getAdKey(ad: IAdParams): INewsKey {
    return {
        type: "ad",
        place: normalize(ad.place).split(" ")[0],
        category: extractCategory(ad.tournament),
        terms: [normalize(`${ad.months[0]}ի ${ad.days[0]}-ից`), "ժամանակացույց"],
    };
}

export async function readDefaultAdImage(ad: IAdParams): Promise<File | undefined> {
    const imagePath = AD_IMAGES[ad.tournament];
    if (!imagePath) {
        return undefined;
    }

    const fileName = path.basename(imagePath);
    try {
        const content = await readFile(path.join(process.cwd(), "public", "ad-images", fileName));
        const type = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
        return new File([content], fileName, { type });
    } catch {
        return undefined;
    }
}
