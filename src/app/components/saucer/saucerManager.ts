
import { Vector } from "p5";
import { Actor, IModel } from "../../shared/actors/base/actor";
import { Particle } from "../../shared/actors/particle";
import { Manager } from "../../shared/managers/manager";
import { SaucerActor } from "./saucerActor";
import { AsteroidsGame, GameTimer } from "../../asteroidsGame";


export enum SaucerTypes {
  LARGE = "SAUCER_LARGE",
  SMALL = "SAUCER_SMALL",
}

export interface ISaucerType {
  size: string;
  scale: number;
  speed: number;
  points: number;
  fudgeAim:number;
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
  saucer: SaucerActor;
  saucerTimer: GameTimer;
  firingTimer: GameTimer;
  projectiles: Particle[] = [];
  firing: boolean = true;
  saucerEndXPos:number;

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

  public update(timeDelta: number) {
    this._actors = [];

    if (this.saucer) {
      this._actors.push(this.saucer);

      if (this.firing && this.firingTimer.expired) this.firingTimer.restart();

      if (this.saucer.collidedWith) {
        this.gameEngine.explosionsManager.createExplosion(this.saucer.position);
        this.saucer = undefined;
      }

      if(this.saucer && this.isSaucerAtEnd(this.saucer,this.saucerEndXPos))
        this.clear();
    }

    this.projectiles = this.projectiles.filter(
      (p) => !p.expired && !p.collidedWith
    );

    this._actors.push(...this.projectiles);
    super.update(timeDelta);
  }

  public edgeWrap(actor:Actor) {}

  public createSaucer() {
    const sType = this.getSaucerType(this.getRandomSaucerType());
    this.saucer = new SaucerActor(this.saucerData.model, sType);
    this.saucer.position=this.calcSaucerStartPos(this.saucer);
    this.saucer.velocity = new Vector().set(this.calcSaucerDirection(), 0).mult(sType.speed / 1000);
    this.saucerEndXPos=this.calcSaucerEndXpos(this.saucer.position,this.saucer.radius)
  }

  public clear() {
    this.saucer=undefined
    this.saucerTimer.reset();
  }

  private calcSaucerEndXpos(position:Vector,radius:number) {
    const screen=this.gameEngine.screenSize;
    const xPos=position.x<0?screen.width+radius:-radius
    return xPos;
  }

  private calcSaucerDirection() {
    return this.gameEngine.randomRange(0, 100) > 50?1:-1
  }

  private getSaucerType(saucerType) {
    const sSize = this.saucerData.sizes.find(
      (s) => s.size == saucerType
    );
    return sSize;
  }

  private getRandomSaucerType() {
    const type= this.gameEngine.randomRange(0, 100) > 50
    ? SaucerTypes.LARGE
    : SaucerTypes.SMALL;
    return type;
  }

  private calcSaucerStartPos(saucer:Actor) {
    const screen=this.gameEngine.screenSize;
    const xPos =
      this.gameEngine.randomRange(0, 100) > 50
        ? screen.width + saucer.radius
        : -saucer.radius;
    const yPos = this.gameEngine.randomRange(
      40,
      screen.height - 40
    );
    
    return new Vector().set(xPos,yPos)
  }

  private isSaucerAtEnd(saucer:Actor, endX:number) {
    return ((saucer.velocity.x<0 && saucer.position.x<endX) || (saucer.velocity.x>0 && saucer.position.x>endX))
  }

  public addProjectile() {
    if (!this.saucer) return;
    const radius = this.saucer.radius;
    const projHeading = this.getRangeAndDirection(
      this.gameEngine.playerManager.ship.position,
      this.saucer.position,
      this.saucer.type.fudgeAim
    ).heading;
    const gunPos = new Vector().set(radius, 0).rotate(projHeading);
    const startPos = gunPos.add(this.saucer.position);
    const vel = Vector.fromAngle(projHeading).mult(0.7);
    const proj = new Particle(startPos, vel, 700);
    this.projectiles.push(proj);
  }

  protected getRangeAndDirection(
    source: Vector,
    target: Vector,
    fudgeAngle: number
  ): { range: number; heading: number } {
    const heading =
      source.copy().sub(target).heading() +
      this.gameEngine.randomRange(-fudgeAngle, fudgeAngle);
    const range = source.dist(target);
    return { range: range, heading: heading };
  }
}
