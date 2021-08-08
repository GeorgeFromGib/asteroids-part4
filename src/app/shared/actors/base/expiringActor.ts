import { Actor, IModel } from "./actor";

export abstract class ExpiringActor extends Actor {
    expired: boolean = false;

    constructor(model:IModel,protected lifeTime: number = 1000) {
        super(model);
    }

    public update(timeDelta: number) {
        this.lifeTime -= timeDelta;
        if (this.lifeTime < 0)
            this.expired = true;

        super.update(timeDelta);
    }
}