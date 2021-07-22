import { Justify } from "../managers/textManager";
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameState } from "./GameState";
import { PlayGameState } from "./PlayGameState";

export class InitialGameState extends GameState {
  showPlayer: boolean = false;
  timer: GameTimer;

  public setup() {
    this.gameEngine.scoresManager.score=0;
    this.gameEngine.scoresManager.lives = this.gameEngine.configData.settings.lives;
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.textManager.write(
      "init",
      "1 COIN 1 PLAY",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 4 * 3,
      2.3,
      Justify.CENTER
    );
    this.timer = this.gameEngine.createTimer(2000);
  }

  public handleKeyPress(key: Keys) {
    if (key === Keys.SPACE)
      this.startShowPlayer();
  }

  public handleKeyRelease(key: Keys) { }

  nextState() {
    this.cleanUp();
    this.gameEngine.gameState = new PlayGameState(this.gameEngine);
  }

  public update(timeDelta: number) {
    if (this.showPlayer) {
     if(this.timer._expired)
        this.nextState();
    }
  }

  private startShowPlayer() {
    if (this.showPlayer)
      return;
    this.gameEngine.textManager.write(
      "init",
      "PLAYER 1",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 4,
      2.3,
      Justify.CENTER
    );
    this.showPlayer = true;
    this.timer.start();
  }

  public cleanUp() {
    this.gameEngine.asteroidsManager.clear();
    this.gameEngine.textManager.clear("init");
  }
}
