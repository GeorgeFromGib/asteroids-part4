import { Vector } from "p5";
import { IModel } from "../actors/base/actor";
import { Particle } from "../actors/particle";
import { Saucer } from "./../actors/saucer";
import { AsteroidsGame, GameTimer } from "./../asteroidsGame";
import { Manager } from "./manager";

export enum SaucerTypes {
  LARGE = "SAUCER_LARGE",
  SMALL = "SAUCER_SMALL",
}

export interface ISaucerType {
  size: string;
  scale: number;
  speed: number;
  points: number;
}

export interface ISaucer {
  model: IModel;
  sizes: ISaucerType[];
  projectileVel: number;
  projectileLife: number;
  rateOfFire: number;
}

export class SaucerManager extends Manager {
  saucerData: ISaucer;
  saucer: Saucer;
  saucerTimer: GameTimer;
  firingTimer: GameTimer;
  projectiles: Particle[] = [];
  firing: boolean = true;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.saucerData = gameEngine.configData.saucer;
    this.saucerTimer = gameEngine.createTimer(4000, () => {
      this.createSaucer();
    });
    this.firingTimer = gameEngine.createTimer(
      this.saucerData.rateOfFire,
      () => {
        this.addProjectile();
      }
    );
  }

  public createSaucer() {
    const sSize = this.saucerData.sizes.find(
      (s) => s.size == SaucerTypes.LARGE
    );
    this.saucer = new Saucer(this.saucerData.model, sSize);
    this.saucer.positionXY(
      this.gameEngine.screenSize.width + this.saucer.radius,
      80
    );
    this.saucer.velocity = new Vector().set(-1, 0).mult(sSize.speed / 1000);
  }

  public update(timeDelta: number) {
    this._actors = [];

    if (this.gameEngine.asteroidsManager.asteroids.length < 4) {
      if (!this.saucer && this.saucerTimer.expired) {
        this.saucerTimer.restart();
      }
    }
    if (this.saucer) {
      this._actors.push(this.saucer);

      if (this.firing && this.firingTimer.expired) this.firingTimer.restart();

      if (this.saucer.collidedWith) {
        this.gameEngine.explosionsManager.createExplosion(this.saucer.position);
        this.saucer = undefined;
        this.saucerTimer.time = this.gameEngine.randomRange(10000, 15000);
      }
    }

    this.projectiles = this.projectiles.filter(
        (p) => !p.expired && !p.collidedWith
      );

    this._actors.push(...this.projectiles);
    super.update(timeDelta);
  }

  public addProjectile() {
    if(!this.saucer) return;
    const radius = this.saucer.radius;
    const projHeading = this.getRangeAndDirection(this.gameEngine.playerManager.ship.position,this.saucer.position).heading+this.gameEngine.randomRange(-Math.PI/4,Math.PI/4);
    const gunPos = new Vector().set(radius, 0).rotate(projHeading);
    const startPos = gunPos.add(this.saucer.position);
    const vel = Vector.fromAngle(projHeading).mult(0.7)
    const proj = new Particle(startPos, vel, 700);
    this.projectiles.push(proj);
  }

  protected getRangeAndDirection(source:Vector, target:Vector):{range:number, heading:number} {
    const heading=source.copy().sub(target).heading()
    const range=source.dist(target);
    return {range:range,heading:heading};
  }
  
}
