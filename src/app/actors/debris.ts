import { VerticedShapeActor } from './base/VerticedShapeActor';
import { Vector } from 'p5';
import { IModel } from './base/actor';


export class Debris extends VerticedShapeActor {
    constructor(model: IModel, pos: Vector, vel: Vector, heading:number) {
        super(model);
        this.position = pos;
        this.velocity = vel;
        this.heading=heading;
    }
}
