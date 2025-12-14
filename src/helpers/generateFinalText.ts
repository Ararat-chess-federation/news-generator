import { IPlayer, IPrizes } from "../models/player";

export default function generateFinalText(
  selectedPlace: string,
  selectedTournament: string,
  players: IPlayer[],
  prizes: IPrizes
) {
  const { first, second, third, girl } = prizes;

  const intro = generateIntro(selectedPlace, selectedTournament);
  const categoryPlayers = generateCategoryPlayers(players);
  const prizersIntro = "Մրցանակային տեղ գրաված մասնակիցներն են՝";
  const bestGirl = generatePrizer(girl, "Լավագույն աղջիկ` ");
  const thirdPlace = generatePrizer(third, "3-րդ տեղ` ");
  const secondPlace = generatePrizer(second, "2-րդ տեղ` ");
  const firstPlace = generatePrizer(first, "Մրցաշարի հաղթող` ");
  const epilog = selectedPlace && secondPlace ? "Շնորհավորում ենք մրցանակակիրներին և մաղթում նորանոր հաջողություններ:" : "";


  return `${intro}\n${categoryPlayers}\n${prizersIntro}\n${bestGirl}\n${thirdPlace}\n${secondPlace}\n${firstPlace}\n${epilog}`;
}

function generateIntro(selectedPlace: string, selectedTournament: string) {
  if (!selectedPlace && !selectedTournament) {
    return ""
  }

  return `${selectedPlace}ում ավարտվեց ${selectedTournament}ը։`;
}

function generateCategoryPlayers(players: IPlayer[]) {
  if (!players.length || !players[0].player) {
    return "";
  }

  return `Կարգեր լրացրած մասնակիցներն են՝\n${players.map((el) => generatePrizer(el)).join("\n")}`;
}

function generatePrizer(prizer: IPlayer, prize: string = "") {
  const { player, trainer, points } = prizer;
  if (!player) {
    return "";
  }

  const playerPoints = points ? `${points} միավորով` : "";

  let text = `${playerPoints} ${prize}${player}`;

  if (trainer) {
    const nameDataArr = trainer.split("/")
    const name = nameDataArr[nameDataArr.length - 1]
    if (nameDataArr.length > 1) {
      text += ` (մարզիչ՝ ${name})`;
    }
  }

  return `${text}:\n`;
}
