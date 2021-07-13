
import { sizeType } from "../managers/asteroidsManager";
import { Actor, IModel } from "./actor";

export class Asteroid extends Actor {
    size:sizeType

    constructor(model:IModel){
        super(model);
    }
}