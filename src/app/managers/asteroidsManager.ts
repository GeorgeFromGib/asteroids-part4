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
            const designIndex=AsteroidsGame.random(this.asteroidModels.designs.length-1)
            const asteroid=new Asteroid(this.asteroidModels.designs[designIndex]);
            asteroid.position=new Vector().set(AsteroidsGame.random(width),AsteroidsGame.random(height));
            asteroid.rotationVel=Math.PI/1000
            asteroid.velocity=Vector.random2D().mult(0.5);
            asteroid.scale=4;
            this.asteroids.push(asteroid);
        }
    }

    public update(timeDelta:number) {

    }

    public getActors() {
        return this.asteroids;
    }
}