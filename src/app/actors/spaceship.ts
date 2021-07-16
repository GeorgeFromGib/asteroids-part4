import { AsteroidsGame } from './../asteroidsGame';

import P5, { Vector } from "p5";
import { Actor, IModel } from "./base/actor";
import { ClosedShapeActor } from "./base/ClosedShapeActor";

export class Spaceship extends ClosedShapeActor {
  _shipHeading:number=0;
  thrusting:boolean;

  constructor(model:IModel,protected engineThrust:Actor) {
    super(model);
    engineThrust.setParent(this, new Vector().set(0,7))
  }

  public thrust() {
    const force=Vector.fromAngle(this.heading- Math.PI/2);
    force.mult(4/1000);
    this.velocity.add(force);

  }

  public update=(timeDelta:number)=> {
    if(this.thrusting) this.thrust();
    this.engineThrust.show=this.thrusting;
    this.velocity.mult(0.997);
    super.update(timeDelta);
  }

  
}
