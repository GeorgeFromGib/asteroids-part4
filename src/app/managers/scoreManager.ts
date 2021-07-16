
import { Manager } from "./manager";
import { AsteroidsGame } from "../asteroidsGame";
import { Actor, IModel } from "../actors/base/actor";
import { ClosedShapeActor } from "../actors/base/ClosedShapeActor";


export class ScoresManager extends Manager {
  score: number = 0;
  protected _lives:number;
  nextLife:number=10000

  constructor(gameEngine: AsteroidsGame,protected shipModel:IModel) {
    super(gameEngine);
    this.addToScore(0);
    this.lives=gameEngine.settings.lives;
  }

  public update(timeDelta:number) {
      this.checkForExtraLife();
      super.update(timeDelta);
  }

  
  public set lives(n : number) {
      this._lives=n;
      this.showLives();
  }
  
  public get lives() : number {
      return this._lives;
  }
  

  public showLives() {
    this._actors=[];
    let xpos=190
    for(let i=0;i<this._lives;i++) {
        const ship=new ClosedShapeActor(this.shipModel);
        ship.positionXY(xpos,45);
        xpos+=ship.radius+6;
        this._actors.push(ship);
    }
    
  }

  public addToScore(points: number) {
    this.score += points;
    this.gameEngine._textManager.write(
      "score",
      this.score.toString().padStart(2,'0'),
      250,
      17,
      2.3
    );
  }


  private checkForExtraLife() {
    if(this.score>this.nextLife) {
        this.nextLife+=this.gameEngine.settings.extraLife;
        this.lives++;
    }
}

}


