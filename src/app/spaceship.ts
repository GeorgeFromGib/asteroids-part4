
import P5, { Vector } from "p5";
import { Actor, Model } from "./actor";

export class Spaceship extends Actor {
  _shipHeading:number=0;
  

  constructor(model:Model) {
    super(model);
  }

  public thrust=()=> {
    const force=Vector.fromAngle(this.heading- Math.PI/2);
    force.mult(0.1);
    this.velocity.add(force);
  }

  public update=(deltaTime:number)=> {
    this.velocity.mult(0.995);
    super.update(deltaTime);
  }
  
}
