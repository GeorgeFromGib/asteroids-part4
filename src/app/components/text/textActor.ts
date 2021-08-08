import { Actor } from "../../shared/actors/base/actor";
import { AsteroidsGame } from "../../asteroidsGame";

export class TextActor extends Actor {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawVerticedShape(this._transModel);
    }

}