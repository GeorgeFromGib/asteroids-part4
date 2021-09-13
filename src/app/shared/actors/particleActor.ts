import { AsteroidsGame } from '../../asteroidsGame';
import { Vector2D } from '../../vector2d';
import { ExpiringActor } from './base/expiringActor';

export class ParticleActor extends ExpiringActor {

    constructor(pos:Vector2D,vel:Vector2D,lifeTime: number = 1000) {
        const model={vertexes:[],vertices:[],radius:1}
        super(model,lifeTime);
        this.position=pos;
        this.velocity=vel;
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawPoint(this.position.x, this.position.y);
    }

}