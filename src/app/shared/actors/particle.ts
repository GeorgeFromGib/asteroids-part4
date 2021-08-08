
import { Vector } from 'p5';
import { AsteroidsGame } from '../../asteroidsGame';
import { ExpiringActor } from './base/expiringActor';

export class Particle extends ExpiringActor {

    constructor(pos:Vector,vel:Vector,lifeTime: number = 1000) {
        super({vertexes:[],vertices:[],radius:1},lifeTime);
        this.position=pos;
        this.velocity=vel;
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawPoint(this.position.x, this.position.y);
      }

}

