import P5, { Vector } from "p5";

export interface Model {
    vertexes:number[][];
    vertices:number[][];
}

export class Actor {
    protected _transModel:Model;
    public position: Vector;
    public heading: number=0;
    public scale: number=1;
    public velocity:Vector=new Vector().set(0,0);
    public rotationVel:number=0;

    constructor(protected _model:Model) {
        this._transModel={
            vertexes:[],
            vertices:this._model.vertices
        }
    }
  
    public positionXY = (x:number, y:number) => {
        this.position=new Vector().set(x,y);
    }

    public rotateBy=(angle:number)=> {
      this.heading+=angle;
    }
  
    public update(p5: P5, timeDelta:number) {
      this.position.add(this.velocity);
      this.heading+=this.rotationVel;
      this._transModel.vertexes=[];
      this._model.vertexes.forEach((av) => {
        let v = p5.createVector(av[0],av[1])
        v.mult(this.scale);
        v.rotate(this.heading);
        v.add(this.position);
        this._transModel.vertexes.push([v.x,v.y]);
      });
    }
  
    public render(p5: P5) {
      p5.push();
      this._transModel.vertices.forEach(v=>{
          const vx1=this._transModel.vertexes[v[0]];
          const vx2=this._transModel.vertexes[v[1]];
          p5.line(vx1[0],vx1[1],vx2[0],vx2[1]);
      })
      p5.pop();
    }
}