import P5, { Vector } from 'p5';
import { Actor } from "./actor";

export class Projectile extends Actor {
    constructor(pos:Vector,vel:Vector) {
        super({vertexes:[],vertices:[],radius:1});
        this.position=pos;
        this.velocity=vel;
    }


    public render(p5: P5) {
        p5.point(this.position.x,this.position.y)
    }
}