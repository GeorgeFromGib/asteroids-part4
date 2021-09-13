import { ActorBase} from "./actorBase";
import {IModel} from "../../interfaces/iConfig";

export abstract class ExpiringActor extends ActorBase {
    expired: boolean = false;

    protected constructor(model:IModel, protected lifeTime: number = 1000) {
        super(model);
    }

    public update(timeDelta: number) {
        this.lifeTime -= timeDelta;
        if (this.lifeTime < 0)
            this.expired = true;

        super.update(timeDelta);
    }
}