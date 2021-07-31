
import { AsteroidsGame } from "../asteroidsGame";
import { SizeTypes } from "../managers/asteroidsManager";
import { Actor, IModel } from "./base/actor";

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