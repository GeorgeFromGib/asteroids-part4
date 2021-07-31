import { AsteroidsGame } from "../asteroidsGame";
import { Actor } from "./base/actor";

export class Text extends Actor {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawVerticedShape(this._transModel);
    }

}