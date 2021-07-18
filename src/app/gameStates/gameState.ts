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
  showPlayer: boolean=false;
  timer: number;

  public setup() {
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.textManager.write(
      "init",
      "1 COIN 1 PLAY",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height /4 * 3,
      2.3,
      Justify.CENTER
    );
  }

  public handleKeyPress(key: Keys) {
    if (key === Keys.SPACE) this.startShowPlayer();
  }

  public handleKeyRelease(key: Keys) {}

  nextLevel() {
    this.cleanUp();
    this.gameEngine.gameState = new PlayGameState(this.gameEngine);
  }

  public update(timeDelta: number) {
    if(this.showPlayer) {
      if(this.timer>0) {
        this.timer-=timeDelta;
      } else {
        this.nextLevel();
      }
    }
  }

  private startShowPlayer() {
    if(this.showPlayer) return;
    this.gameEngine.textManager.write(
      "init",
      "PLAYER 1",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 4,
      2.3,
      Justify.CENTER
    );
    this.showPlayer=true;
    this.timer=2000;
  }

  public cleanUp() {
    this.gameEngine.asteroidsManager.clear();
    this.gameEngine.textManager.clear("init");
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
