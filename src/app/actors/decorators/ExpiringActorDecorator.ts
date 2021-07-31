
import { AsteroidsGame } from "../../asteroidsGame";
import { Actor } from "../base/actor";
import { ActorDecorator } from "./actorDecorator";


export class ExpiringActorDecorator extends ActorDecorator {
    expired: boolean = false;

    constructor(actor: Actor, protected lifeTime: number = 1000) {
        super(actor);
    }

    public update(timeDelta: number) {
        this.lifeTime -= timeDelta;
        if (this.lifeTime < 0)
            this.expired = true;

        this._actor.update(timeDelta);
    }

    public hasCollided(otherActors: Actor[]): Actor {
        return this._actor.hasCollided(otherActors);
    }

    public draw(gameEngine: AsteroidsGame): void {
        this._actor.draw(gameEngine);
    }


}
