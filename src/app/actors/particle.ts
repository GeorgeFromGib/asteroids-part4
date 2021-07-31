
import { Vector } from 'p5';
import { AsteroidsGame } from '../asteroidsGame';
import { Actor } from './base/actor';

export class Particle extends Actor {

    constructor(pos:Vector,vel:Vector) {
        super({vertexes:[],vertices:[],radius:1});
        this.position=pos;
        this.velocity=vel;
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawPoint(this.position.x, this.position.y);
      }

}

