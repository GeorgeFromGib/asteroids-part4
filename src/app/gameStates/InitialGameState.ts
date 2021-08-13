
import { Justify } from "../components/text/textManager";
import { Keys } from "./../asteroidsGame";
import { GameTimer } from "../gameTimer";
import { GameStateBase } from "../shared/gameStates/base/gameStateBase";
import { PlayGameState } from "./PlayGameState";

export class InitialGameState extends GameStateBase {
  showPlayer: boolean = false;
  timer: GameTimer;
  flashTime:GameTimer;
  flash:boolean=true;

  public setup() {
    this.gameEngine.scoresManager.score=0;
    this.gameEngine.scoresManager.lives = this.gameEngine.configData.settings.lives;
    this.gameEngine.asteroidsManager.createAsteroids(10);
    this.gameEngine.textManager.write(
      "init",
      "PUSH START",
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 4 ,
      2.3,
      Justify.CENTER
    );
    this.timer = this.gameEngine.createTimer(2000);
    this.flashTime=this.gameEngine.createTimer(1000,()=>{this.flashText()})
    this.flashTime.restart();
  }

  public update(timeDelta: number) {
    if (this.showPlayer) {
     if(this.timer.expired)
        this.nextState();
    }
  }

  public flashText() {
    this.gameEngine.textManager.show("init",this.flash)
    this.flash=!this.flash;
    this.flashTime.restart();
  }

  public handleKeyPress(key: Keys) {
    if (key === Keys.SPACE)
      this.startShowPlayer();
  }

  public handleKeyRelease(key: Keys) { }

  nextState() {
    this.gameEngine.asteroidsManager.clear();
    this.gameEngine.textManager.clear("init");
    this.gameEngine.gameState = new PlayGameState(this.gameEngine);
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

}
