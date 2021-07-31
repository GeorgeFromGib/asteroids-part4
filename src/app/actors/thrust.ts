import { AsteroidsGame } from "../asteroidsGame";
import { Actor } from "./base/actor";

export class Thrust extends Actor {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawClosedShape(this._transModel);
    }

}