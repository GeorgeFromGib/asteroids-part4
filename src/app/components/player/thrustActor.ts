import { Actor } from "../../shared/actors/base/actor";
import { AsteroidsGame } from "../../asteroidsGame";

export class ThrustActor extends Actor {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawClosedShape(this._transModel);
    }

}