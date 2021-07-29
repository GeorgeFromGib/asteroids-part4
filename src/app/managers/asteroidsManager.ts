import { Vector } from "p5";
import { IModel } from "../actors/base/actor";
import { Asteroid } from "../actors/asteroid";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";
import { Manager } from "./manager";

export enum SizeTypes {
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
    levelCompleted:boolean=false;
    level:number=1;

    constructor(gameEngine:AsteroidsGame) {
        super(gameEngine);
        this.asteroidModels=gameEngine.configData.asteroids;
    }

    public startLevel(level:number) {
        this.levelCompleted=false;
        this.level=1; 
        this.createAsteroids(6);
    }

    public createAsteroid(pos:Vector,size:SizeTypes) {
        const aSize=this.asteroidModels.sizes.find(s=>s.size==size);
        const designIndex=Math.floor(this.gameEngine.random(this.asteroidModels.designs.length));
        const l_asteroid=new Asteroid(this.asteroidModels.designs[designIndex]);
        const lowSpeed=30*(1+this.level/100);
        const vel=this.gameEngine.randomRange(lowSpeed,80*aSize.speed);
        l_asteroid.position=pos.copy();
        l_asteroid.velocity=Vector.random2D().mult(vel/1000);
        l_asteroid.size=aSize.size as SizeTypes;
        l_asteroid.points=aSize.points;
        l_asteroid.scale=aSize.scale;
        this.asteroids.push(l_asteroid);
    }

    public createAsteroids(noOfAsteroids:number) {
        const screen=this.gameEngine.screenSize;
        const noGoRadius=screen.width/4 
        const scrCntr=this.gameEngine.screenSize.center;
        for(let i=0;i<=noOfAsteroids;i++) {
            let outside=false;
            let randPos:Vector;
            while(!outside) {
                randPos=new Vector().set(this.gameEngine.getRandomScreenPosition(1));
                outside=(Vector.dist(randPos,scrCntr)>noGoRadius);
            }
            const position=new Vector().set(randPos);
            this.createAsteroid(position,SizeTypes.LARGE);
        }
    }

    public clear() {
        this.asteroids=[];
    }

    public update(timeDelta:number) {
        if(this.asteroids.length==0 && this.gameEngine.saucerManager.allActors.length==0)
            this.levelCompleted=true;
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
        if(hitAsteroid.size===SizeTypes.SMALL) {
            this.gameEngine.explosionsManager.createExplosion(hitAsteroid.position);
            return
        };
        const nextSize=hitAsteroid.size===SizeTypes.LARGE?SizeTypes.MEDIUM:SizeTypes.SMALL;
        const pos=hitAsteroid.position;
        this.createAsteroid(pos,nextSize)
        this.createAsteroid(pos,nextSize)
        
    }

}