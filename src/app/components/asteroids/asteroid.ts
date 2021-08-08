
import { SizeTypes } from "./asteroidsManager";
import { AsteroidsGame } from "../../asteroidsGame";
import { ActorBase, IModel } from "../../shared/actors/base/actorBase";

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