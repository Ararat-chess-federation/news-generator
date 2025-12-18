export function parseTournamentTitle(title: string): { tournament: string; place: string } {
    const [tournament, place] = title.split(',').map(part => part.trim());
    return { tournament, place };
}