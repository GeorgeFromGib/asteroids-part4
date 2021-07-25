import { Vector } from "p5";
import { IModel } from "./base/actor";
import { VerticedShapeActor } from "./base/VerticedShapeActor";

export class Debris extends VerticedShapeActor {
    expired:boolean=false;

    constructor(model:IModel,protected lifeTime:number=1000) {
        super(model);
    }

    public update(timeDelta:number) {
        this.lifeTime-=timeDelta;
        if(this.lifeTime<0)
            this.expired=true;
        super.update(timeDelta);
    }
}