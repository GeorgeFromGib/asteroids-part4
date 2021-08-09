
import { ActorBase, IModel } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from '../../asteroidsGame';
import { ISaucerTypeProfile } from "./ISaucerTypeProfile";


export class SaucerActor extends ActorBase {
  type:ISaucerTypeProfile
  points:number;

  constructor(SaucerModel:IModel,type:ISaucerTypeProfile) {
    super(SaucerModel);
    this.type=type;
    this.scale=type.scale;
    this.points=type.points;
  }

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawVerticedShape(this._transModel);
  }

}