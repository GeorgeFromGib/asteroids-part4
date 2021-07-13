import { AsteroidsGame } from "./../asteroidsGame";
import P5, { Vector } from "p5";

export interface IModel {
  vertexes: number[][];
  vertices: number[][];
  radius: number;
}

export class Actor {
  protected _transModel: IModel;
  public position: Vector= new Vector().set(0, 0);
  public heading: number = 0.0;
  public scale: number = 1.0;
  public velocity: Vector = new Vector().set(0, 0);
  public rotationVel: number = 0.0;
  public collidedWith: Actor;
  public radius: number = 0;
  public show: boolean = true;
  public parent: Actor;
  public parentOffset: Vector;

  constructor(protected _model: IModel) {
    this._transModel = {
      vertexes: [],
      vertices: this._model.vertices,
      radius: this._model.radius,
    };
    this.radius = this._transModel.radius;
  }

  public setParent(parent:Actor, offset:Vector) {
    this.parent=parent;
    this.parentOffset=offset;
  }

  public positionXY = (x: number, y: number) => {
    this.position = new Vector().set(x, y);
  };

  public rotateBy = (angle: number) => {
    this.heading += angle;
  };

  public edgeWrap = (screen_width: number, screen_height: number) => {
    if (this.position.x > screen_width + this._model.radius)
      this.position.x = -this._model.radius;
    else if (this.position.x < -this._model.radius)
      this.position.x = screen_width + this._model.radius;

    if (this.position.y > screen_height + this._model.radius)
      this.position.y = -this._model.radius;
    else if (this.position.y < -this._model.radius)
      this.position.y = screen_height + this._model.radius;
  };

  public hasCollided(otherActors: Actor[]): Actor {
    this.collidedWith = undefined;
    otherActors.forEach((actor) => {
      if (this.position.dist(actor.position) < actor.radius + this.radius) {
        if (this != actor) {
          this.collidedWith = actor;
          return;
        }
      }
    });
    return this.collidedWith;
  }

  public update(timeDelta: number) {
    this.radius = this._model.radius * this.scale;
    this.position.add(this.velocity);
    this.heading += this.rotationVel;
    this._transModel.vertexes = [];
    this._model.vertexes.forEach((av) => {
      let v = new Vector().set(av[0], av[1]);
      v.mult(this.scale);
      if(!this.parent) {
        v.rotate(this.heading);
        v.add(this.position);
      }
      else{
        v.add(this.parentOffset)
        v.rotate(this.parent.heading);
        v.add(this.parent.position);
      }
      this._transModel.vertexes.push([v.x, v.y]);
    });
  }

  public render(gameEngine: AsteroidsGame) {
    if (!this.show) return;

    if (this._transModel.vertices.length == 0)
      gameEngine.drawClosedShape(this._transModel);
    else 
      gameEngine.drawVerticedShape(this._transModel);
    // p5.noFill();
    // p5.circle(this.position.x,this.position.y,this.radius*2);
  }
}
