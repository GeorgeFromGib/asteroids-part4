
import { AsteroidsManager } from './../managers/asteroidsManager';
import { PlayerShipManager, ShipTurn } from "../managers/playerShipManager";
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameOverState } from "./GameOverState";
import { GameState } from "./GameState";

export class PlayGameState extends GameState {
  player: PlayerShipManager;
  asteroidsMan:AsteroidsManager;
  timer:GameTimer;
  mylevel:number=1;
  dummy:string="Hello";
  saucerTimer: GameTimer;


  public setup() {
    this.asteroidsMan=this.gameEngine.asteroidsManager;
    //this.newLevel(this);
    this.timer=this.gameEngine.createTimer(2000,()=>{this.newLevel()});
    this.player = this.gameEngine.playerManager;
    this.player.placeShipInSafeSpace(this.gameEngine.screenSize.center);
    this.saucerTimer = this.gameEngine.createTimer(4000, () => {
      this.gameEngine.saucerManager.createSaucer();
    });
  }

  public update(timeDelta: number) {
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
    if(this.asteroidsMan.levelCompleted && !this.gameEngine.saucerManager.saucer && this.timer.expired) {
      this.timer.restart();
    }
    if (this.gameEngine.asteroidsManager.asteroids.length < 4) {
      if (!this.gameEngine.saucerManager.saucer && this.saucerTimer.expired) {
        this.saucerTimer.time = this.gameEngine.randomRange(10000, 15000);
        this.saucerTimer.restart();
      }
    }
  }

  public newLevel(){
    //that.mylevel;
    console.log(this.mylevel);
    this.asteroidsMan.startLevel(1);
  }

  public handleKeyPress(key: Keys) {
    if (key == Keys.RIGHT_ARROW)
      this.player.turn(ShipTurn.RIGHT);
    if (key == Keys.LEFT_ARROW)
      this.player.turn(ShipTurn.LEFT);
    if (key == Keys.UP_ARROW)
      this.player.engine(true);
    if (key == Keys.SPACE)
      this.player.fire(true);
    if(key==Keys.RIGHT_CTRL)
      this.player.hyperSpace();
  }

  public handleKeyRelease(key: Keys) {
    if (key == Keys.RIGHT_ARROW || key == Keys.LEFT_ARROW)
      this.player.turn(ShipTurn.STOP);
    if (key == Keys.UP_ARROW)
      this.player.engine(false);
    if (key == Keys.SPACE)
      this.player.fire(false);
  }

  public nextState() {
    this.player.showShip(false);
    //this.level=0;
    this.gameEngine.gameState = new GameOverState(this.gameEngine);
  }
}
