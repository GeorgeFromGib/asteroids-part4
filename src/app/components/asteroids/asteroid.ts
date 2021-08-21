
import { AsteroidsGame } from "../../asteroidsGame";
import { ActorBase, IModel } from "../../shared/actors/base/actorBase";

export enum SizeTypes {
    LARGE = "ASTEROID_LARGE",
    MEDIUM = "ASTEROID_MEDIUM",
    SMALL = "ASTEROID_SMALL",
  }
export class Asteroid extends ActorBase {
    size:SizeTypes
    points:number;

    constructor(model:IModel){
        super(model);
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawClosedShape(this._transModel);
    }
}