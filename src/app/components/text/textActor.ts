import { ActorBase } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from "../../asteroidsGame";

export class TextActor extends ActorBase {
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawVerticedShape(this._transModel);
    }

}