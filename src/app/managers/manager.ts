import { Vector } from "p5";
import { Actor } from "../actors/actor";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";

export abstract class Manager {
    protected _actors:Actor[];

    constructor(protected gameEngine:AsteroidsGame) {
    }

    public update(timeDelta:number):void {
        this._actors.forEach(a=> {
            a.update(timeDelta);
            a.edgeWrap(this.gameEngine._screenSize.width,this.gameEngine._screenSize.height);
        })
    }

    public get allActors() : Actor[] {
        return this._actors;
    }
    
}