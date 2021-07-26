
import { Vector } from 'p5';
import { PointActor } from "./base/PointActor";

export class Particle extends PointActor {

    constructor(pos:Vector,vel:Vector) {
        super({vertexes:[],vertices:[],radius:1});
        this.position=pos;
        this.velocity=vel;
    }

}

