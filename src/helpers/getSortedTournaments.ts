import { ITournament } from "../models/tournament";
import { parseTournamentTitle } from "./parseTournamentTitle";

export default function getSortedTournaments(finishedTournaments: ITournament[]) {
    const combinedIndex = finishedTournaments.findIndex(t => t.title.includes('առանց տարիքային սահմանափակման'));
    let combinedTournaments: ITournament[] = [];
    let regularTournaments: ITournament[] = [];

    if (combinedIndex !== -1) {
        const combinedTournament = finishedTournaments[combinedIndex];
        const { place } = parseTournamentTitle(combinedTournament.title);
        const pairIdx = finishedTournaments.findIndex(
            (t, idx) => idx !== combinedIndex && t.title.includes(place)
        );

        combinedTournaments = [combinedTournament, finishedTournaments[pairIdx]];
        regularTournaments = finishedTournaments.filter(
            (_, idx) => idx !== combinedIndex && idx !== pairIdx
        );
    } else {
        regularTournaments = finishedTournaments;
    }
    
    return { combinedTournaments, regularTournaments }
}