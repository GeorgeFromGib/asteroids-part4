import { Particle } from "../actors/particle";
import P5, { Vector } from "p5";
import { Actor, IModel } from "../actors/base/actor";
import { ClosedShapeActor } from "../actors/base/ClosedShapeActor";
import { Manager } from "./manager";
import { Spaceship } from "../actors/spaceship";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";

export enum ShipTurn {
  LEFT=-1,
  RIGHT=1,
  STOP=0,
}

export interface ISpaceShip {
  ship:IModel;
  thrust:IModel;
  rotationVel:number;
  thrustVel:number;
  friction:number;
  projectileVel:number;
  rateOfFire:number;
  projectileLife:number;
}

export class PlayerShipManager extends Manager {
  ship: Spaceship;
  thrust:Actor;
  thrusting: boolean = false;
  firing: boolean;
  timeElapsed: number = 0;
  lastShot = 0;
  projectiles: Particle[] = [];
  spaceship:ISpaceShip
  

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.spaceship=gameEngine.configData.spaceship
  }

  public createShip() {
    this.thrust=new ClosedShapeActor(this.spaceship.thrust);
    this.ship = new Spaceship(this.spaceship.ship,this.spaceship.thrustVel,this.spaceship.friction,this.thrust);
    this.ship.positionXY(this.gameEngine._screenSize.width / 2, this.gameEngine._screenSize.height / 2);
  }

  public update(timeDelta: number) {
    this.timeElapsed += timeDelta;
    //this.ship.thrusting=this.thrusting;
    this.checkCollisions()
    if (this.firing)
      if (this.timeElapsed - this.lastShot > this.spaceship.rateOfFire) {
        this.addProjectile();
        this.lastShot = this.timeElapsed;
      }
    this.projectiles = this.projectiles.filter(
      (p) => !p.expired && !p.collidedWith
    );
    this._actors=[];
    this._actors.push(this.ship);
    this._actors.push(this.thrust);
    this._actors.push(...this.projectiles);
    super.update(timeDelta);
  }

  public checkCollisions() {
    const asteroids = this.gameEngine._asteroidsManager.allActors;
    //const col=this.ship.hasCollided(asteroids)
    this.projectiles.forEach((p) => {
      const col = p.hasCollided(asteroids);
      if(col!==undefined)
          col.collidedWith=p;
    });
  }

  public turn(turn: ShipTurn) {
    this.ship.rotationVel = this.spaceship.rotationVel * turn
  }

  public engine(on: boolean) {
    this.ship.thrusting=on;
  }

  public fire(on: boolean) {
    this.firing = on;
  }

  private addProjectile() {
    const radius = this.spaceship.ship.radius;
    const heading = this.ship.heading - Math.PI / 2;
    const gunPos = new Vector().set(radius, 0).rotate(heading);
    const startPos = gunPos.add(this.ship.position);
    const vel = Vector.fromAngle(heading).mult(this.spaceship.projectileVel);
    const proj = new Particle(startPos, vel,this.spaceship.projectileLife);
    this.projectiles.push(proj);
  }
}
