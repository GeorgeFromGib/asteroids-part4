import P5, { Vector } from "p5";

export interface Model {
    vertexes:number[][];
    vertices:number[][];
}

export class GameObject {
    protected _transModel:Model;
    protected _position: Vector;
    protected _heading: number=0;
    protected _scale: number=1;
    protected _velocity:Vector=new Vector().set(0,0);

    constructor(protected _model:Model) {
        this._transModel={
            vertexes:[],
            vertices:this._model.vertices
        }
    }
  
    public setPositionVector = (pos: Vector) => {
      this._position = pos;
    };

    public setPositionXY = (x:number, y:number) => {
        this.setPositionVector(new Vector().set(x,y));
      };
  
    public setHeading = (angle: number) => {
      this._heading = angle;
    };

    public setRotateBy=(angle:number) => {
      this._heading+=angle;
    }
  
    public setScale = (scale: number) => {
      this._scale = scale;
    };
  
    public update(p5: P5, timeDelta:number) {
      this._position.add(this._velocity);

      this._transModel.vertexes=[];
      this._model.vertexes.forEach((av) => {
        let v = p5.createVector(av[0],av[1])
        v.mult(this._scale);
        v.rotate(this._heading);
        v.add(this._position);
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