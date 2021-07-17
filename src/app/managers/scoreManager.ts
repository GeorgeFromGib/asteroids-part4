
import { Manager } from "./manager";
import { AsteroidsGame } from "../asteroidsGame";
import { Actor, IModel } from "../actors/base/actor";
import { ClosedShapeActor } from "../actors/base/ClosedShapeActor";


export class ScoresManager extends Manager {
  score: number = 0;
  protected _lives:number;
  nextLife:number=1000;
  protected shipModel:IModel

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.addToScore(0);
    this.lives=gameEngine.settings.lives;
    this.shipModel=gameEngine.configData.spaceship.ship;
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
    let xpos=this.gameEngine._screenSize.width/4-54
    for(let i=0;i<this._lives;i++) {
        const ship=new ClosedShapeActor(this.shipModel);
        ship.positionXY(xpos,45);
        xpos+=ship.radius+6;
        this._actors.push(ship);
    }
    
  }

  public addToScore(points: number) {
    const xpos=this.gameEngine._screenSize.width/4
    this.score += points;
    this.gameEngine._textManager.write(
      "score",
      this.score.toString().padStart(2,'0'),
      xpos,
      17,
      2.3
    );
    this.gameEngine._textManager.write(
      "coin",
      "GAME OVER",
      this.gameEngine._screenSize.width/2,
      60,
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


