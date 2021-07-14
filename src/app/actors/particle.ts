import { AsteroidsGame } from '../asteroidsGame';
import P5, { Vector } from 'p5';
import { Actor } from "./actor";

export class Particle extends Actor {
    expired:boolean=false;

    constructor(pos:Vector,vel:Vector,protected lifeTime=1000) {
        super({vertexes:[],vertices:[],radius:1},"DOT");
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