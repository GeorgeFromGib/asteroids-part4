import { VerticedShapeActor } from './base/VerticedShapeActor';
import { ISpaceShip } from './../managers/playerShipManager';
import { Vector } from "p5";
import { ClosedShapeActor } from "./base/ClosedShapeActor";
import { ShipTurn } from '../managers/playerShipManager';

export class Spaceship extends VerticedShapeActor {
  protected _shipHeading:number=0;
  thrusting:boolean;
  engineThrust:ClosedShapeActor


  constructor(protected shipData:ISpaceShip) {
    super(shipData.ship);
    this.engineThrust=new ClosedShapeActor(shipData.thrust)
    this.addChildActor(this.engineThrust,new Vector().set(0,7))
  }

  public turn(turn:ShipTurn) {
    this.rotationVel = this.shipData.rotationVel * turn;
  }

  public thrust() {
    const force=Vector.fromAngle(this.heading- Math.PI/2);
    force.mult(this.shipData.thrustVel);
    this.velocity.add(force);

  }

  public update=(timeDelta:number)=> {
    if(this.thrusting) this.thrust();
    this.engineThrust.show=this.thrusting;
    this.velocity.mult(this.shipData.friction);
    super.update(timeDelta);
  }
 
}

