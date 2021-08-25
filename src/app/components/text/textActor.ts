import { ActorBase, IModel } from "../../shared/actors/base/actorBase";
import { AsteroidsGame } from "../../asteroidsGame";

export class TextActor extends ActorBase {
    constructor(model:IModel) {
        super(model)
    }
    
    public draw(gameEngine: AsteroidsGame) {
        gameEngine.drawVerticedShape(this._transModel);
    }

}

