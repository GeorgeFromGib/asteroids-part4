
import { Vector } from "p5";
import { ActorBase } from "../../shared/actors/base/actorBase";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { SaucerActor } from "./saucerActor";
import { AsteroidsGame } from "../../asteroidsGame";
import { GameTimer } from "../../gameTimer";
import { ISaucer } from "../../shared/interfaces/iConfig";



export enum SaucerTypes {
  LARGE = "SAUCER_LARGE",
  SMALL = "SAUCER_SMALL",
}

export class SaucerManager extends ManagerBase {
  saucerData: ISaucer;
  saucer: SaucerActor;
  firingTimer: GameTimer;
  firing: boolean = true;
  saucerEndXPos:number;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.saucerData = gameEngine.configData.saucer;

    this.firingTimer = gameEngine.createTimer(
      this.saucerData.rateOfFire,
      () => {
        this.fireProjectile();
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
        this.clear();
      }

      if(this.saucer && this.isSaucerAtEnd(this.saucer,this.saucerEndXPos))
        this.clear();
    }

    super.update(timeDelta);
  }

  public edgeWrap(actor:ActorBase) {}

  public createSaucer(saucerType:SaucerTypes) {
    const sType = this.getSaucerType(saucerType);
    this.saucer = new SaucerActor(this.saucerData.model, sType);
    this.saucer.position=this.calcSaucerStartPos(this.saucer);
    this.saucer.velocity = new Vector().set(this.calcSaucerDirection(), 0).mult(sType.speed / 1000);
    this.saucerEndXPos=this.calcSaucerEndXpos(this.saucer.position,this.saucer.radius)
  }

  public clear() {
    this.saucer=undefined
  }

  private calcSaucerEndXpos(position:Vector,radius:number) {
    const screen=this.gameEngine.screenSize;
    const xPos=position.x<0?screen.width+radius:-radius
    return xPos;
  }

  private calcSaucerDirection() {
    return this.gameEngine.randomRange(0, 100) > 50?1:-1
  }

  private getSaucerType(saucerType:string) {
    const sSize = this.saucerData.profiles.find(
      (s) => s.size == saucerType
    );
    return sSize;
  }



  private calcSaucerStartPos(saucer:ActorBase) {
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

  private isSaucerAtEnd(saucer:ActorBase, endX:number) {
    return ((saucer.velocity.x<0 && saucer.position.x<endX) || (saucer.velocity.x>0 && saucer.position.x>endX))
  }

  public fireProjectile() {
    if (!this.saucer) return;
    this.gameEngine.projectilesManager.addSaucerProjectile(this.saucer,0.7,700)
  }
}
