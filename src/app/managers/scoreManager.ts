import { Manager } from "./manager";
import { AsteroidsGame } from "../asteroidsGame";

export class ScoresManager extends Manager {
  score: number = 0;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.addToScore(0);
  }


  public addToScore(points: number) {
    this.score += points;
    this.gameEngine._textManager.write(
      "score",
      this.score.toString().padStart(2,'0'),
      150,
      17,
      2.3
    );
  }
}
