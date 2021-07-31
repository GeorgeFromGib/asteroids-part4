
import { Vector } from 'p5';
import { Actor, IModel } from './base/actor';
import { AsteroidsGame } from '../asteroidsGame';


export class Debris extends Actor{
    constructor(model: IModel, pos: Vector, vel: Vector, heading:number) {
        super(model);
        this.position = pos;
        this.velocity = vel;
        this.heading=heading;
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawVerticedShape(this._transModel);
      }
}
