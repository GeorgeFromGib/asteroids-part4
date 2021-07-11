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
    _rotDelta: number = 0;
    rotAmnt = Math.PI / 70;
    thrusting:boolean=false;
    firing:boolean;
    timeElapsed:number=0;
    lastShot=0;


    constructor(protected actors:Actor[],protected model:Model) {
    }

    public createShip(p5:P5){
        this.ship=new Spaceship(this.model);
        this.ship.positionXY(p5.width / 2, p5.height / 2);
        this.actors.push(this.ship);
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
                
    }

    public turn(turn:ShipTurn) {
        switch (turn) {
            case ShipTurn.LEFT:
                this._rotDelta = -this.rotAmnt;
                break;
            case ShipTurn.RIGHT:
                this._rotDelta = this.rotAmnt;
                break;
            case ShipTurn.STOP:
                this._rotDelta=0;
            default:
                break;
        }
        this.ship.rotationVel=this._rotDelta;
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
        const vel=Vector.fromAngle(heading).mult(5);
        const proj=new Projectile(startPos,vel);
        this.actors.push(proj) 
    } 
} 