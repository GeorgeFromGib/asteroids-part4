
import { Vector } from 'p5';
import { PointActor } from "./base/PointActor";

export class Particle extends PointActor {
    expired:boolean=false;

    constructor(pos:Vector,vel:Vector,protected lifeTime=1000) {
        super({vertexes:[],vertices:[],radius:1});
        this.position=pos;
        this.velocity=vel;
    }

    public update(timeDelta:number) {
        this.lifeTime-=timeDelta;
        if(this.lifeTime<0)
            this.expired=true;
        super.update(timeDelta);
    }


}