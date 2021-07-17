import { Vector } from "p5";
import { IModel } from "../actors/base/actor";
import { Asteroid } from "../actors/asteroid";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";
import { Manager } from "./manager";

export enum sizeType{
    LARGE="ASTEROID_LARGE",
    MEDIUM="ASTEROID_MEDIUM",
    SMALL="ASTEROID_SMALL"
}
export interface IAsteroidSize {
    size:string;//"LARGE"|"MEDIUM"|"SMALL"
    scale:number;
    speed:number;
    points:number;

}
export interface IAsteroids {
    designs:IModel[];
    sizes: IAsteroidSize[];
}

export class AsteroidsManager extends Manager {
    asteroids:Asteroid[]=[];
    asteroidModels: IAsteroids;

    constructor(gameEngine:AsteroidsGame) {
        super(gameEngine);
        this.asteroidModels=gameEngine.configData.asteroids;
    }

    public createAsteroid(pos:Vector,size:sizeType) {
        const aSize=this.asteroidModels.sizes.find(s=>s.size==size);
        const designIndex=Math.floor(this.gameEngine.random(this.asteroidModels.designs.length));
        const l_asteroid=new Asteroid(this.asteroidModels.designs[designIndex]);
        const vel=this.gameEngine.randomRange(40,80*aSize.speed);
        l_asteroid.position=pos.copy();
        l_asteroid.velocity=Vector.random2D().mult(vel/1000);
        l_asteroid.size=aSize.size as sizeType;
        l_asteroid.points=aSize.points;
        l_asteroid.scale=aSize.scale;
        this.asteroids.push(l_asteroid);
    }

    public createAsteroids(noOfAsteroids:number) {
        const screen=this.gameEngine._screenSize;
        for(let i=0;i<=noOfAsteroids;i++) {
            const position=new Vector().set(this.gameEngine.random(screen.width),this.gameEngine.random(screen.height));
            this.createAsteroid(position,sizeType.LARGE);
        }
    }

    public update(timeDelta:number) {
        if(this.asteroids.length==0)
            this.createAsteroids(10);
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
        this.gameEngine._scoresManager.addToScore(hitAsteroid.points);
        
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