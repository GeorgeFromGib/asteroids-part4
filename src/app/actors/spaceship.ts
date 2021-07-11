
import P5, { Vector } from "p5";
import { Actor, IModel } from "./actor";

export class Spaceship extends Actor {
  _shipHeading:number=0;
  thrusting:boolean=false;
  firing:boolean;
  

  constructor(model:IModel) {
    super(model);
  }

  public thrust() {
    const force=Vector.fromAngle(this.heading- Math.PI/2);
    force.mult(0.1);
    this.velocity.add(force);
  }
 

  public update=(deltaTime:number)=> {
    this.velocity.mult(0.995);
    super.update(deltaTime);
  }
  
}
