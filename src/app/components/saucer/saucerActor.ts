
import { ActorBase, IModel } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from '../../asteroidsGame';
import { ISaucerTypeProfile } from "../../shared/interfaces/iConfig";


export class SaucerActor extends ActorBase {
  points:number;

  constructor(SaucerModel:IModel,public type:ISaucerTypeProfile,public changeDirType:boolean) {
    super(SaucerModel);
    this.scale=type.scale;
    this.points=type.points;
  }

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawVerticedShape(this._transModel);
  }

}