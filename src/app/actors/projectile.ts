import P5, { Vector } from 'p5';
import { Actor } from "./actor";

export class Projectile extends Actor {
    lifeTime:number=2000;
    expired:boolean=false;

    constructor(pos:Vector,vel:Vector) {
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

    public render(p5: P5) {
        p5.strokeWeight(3);
        p5.point(this.position.x,this.position.y);
    }
}