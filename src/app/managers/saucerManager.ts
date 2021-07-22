import { Vector } from 'p5';
import { IModel } from '../actors/base/actor';
import { Saucer } from './../actors/saucer';
import { AsteroidsGame, GameTimer } from './../asteroidsGame';
import { Manager } from "./manager";

export enum saucerType{
    LARGE="SAUCER_LARGE",
    SMALL="SAUCER_SMALL"
}

export interface ISaucerSize {
    size:string;
    scale:number;
    speed:number;
    points:number
}

export interface ISaucer {
    model: IModel;
    sizes: ISaucerSize[];
}

export class SaucerManager extends Manager {
    saucerData:ISaucer;
    saucer: Saucer;
    saucerTimer: GameTimer;

    constructor(gameEngine:AsteroidsGame) {
        super(gameEngine);
        this.saucerData=gameEngine.configData.saucer;
        this.saucerTimer=gameEngine.createTimer(4000,()=>{this.createSaucer();})
    }

    public createSaucer() {
        const sSize=this.saucerData.sizes.find(s=>s.size==saucerType.LARGE);
        this.saucer=new Saucer(this.saucerData.model,sSize);
        this.saucer.positionXY(this.gameEngine.screenSize.width+this.saucer.radius,60);
        this.saucer.velocity=new Vector().set(-1,0).mult(sSize.speed/1000)
    }

    public update(timeDelta:number) {
        if(this.gameEngine.asteroidsManager.asteroids.length<4) {
            if(!this.saucer && this.saucerTimer.expired) {
                this.saucerTimer.restart();
            }
        }
        if(this.saucer && this.saucer.collidedWith) {
            this.gameEngine.explosionsManager.createExplosion(this.saucer.position);
            this.saucer=undefined;
            this.saucerTimer.time=this.gameEngine.randomRange(10000,15000);
        }

        this._actors=[];
        if(this.saucer)
            this._actors.push(this.saucer)
        
         super.update(timeDelta);
    }

}