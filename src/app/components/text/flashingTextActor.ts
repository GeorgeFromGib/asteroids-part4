import { AsteroidsGame } from "../../asteroidsGame";
import { GameTimer } from "../../gameTimer";
import { IModel } from "../../shared/interfaces/iConfig";
import { TextActor } from "./textActor";


export class FlashingTextActor extends TextActor {
    private _flash:boolean=true;
    flashTimer: GameTimer;

    constructor(model: IModel, private pulseDelay: number) {
        super(model);
        this.flashTimer=new GameTimer(pulseDelay)
    }

    public update(timeDela: number) {
        if(this.flashTimer.expired) {
            this._flash=!this._flash
            this.flashTimer.restart();
        }
        super.update(timeDela);
    }

    public render (gameEngine:AsteroidsGame) {
        if(!this._flash) return;
        super.render(gameEngine)
    }
}
