
import { Justify } from "../components/text/textManager";
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameState } from "./GameState";
import { InitialGameState } from "./InitialGameState";


export class GameOverState extends GameState {
  timer: GameTimer;

  public setup() {
    this.gameEngine.textManager.write(
      "gameover",
      "GAME OVER",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 2,
      2.3,
      Justify.CENTER);
       
      this.gameEngine.playerManager.showShip(false);
      this.timer=this.gameEngine.createTimer(5000);
      this.timer.start();
    
  }
  public update(timeDelta: number) {
    if(this.timer.expired)
      this.nextState();
  }

  public handleKeyPress(key: Keys) {
  }
  public handleKeyRelease(key: Keys) {
  }

  public nextState() {
    this.gameEngine.textManager.clear('gameover');
    this.gameEngine.asteroidsManager.clear();
    this.gameEngine.gameState = new InitialGameState(this.gameEngine);
  }
}
