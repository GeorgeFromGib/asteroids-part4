import { PlayerShipManager, ShipTurn } from "../managers/playerShipManager";
import { Keys } from "./../asteroidsGame";
import { GameOverState } from "./GameOverState";
import { GameState } from "./GameState";

export class PlayGameState extends GameState {
  player: PlayerShipManager;

  public setup() {
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.playerManager.createShip();
    this.gameEngine.playerManager.showShip(true);
    this.player = this.gameEngine.playerManager;
  }

  public update(timeDelta: number) {
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
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
