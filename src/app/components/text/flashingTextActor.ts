import { AsteroidsGame } from "../../asteroidsGame";
import { IModel } from "../../shared/interfaces/iConfig";
import { TextActor } from "./textActor";


export class FlashingTextActor extends TextActor {
    private _pulseCounter:number=0;
    private _flash:boolean=true;

    constructor(model: IModel, private pulseDelay: number) {
        super(model);
    }

    public update(timeDela: number) {
        this._pulseCounter-=timeDela;
        if(this._pulseCounter<=0) {
            this._flash=!this._flash;
            this._pulseCounter=this.pulseDelay;
        }
        super.update(timeDela);
    }

    public render (gameEngine:AsteroidsGame) {
        if(!this._flash) return;
        super.render(gameEngine)
    }
}
