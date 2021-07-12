import { Vector } from "p5";
import { Actor, IModel } from "../actors/actor";
import { Asteroid } from "../actors/asteroid";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";
import { Manager } from "./manager";

export interface IAsteroids {
    designs:IModel[];
}

export class AsteroidsManager extends Manager {
    asteroids:Actor[]=[];

    constructor(gameEngine:AsteroidsGame,protected asteroidModels:IAsteroids) {
        super(gameEngine);
    }

    public createAsteroid() {

    }

    public createAsteroids(noOfAsteroids:number,width:number,height:number) {
        for(let i=0;i<=noOfAsteroids;i++) {
            const designIndex=Math.floor(this.gameEngine.random(this.asteroidModels.designs.length));
            const asteroid=new Asteroid(this.asteroidModels.designs[designIndex]);
            asteroid.position=new Vector().set(this.gameEngine.random(width),this.gameEngine.random(height));
            asteroid.heading=this.gameEngine.random(2*Math.PI)
            asteroid.velocity=Vector.random2D().mult(0.5);
            asteroid.scale=4;
            this.asteroids.push(asteroid);
        }
    }

    public update(timeDelta:number) {
        this.asteroids.forEach(a=>{
            if(a.collidedWith!==undefined)
                this.hit()
        })
        this.asteroids=this.asteroids.filter((a,i)=>a.collidedWith==undefined);

        this._actors=[];
        this._actors.push(...this.asteroids);
        super.update(timeDelta);
    }

    public hit() {
        console.log('asteroid hit');
        
    }

}