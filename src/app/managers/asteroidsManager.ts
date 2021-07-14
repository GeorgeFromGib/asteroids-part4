import { Vector } from "p5";
import { Actor, IModel } from "../actors/actor";
import { Asteroid } from "../actors/asteroid";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";
import { Manager } from "./manager";

export enum sizeType{
    LARGE="LARGE",
    MEDIUM="MEDIUM",
    SMALL="SMALL"
}
export interface IAsteroidSize {
    size:string;//"LARGE"|"MEDIUM"|"SMALL"
    score:number;
    scale:number;
    speed:number;
}
export interface IAsteroids {
    designs:IModel[];
    sizes: IAsteroidSize[];
}

export class AsteroidsManager extends Manager {
    asteroids:Asteroid[]=[];

    constructor(gameEngine:AsteroidsGame,protected asteroidModels:IAsteroids) {
        super(gameEngine);
    }

    public createAsteroid(pos:Vector,size:sizeType) {
        const aSize=this.asteroidModels.sizes.find(s=>s.size==size);
        const designIndex=Math.floor(this.gameEngine.random(this.asteroidModels.designs.length));
        const asteroid=new Asteroid(this.asteroidModels.designs[designIndex]);
        asteroid.position=pos.copy();
        asteroid.velocity=Vector.random2D().mult(0.5*aSize.speed);
        asteroid.size=aSize.size as sizeType;
        asteroid.scale=aSize.scale;
        this.asteroids.push(asteroid);
    }

    public createAsteroids(noOfAsteroids:number,width:number,height:number) {
        for(let i=0;i<=noOfAsteroids;i++) {
            const position=new Vector().set(this.gameEngine.random(width),this.gameEngine.random(height));
            this.createAsteroid(position,sizeType.LARGE);
        }
    }

    public update(timeDelta:number) {
        this.asteroids.forEach(a=>{
            if(a.collidedWith!==undefined)
                this.hit(a)
        })
        this.asteroids=this.asteroids.filter((a,i)=>a.collidedWith==undefined);

        this._actors=[];
        this._actors.push(...this.asteroids);
        super.update(timeDelta);
    }

    public hit(hitAsteroid:Asteroid) {
        if(hitAsteroid.size===sizeType.SMALL) {
            this.gameEngine._explosionsManager.createExplosion(hitAsteroid.position);
            return
        };
        const nextSize=hitAsteroid.size===sizeType.LARGE?sizeType.MEDIUM:sizeType.SMALL;
        const pos=hitAsteroid.position;
        this.createAsteroid(pos,nextSize)
        this.createAsteroid(pos,nextSize)
        
    }

}