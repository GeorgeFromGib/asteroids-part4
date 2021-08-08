import { ActorBase } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from "../../asteroidsGame";

export class ThrustActor extends ActorBase {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawClosedShape(this._transModel);
    }

}