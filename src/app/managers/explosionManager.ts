import { Vector } from "p5";
import { Particle } from "../actors/particle";
import { AsteroidsGame } from "./../asteroidsGame";
import { Manager } from "./manager";

export class ExplosionManager extends Manager {
  particles: Particle[]=[] ;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
  }

  public update(timeDelta: number) {
    this.particles = this.particles.filter((p) => !p.expired);

    this._actors = [];
    this._actors.push(...this.particles);
    super.update(timeDelta);
  }

  public createExplosion(position: Vector) {
    for (let i = 0; i < 10; i++) {
      const vel = Vector.random2D().mult(this.gameEngine.random(1)+0.5);
      const life=this.gameEngine.random(500)+300
      const particle = new Particle(position.copy(), vel,life);
      this.particles.push(particle);
     }
  }
}
