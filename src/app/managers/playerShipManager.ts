import { Asteroid } from './../actors/asteroid';
import { Particle } from "../actors/particle";
import P5, { Vector } from "p5";
import { Actor, IModel } from "../actors/base/actor";
import { ClosedShapeActor } from "../actors/base/ClosedShapeActor";
import { Manager } from "./manager";
import { Spaceship } from "../actors/spaceship";
import { AsteroidsGame, ScreenSize } from "../asteroidsGame";

export enum ShipTurn {
  LEFT = -1,
  RIGHT = 1,
  STOP = 0,
}

export interface ISpaceShip {
  ship: IModel;
  thrust: IModel;
  rotationVel: number;
  thrustVel: number;
  friction: number;
  projectileVel: number;
  rateOfFire: number;
  projectileLife: number;
}

export class PlayerShipManager extends Manager {
  ship: Spaceship;
  firing: boolean;
  lastShot = 0;
  projectiles: Particle[] = [];
  spaceship: ISpaceShip;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.spaceship = gameEngine.configData.spaceship;
    this.createShip();
  }

  public createShip() {
    const thrustActor = new ClosedShapeActor(this.spaceship.thrust);
    this.ship = new Spaceship(
      this.spaceship.ship,
      this.spaceship.thrustVel,
      this.spaceship.friction,
      thrustActor
    );
    this.ship.positionXY(
      this.gameEngine.screenSize.width / 2,
      this.gameEngine.screenSize.height / 2
    );
    this.ship.show=false;
  }

  public showShip(show:boolean) {
      this.ship.show=show;
      if(!show) {
        this.ship.thrusting=false;
        this.firing=false;
      }

  }

  public update(timeDelta: number) {
    this.checkCollisions();
    if (this.firing)
      if (
        this.gameEngine.elapsedTime - this.lastShot >
        this.spaceship.rateOfFire
      ) {
        this.addProjectile();
        this.lastShot = this.gameEngine.elapsedTime;
      }
    this.projectiles = this.projectiles.filter(
      (p) => !p.expired && !p.collidedWith
    );
    this._actors = [];
    if (this.ship.show) {
      this._actors.push(this.ship);
    }
    this._actors.push(...this.projectiles);
    super.update(timeDelta);
  }

  public checkCollisions() {
    const asteroids = this.gameEngine.asteroidsManager.allActors;
    if (this.ship.show) {
      const col = this.ship.hasCollided(asteroids);
      if (col != undefined) {
        this.gameEngine.scoresManager.lives--;
        const astrd=col as Asteroid;
        this.gameEngine.scoresManager.addToScore(astrd.points);
      }
    }
    this.projectiles.forEach((p) => {
      const col = p.hasCollided(asteroids);
      if(col!=undefined) {
        const astrd=col as Asteroid;
        this.gameEngine.scoresManager.addToScore(astrd.points);
      }
    });
  }

  public turn(turn: ShipTurn) {
    this.ship.rotationVel = this.spaceship.rotationVel * turn;
  }

  public engine(on: boolean) {
    this.ship.thrusting = on;
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
    const proj = new Particle(startPos, vel, this.spaceship.projectileLife);
    this.projectiles.push(proj);
  }
}
