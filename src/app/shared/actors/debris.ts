
import { Vector } from 'p5';
import { IModel } from './base/actorBase';
import { AsteroidsGame } from '../../asteroidsGame';
import { ExpiringActor } from './base/expiringActor';


export class Debris extends ExpiringActor{
    constructor(model: IModel, pos: Vector, vel: Vector, heading:number,lifeTime: number = 1000) {
        super(model,lifeTime);
        this.position = pos;
        this.velocity = vel;
        this.heading=heading;
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawVerticedShape(this._transModel);
      }
}
