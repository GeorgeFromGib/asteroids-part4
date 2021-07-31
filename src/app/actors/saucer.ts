
import { ISaucerType } from "../managers/saucerManager";
import { Actor, IModel } from "./base/actor";
import { AsteroidsGame } from '../asteroidsGame';


export class Saucer extends Actor {
  type:ISaucerType
  points:number;

  constructor(SaucerModel:IModel,type:ISaucerType) {
    super(SaucerModel);
    this.type=type;
    this.scale=type.scale;
    this.points=type.points;
  }

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawVerticedShape(this._transModel);
  }

}