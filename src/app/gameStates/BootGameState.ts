
import { Justify } from "../components/text/textManager";
import { GameStateBase } from "../shared/gameStates/base/gameStateBase";
import { InitialGameState } from "./InitialGameState";


export class BootGameState extends GameStateBase {

    public setup() {
        this.gameEngine.asteroidsManager.createAsteroids(10);
        this.gameEngine.textManager.write(
            "boot",
            "CLICK TO INITIALISE",
            this.gameEngine.screenSize.width / 2,
            this.gameEngine.screenSize.height / 4 ,
            2.3,
            Justify.CENTER,
            true,true
          );
        this.gameEngine.scoresManager.lives=0;
    }

    public update(timeDelta: number) {
        
    }

    public handleKeyMouseClick() {
        this.gameEngine.loadSounds();
        this.nextState();
    }
    public nextState() {
        this.gameEngine.textManager.clear("boot");
        this.gameEngine.asteroidsManager.clear();
        this.gameEngine.gameState = new InitialGameState(this.gameEngine);
    }
}
