import { AsteroidsGame } from "../../asteroidsGame";
import { Vector } from "p5";

export interface IModel {
  vertexes: number[][];
  vertices: number[][];
  radius: number;
}

export abstract class Actor {
  protected _transModel: IModel;
  public position: Vector= new Vector().set(0, 0);
  public heading: number = 0.0;
  public scale: number = 1.0;
  public velocity: Vector = new Vector().set(0, 0);
  public rotationVel: number = 0.0;
  public collidedWith: Actor=undefined;
  public radius: number = 0;
  public show: boolean = true;
  public parent: Actor;
  public parentOffset: Vector;
  public childActors:Actor[]=[];

  constructor(public model: IModel) {
    this._transModel = {
      vertexes: [],
      vertices: this.model.vertices,
      radius: this.model.radius,
    };
    this.radius = this._transModel.radius;
  }

  public addChildActor(actor:Actor,offset:Vector) {
    this.childActors.push(actor);
    actor.parent=this;
    actor.parentOffset=offset;
  }

  public positionXY = (x: number, y: number) => {
    this.position = new Vector().set(x, y);
  };

  public rotateBy = (angle: number) => {
    this.heading += angle;
  };

  public edgeWrap = (screen_width: number, screen_height: number) => {
    if (this.position.x > screen_width + this.model.radius)
      this.position.x = -this.model.radius;
    else if (this.position.x < -this.model.radius)
      this.position.x = screen_width + this.model.radius;

    if (this.position.y > screen_height + this.model.radius)
      this.position.y = -this.model.radius;
    else if (this.position.y < -this.model.radius)
      this.position.y = screen_height + this.model.radius;
  };

  public hasCollided(otherActors: Actor[]): Actor {
    this.collidedWith = undefined;
    otherActors.forEach((actor) => {
      if (this.position.dist(actor.position) < actor.radius + this.radius) {
        if (this != actor) {
          this.collidedWith = actor;
          actor.collidedWith=this;
          return;
        }
      }
    });
    return this.collidedWith;
  }

  public update(timeDelta: number) {
    this.radius = this.model.radius * this.scale;
    this.position.add(this.velocity.copy().mult(timeDelta));
    this.heading += this.rotationVel*timeDelta;
    this._transModel.vertexes = [];
    this.model.vertexes.forEach((av) => {
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
      this.childActors.forEach(child=>{
        child.update(timeDelta);
      });
    });
  }

  public render (gameEngine:AsteroidsGame) {
    if (!this.show) return;
    this.childActors.forEach(child=>{
      child.render(gameEngine);
    })
    this.draw(gameEngine);
  }

  public abstract draw(gameEngine: AsteroidsGame);
    
}

