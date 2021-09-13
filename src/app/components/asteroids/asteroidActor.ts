import { AsteroidsGame } from "../../asteroidsGame";
import { ActorBase } from "../../shared/actors/base/actorBase";
import { IModel } from "../../shared/interfaces/iConfig";

export enum SizeTypes {
    LARGE = "ASTEROID_LARGE",
    MEDIUM = "ASTEROID_MEDIUM",
    SMALL = "ASTEROID_SMALL",
  }

export class AsteroidActor extends ActorBase {

    constructor(model:IModel, public size:SizeTypes, public points:number) {
        super(model)
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawClosedShape(this._transModel);
    }
}