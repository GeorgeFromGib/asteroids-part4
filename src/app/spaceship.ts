import P5, { Vector } from "p5";
import { GameObject, Model } from "./gameObject";

export class Spaceship extends GameObject {
  _shipHeading:number=0;
  

  constructor() {
    super({
      vertexes:[
        [0,-10],
        [8,10],
        [4,6],       
        [-4,6],
        [-8,10],
      ],
      vertices:[
        [0,1],
        [1,2],
        [2,3],
        [3,4],
        [4,0],
      ]
    });
  }

  public thrust=()=> {
    const force=Vector.fromAngle(this._heading- Math.PI/2);
    force.mult(0.1);
    this._velocity.add(force);
  }

  public update=(p5:P5, deltaTime:number)=> {
    this._velocity.mult(0.995);
    super.update(p5,deltaTime);
  }
  
}
