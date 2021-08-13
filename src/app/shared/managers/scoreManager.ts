
import { ManagerBase } from "./base/managerBase";
import { AsteroidsGame } from "../../asteroidsGame";
import { IModel } from "../actors/base/actorBase";
import { SpaceshipActor } from "../../components/player/spaceshipActor";
import { Justify } from "../../components/text/textManager";

export class ScoresManager extends ManagerBase {
  protected nextLife: number;
  protected _score: number = 0;
  protected _bestScore: number = 0;
  protected _lives: number;
  protected _shipModel: IModel;
  protected _extraLife: number;


  public setup() {
    this._shipModel = this.gameEngine.configData.spaceship.model;
    this.lives = this.gameEngine.configData.settings.lives;
    this._extraLife = this.gameEngine.configData.settings.extraLife;
    this.nextLife = this._extraLife;
    //this._bestScore=0;
    //this.score = 0;
  }

  public update(timeDelta: number) {
    this.checkForExtraLife();
    super.update(timeDelta);
  }

  public set score(n: number) {
    this._score = n;
    this._bestScore =
      this._score > this._bestScore ? this._score : this._bestScore;
    this.writeScore();
    this.writeBestScore();
  }

  public get score(): number {
    return this._score;
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
      const ship = new SpaceshipActor(this.gameEngine.configData.spaceship);
      ship.positionXY(xpos, 45);
      xpos += ship.radius + 6;
      this._actors.push(ship);
    }
  }

  public writeScore() {
    const xpos = this.gameEngine.screenSize.width / 4;
    this.gameEngine.textManager.write(
      "score",
      this._score.toString().padStart(2, "0"),
      xpos,
      17,
      2.3,
      Justify.RIGHT
    );
  }

  public writeBestScore() {
    this.gameEngine.textManager.write(
      "bestscore",
      this._bestScore.toString().padStart(2, "0"),
      this.gameEngine.screenSize.center.x,
      17,
      1.5,
      Justify.RIGHT
    );
  }

  public addToScore(points: number) {
    this.score += points;
  }

  private checkForExtraLife() {
    if (this._score > this.nextLife) {
      this.nextLife += this._extraLife;
      this.lives++;
    }
  }
}
