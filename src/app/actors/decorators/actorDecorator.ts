import { Actor } from "../base/actor";


export abstract class ActorDecorator extends Actor {

    constructor(protected _actor:Actor) {
        super(_actor.model)
    }

}

