import { PlayerShipManager, ShipTurn } from "../managers/playerShipManager";
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameOverState } from "./GameOverState";
import { GameState } from "./GameState";

export class PlayGameState extends GameState {
  player: PlayerShipManager;
  timer: GameTimer;
  shipHidden=true;

  public setup() {
    this.newLevel();
    this.gameEngine.playerManager.createShip();
    this.player = this.gameEngine.playerManager;
    this.timer=this.gameEngine.createTimer(2000,()=>{this.newLevel()});
  }

  public update(timeDelta: number) {
    if(!this.player.ship.show)
      this.showShip();
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
    if(this.gameEngine.asteroidsManager.levelCompleted && this.timer.expired) {
      this.timer.restart();
    }

  }

  public showShip() {
    const ctrPos=this.gameEngine.screenSize.center;
    const safeRadius=60;
    let show=false;
    while(!show) {
      this.gameEngine.asteroidsManager.asteroids.forEach(asteroid=>{
        show=ctrPos.dist(asteroid.position)>safeRadius;
        if(!show) return;
      })
    }
    this.gameEngine.playerManager.showShip(true);
  }

  public newLevel() {
    this.gameEngine.asteroidsManager.startLevel();
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
    this.gameEngine.gameState = new GameOverState(this.gameEngine);
  }
}
