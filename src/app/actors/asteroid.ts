
import { SizeTypes } from "../managers/asteroidsManager";
import { Actor, IModel } from "./base/actor";
import { ClosedShapeActor } from "./base/ClosedShapeActor";

export class Asteroid extends ClosedShapeActor {
    size:SizeTypes
    points:number;

    constructor(model:IModel){
        super(model);
    }
}