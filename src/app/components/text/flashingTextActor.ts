import { IModel } from "../../shared/interfaces/iConfig";
import { TextActor } from "./textActor";


export class FlashingTextActor extends TextActor {
    private _pulseCounter:number=0;

    constructor(model: IModel, private pulseDelay: number) {
        super(model);
    }

    public update(timeDela: number) {
        // this._pulseCounter-=timeDela;
        // if(this._pulseCounter<=0) {
        //     this.show=!this.show
        //     this._pulseCounter=this.pulseDelay;
        // }
        this.update(timeDela);
    }
}
