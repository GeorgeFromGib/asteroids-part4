import { Vector } from "p5";
import { Actor } from "../actors/base/actor";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";

export abstract class Manager {
    protected _actors:Actor[]=[];

    constructor(protected gameEngine:AsteroidsGame) {
    }

    public update(timeDelta:number):void {
        this._actors.forEach(a=> {
            a.update(timeDelta);
            a.edgeWrap(this.gameEngine.screenSize.width,this.gameEngine.screenSize.height);
        })
    }

    public render() {
        this._actors.forEach(actor => {
            actor.render(this.gameEngine);
          });
    }

    public get allActors() : Actor[] {
        return this._actors;
    }
    
}