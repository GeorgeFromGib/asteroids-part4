
import { ActorBase, IModel } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from '../../asteroidsGame';
import { ISaucerType } from "./saucerManager";


export class SaucerActor extends ActorBase {
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