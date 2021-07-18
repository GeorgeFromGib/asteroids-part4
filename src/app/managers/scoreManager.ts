import { Manager } from "./manager";
import { AsteroidsGame } from "../asteroidsGame";
import { IModel } from "../actors/base/actor";
import { ClosedShapeActor } from "../actors/base/ClosedShapeActor";
import { Justify } from "./textManager";

export class ScoresManager extends Manager {
  score: number = 0;
  protected _lives: number;
  nextLife: number = 1000;
  protected shipModel: IModel;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.shipModel = gameEngine.configData.spaceship.ship;
    this.lives = gameEngine.configData.settings.lives;
    this.addToScore(0);
  }

  public update(timeDelta: number) {
    this.checkForExtraLife();
    super.update(timeDelta);
  }

  public set lives(n: number) {
    this._lives = n;
    this.showLives();
  }

  public get lives(): number {
    return this._lives;
  }

  public showLives() {
    this._actors = [];
    let xpos = this.gameEngine.screenSize.width / 4 - 54;
    for (let i = 0; i < this._lives; i++) {
      const ship = new ClosedShapeActor(this.shipModel);
      ship.positionXY(xpos, 45);
      xpos += ship.radius + 6;
      this._actors.push(ship);
    }
  }

  public addToScore(points: number) {
    const xpos = this.gameEngine.screenSize.width / 4;
    this.score += points;
    this.gameEngine.textManager.write(
      "score",
      this.score.toString().padStart(2, "0"),
      xpos,
      17,
      2.3,
      Justify.RIGHT
    );
  }

  private checkForExtraLife() {
    if (this.score > this.nextLife) {
      this.nextLife += this.gameEngine.configData.settings.extraLife;
      this.lives++;
    }
  }
}
