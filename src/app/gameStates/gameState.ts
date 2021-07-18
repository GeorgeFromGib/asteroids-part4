import { PlayerShipManager, ShipTurn } from "../managers/playerShipManager";
import { Justify } from "../managers/textManager";
import { AsteroidsGame, Keys } from "./../asteroidsGame";
export abstract class GameState {
  constructor(protected gameEngine: AsteroidsGame) {
    this.setup();
  }

  public abstract setup();

  public abstract update(timeDelta: number);

  public abstract handleKeyPress(key: Keys);

  public abstract handleKeyRelease(key: Keys);
}

export class InitialGameState extends GameState {
  public setup() {
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.textManager.write(
      "coin",
      "1 COIN 1 PLAY",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height - 80,
      2.3,
      Justify.CENTER
    );
  }

  public handleKeyPress(key: Keys) {
    if (key === Keys.SPACE) this.nextLevel();
  }

  public handleKeyRelease(key: Keys) {}

  nextLevel() {
    this.cleanUp();
    this.gameEngine.gameState = new PlayGameState(this.gameEngine);
  }

  public update(timeDelta: number) {}

  public cleanUp() {
    this.gameEngine.asteroidsManager.clear();
    this.gameEngine.textManager.clear("coin");
  }
}

export class PlayGameState extends GameState {
  player: PlayerShipManager;

  public setup() {
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.playerManager.createShip();
    this.player = this.gameEngine.playerManager;
  }

  public update(timeDelta: number) {}

  public handleKeyPress(key: Keys) {
    if (key == Keys.RIGHT_ARROW) this.player.turn(ShipTurn.RIGHT);
    if (key == Keys.LEFT_ARROW) this.player.turn(ShipTurn.LEFT);
    if (key == Keys.UP_ARROW) this.player.engine(true);
    if (key == Keys.SPACE) this.player.fire(true);
  }

  public handleKeyRelease(key: Keys) {
    if (key == Keys.RIGHT_ARROW || key == Keys.LEFT_ARROW)
      this.player.turn(ShipTurn.STOP);
    if (key == Keys.UP_ARROW) this.player.engine(false);
    if (key == Keys.SPACE) this.player.fire(false);
  }
}
