
import { sizeType } from "../managers/asteroidsManager";
import { Actor, IModel } from "./actor";

export class Asteroid extends Actor {
    size:sizeType
    points:number;

    constructor(model:IModel){
        super(model);
    }
}