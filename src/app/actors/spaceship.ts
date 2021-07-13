import { AsteroidsGame } from './../asteroidsGame';

import P5, { Vector } from "p5";
import { Actor, IModel } from "./actor";

export class Spaceship extends Actor {
  _shipHeading:number=0;
  thrusting:boolean;

  constructor(model:IModel,protected engineThrust:Actor) {
    super(model);
    engineThrust.setParent(this, new Vector().set(0,7))
  }

  public thrust() {
    const force=Vector.fromAngle(this.heading- Math.PI/2);
    force.mult(0.1);
    this.velocity.add(force);

  }

  public update=(deltaTime:number)=> {
    if(this.thrusting) this.thrust();
    this.engineThrust.show=this.thrusting;
    this.velocity.mult(0.995);
    super.update(deltaTime);
  }

  
}
