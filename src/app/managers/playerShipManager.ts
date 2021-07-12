import { Projectile } from "../actors/projectile";
import P5, { Vector } from "p5";
import { Actor, IModel } from "../actors/actor";
import { Manager } from "./manager";
import { Spaceship } from "../actors/spaceship";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";

export enum ShipTurn {
  LEFT,
  RIGHT,
  STOP,
}

export class PlayerShipManager extends Manager {
  ship: Spaceship;
  rotAmnt = Math.PI / 70;
  thrusting: boolean = false;
  firing: boolean;
  timeElapsed: number = 0;
  lastShot = 0;
  projectiles: Projectile[] = [];

  constructor(gameEngine: AsteroidsGame, protected model: IModel) {
    super(gameEngine);
  }

  public createShip(p5: P5) {
    this.ship = new Spaceship(this.model);
    this.ship.positionXY(p5.width / 2, p5.height / 2);
  }

  public update(timeDelta: number) {
    this.timeElapsed += timeDelta;
    if (this.thrusting) this.ship.thrust();
    if (this.firing)
      if (this.timeElapsed - this.lastShot > 200) {
        this.addProjectile();
        this.lastShot = this.timeElapsed;
      }
    this.projectiles = this.projectiles.filter(
      (p, i) => !p.expired && !p.collidedWith
    );
    super.update(timeDelta);
  }

  public checkCollisions(manager: Manager) {
    const asteroids = manager.allActors;
    //const col=this.ship.hasCollided(asteroids)
    this.projectiles.forEach((p) => {
      const col = p.hasCollided(asteroids);
      // if(col!==undefined)
      //     p.expired=true;
    });
  }

  // public getActors() {
  //     let actors:Actor[]=[];
  //     actors.push(this.ship);
  //     actors.push(...this.projectiles);
  //     return actors;
  // }

  public turn(turn: ShipTurn) {
    let rotDelta = 0;
    switch (turn) {
      case ShipTurn.LEFT:
        rotDelta = -this.rotAmnt;
        break;
      case ShipTurn.RIGHT:
        rotDelta = this.rotAmnt;
        break;
      case ShipTurn.STOP:
        rotDelta = 0;
      default:
        break;
    }
    this.ship.rotationVel = rotDelta;
  }

  public thrust(on: boolean) {
    this.thrusting = on;
  }

  public fire(on: boolean) {
    this.firing = on;
  }

  private addProjectile() {
    const radius = this.model.radius;
    const heading = this.ship.heading - Math.PI / 2;
    const gunPos = new Vector().set(radius, 0).rotate(heading);
    const startPos = gunPos.add(this.ship.position);
    const vel = Vector.fromAngle(heading).mult(4);
    const proj = new Projectile(startPos, vel);
    this.projectiles.push(proj);
  }
}
