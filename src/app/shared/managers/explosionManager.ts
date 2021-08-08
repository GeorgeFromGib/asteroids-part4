
import { Vector } from "p5";
import { Actor, IModel } from "../actors/base/actor";
import { Particle } from "../actors/particle";
import { AsteroidsGame } from "../../asteroidsGame";
import { Manager } from "./manager";
import { Debris } from "../actors/debris";

export class ExplosionManager extends Manager {
  particles: Particle[]=[] ;
  debris:Particle[]=[];

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
  }

  public update(timeDelta: number) {
    this.particles = this.particles.filter((p) => !p.expired);
    this.debris = this.debris.filter((p) => !p.expired);

    this._actors = [];
    this._actors.push(...this.particles);
    this._actors.push(...this.debris);
    super.update(timeDelta);
  }

  public createExplosion(position: Vector) {
    for (let i = 0; i < 10; i++) {
      const vel = Vector.random2D().mult((this.gameEngine.randomRange(20,70))/1000);
      const life=this.gameEngine.randomRange(300,700);
      const particle = new Particle(position.copy(), vel,life);
      this.particles.push(particle);
     }  
  }

  public createShipExplosion(shipModel:IModel,ship:Actor) {
    const vertexes=shipModel.vertexes;
    shipModel.vertices.forEach(vert=>{
      const model:IModel={vertexes:[vertexes[vert[0]],vertexes[vert[1]]],vertices:[[0,1]],radius:1}
      const vel=Vector.random2D().mult((this.gameEngine.randomRange(20,40))/1000)
      const debris=new Debris(model,ship.position.copy(),vel,ship.heading);
      this.debris.push(debris);
    })
  }
}
