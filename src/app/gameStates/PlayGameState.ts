import { AsteroidsManager } from './../managers/asteroidsManager';
import { PlayerShipManager, ShipTurn } from "../managers/playerShipManager";
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameOverState } from "./GameOverState";
import { GameState } from "./GameState";

export class PlayGameState extends GameState {
  player: PlayerShipManager;
  asteroidsMan:AsteroidsManager;
  timer: GameTimer;


  public setup() {
    this.asteroidsMan=this.gameEngine.asteroidsManager;
    this.newLevel();
    this.timer=this.gameEngine.createTimer(2000,()=>{this.newLevel()});
    this.player = this.gameEngine.playerManager;
    this.player.placeShipInSafeSpace(this.gameEngine.screenSize.center);
  }

  public update(timeDelta: number) {
   
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
    if(this.asteroidsMan.levelCompleted && this.timer.expired) {
      this.timer.restart();
    }
  }

  public newLevel() {
    this.asteroidsMan.startLevel();
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
    this.gameEngine.gameState = new GameOverState(this.gameEngine);
  }
}
