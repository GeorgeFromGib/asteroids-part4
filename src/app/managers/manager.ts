import { Actor } from "../actors/actor";

export abstract class Manager {
    
    public abstract update(timeDelta:number):void;

    public abstract getActors():Actor[];
}