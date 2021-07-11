import { Projectile } from './projectile';
import P5, { Vector } from 'p5';
import { Actor, Model } from "./actor";
import { Spaceship } from "./spaceship";

export enum ShipTurn {
    LEFT,
    RIGHT,
    STOP
}

export class PlayerShipManager {
    ship:Spaceship;
    rotAmnt = Math.PI / 70;
    thrusting:boolean=false;
    firing:boolean;
    timeElapsed:number=0;
    lastShot=0;
    projectiles:Projectile[]=[];


    constructor(protected model:Model) {
    }

    public createShip(p5:P5){
        this.ship=new Spaceship(this.model);
        this.ship.positionXY(p5.width / 2, p5.height / 2);
    }

    public update(timeDelta:number) {
        this.timeElapsed+=timeDelta;
        console.log(this.timeElapsed);
        if(this.thrusting)
            this.ship.thrust();
        if(this.firing)
            if(this.timeElapsed-this.lastShot>200)
            {
                this.fireProjectile()
                this.lastShot=this.timeElapsed;
            }
        this.projectiles=this.projectiles.filter((p,i)=>!p.expired)
        // for(let i=this.projectiles.length;i>0;i--) {
        //     if(this.projectiles[i].expired)
        //         this.projectiles.slice(i,1);
        // }  
        //this.actors.push(this.ship);
        //this.actors.push(...this.projectiles);   
    }

    public getActors() {
        let actors:Actor[]=[];
        actors.push(this.ship);
        actors.push(...this.projectiles);
        return actors;
    }

    public turn(turn:ShipTurn) {
        let rotDelta=0;
        switch (turn) {
            case ShipTurn.LEFT:
                rotDelta = -this.rotAmnt;
                break;
            case ShipTurn.RIGHT:
                rotDelta = this.rotAmnt;
                break;
            case ShipTurn.STOP:
                rotDelta=0;
            default:
                break;
        }
        this.ship.rotationVel=rotDelta;
    }

    public thrust(on:boolean) {
        this.thrusting=on; 
    }

    public fire(on:boolean) {
        this.firing=on;
    }

    private fireProjectile() {
        const radius=this.model.radius;
        const heading=this.ship.heading-Math.PI/2;
        const gunPos=new Vector().set(radius,0).rotate(heading);
        const startPos=gunPos.add(this.ship.position);
        const vel=Vector.fromAngle(heading).mult(4);
        const proj=new Projectile(startPos,vel);
        //this.actors.push(proj) 
        this.projectiles.push(proj);
    } 
} 