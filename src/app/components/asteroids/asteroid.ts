
import { SizeTypes } from "./asteroidsManager";
import { AsteroidsGame } from "../../asteroidsGame";
import { Actor, IModel } from "../../shared/actors/base/actor";

export class Asteroid extends Actor {
    size:SizeTypes
    points:number;

    constructor(model:IModel){
        super(model);
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawClosedShape(this._transModel);
    }
}