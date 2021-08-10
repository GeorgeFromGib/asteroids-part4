
import { Keys } from "./../asteroidsGame";
import { GameTimer } from "../gameTimer";
import { GameOverState } from "./GameOverState";
import { GameStateBase } from "../shared/gameStates/base/gameStateBase";
import { Asteroid } from '../components/asteroids/asteroid';
import { SaucerActor } from '../components/saucer/saucerActor';
import { PlayerShipManager, ShipTurn } from '../components/player/playerShipManager';
import { SpaceshipActor } from '../components/player/spaceshipActor';
import { AsteroidsManager } from "../components/asteroids/asteroidsManager";
import { ProjectileActor, ProjectileSource } from "../components/projectiles/ProjectileActor";
import { ActorBase } from "c:/Users/georg_000/dev/typescript/asteroids/src/app/shared/actors/base/actorBase";
import { SaucerTypes } from "../components/saucer/saucerManager";

export class PlayGameState extends GameStateBase {
  player: PlayerShipManager;
  asteroidsMan:AsteroidsManager;
  timer:GameTimer;
  level:number=0;
  // dummy:string="Hello";
  saucerTimer: GameTimer;


  public setup() {
    this.asteroidsMan=this.gameEngine.asteroidsManager;
    //this.newLevel(this);
    this.timer=this.gameEngine.createTimer(2000,()=>{this.newLevel()});
    this.player = this.gameEngine.playerManager;
    this.player.placeShipInSafeSpace(this.gameEngine.screenSize.center);
    this.saucerTimer = this.gameEngine.createTimer(4000, () => {
      this.showSaucer();
    });
  }

  public update(timeDelta: number) {
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
    if(this.asteroidsMan.levelCompleted && !this.gameEngine.saucerManager.saucer && this.timer.expired) {
      this.timer.restart();
    }
   // if (this.gameEngine.asteroidsManager.asteroids.length < 4) {
      if (!this.gameEngine.saucerManager.saucer && this.saucerTimer.expired) {
        const timeDecrement=this.level*1000
        const minDelay=Math.max(1000,10000-timeDecrement);
        const maxDelay=Math.max(1500,15000-timeDecrement);
        this.saucerTimer.time = this.gameEngine.randomRange(minDelay,maxDelay);
        this.saucerTimer.restart();
      }
    //}
    this.checkCollisions();
  }

  public showSaucer() {
    this.gameEngine.saucerManager.createSaucer(this.getRandomSaucerType());
  }

  private getRandomSaucerType() {
    const smallSaucerBias=Math.min(80,5*(this.level-1))
    const type= this.gameEngine.randomRange(0, 100) > (90-smallSaucerBias)
    ? SaucerTypes.SMALL
    : SaucerTypes.LARGE;
    return type;
  }

  public newLevel(){
    this.level++;
    this.asteroidsMan.startLevel(this.level);
  }

  public handleKeyPress(key: Keys) {
    if (key == Keys.RIGHT_ARROW)
      this.player.turn(ShipTurn.RIGHT);
    if (key == Keys.LEFT_ARROW)
      this.player.turn(ShipTurn.LEFT);
    if (key == Keys.UP_ARROW)
      this.player.engine(true);
    if (key == Keys.SPACE)
      this.player.fire(true);
    if(key==Keys.RIGHT_CTRL)
      this.player.hyperSpace();
  }

  public handleKeyRelease(key: Keys) {
    if (key == Keys.RIGHT_ARROW || key == Keys.LEFT_ARROW)
      this.player.turn(ShipTurn.STOP);
    if (key == Keys.UP_ARROW)
      this.player.engine(false);
    if (key == Keys.SPACE)
      this.player.fire(false);
  }

  public nextState() {
    this.player.showShip(false);
    this.saucerTimer.reset();
    this.gameEngine.saucerManager.clear();
    this.gameEngine.gameState = new GameOverState(this.gameEngine);
  }

  private checkCollisions() {
    const asteroids = this.gameEngine.asteroidsManager.actors;
    const saucers = this.gameEngine.saucerManager.actors;
    const ship=this.gameEngine.playerManager.ship;
    const shipProjectiles=this.gameEngine.projectilesManager.sourceProjectiles(ProjectileSource.PLAYER)
    const saucerProjectiles=this.gameEngine.projectilesManager.sourceProjectiles(ProjectileSource.SAUCER)
    if (ship.show) {
      this.checkShipCollisions(ship, asteroids, saucers);
    }
    this.checkSaucerCollisions(saucers, asteroids);
    this.checkShipProjectileCollisions(shipProjectiles, asteroids, saucers);
    this.checkSaucerProjectileCollisions(saucerProjectiles, asteroids, ship);
  }

  private checkSaucerCollisions(saucers: ActorBase[], asteroids: ActorBase[]) {
    saucers.forEach(s => {
      const colA = s.hasCollided(asteroids) as Asteroid;
    });
  }

  private checkSaucerProjectileCollisions(saucerProjectiles: ProjectileActor[], asteroids: ActorBase[], ship: SpaceshipActor) {
    saucerProjectiles.forEach((p) => {
      const colA = p.hasCollided(asteroids) as Asteroid;
      if (ship && ship.show) {
        const colP = p.hasCollided([ship]) as SpaceshipActor;
        if (colP)
          this.gameEngine.playerManager.shipHit();
      }
    });
  }

  private checkShipProjectileCollisions(shipProjectiles: ProjectileActor[], asteroids: ActorBase[], saucers: ActorBase[]) {
    shipProjectiles.forEach((p) => {
      const colA = p.hasCollided(asteroids) as Asteroid;
      if (colA != undefined) {
        this.gameEngine.scoresManager.addToScore(colA.points);
        return;
      }
      const colS = p.hasCollided(saucers) as SaucerActor;
      if (colS != undefined) {
        this.gameEngine.scoresManager.addToScore(colS.points);
      }
    });
  }

  private checkShipCollisions(ship: SpaceshipActor, asteroids: ActorBase[], saucers: ActorBase[]) {
    const colA = ship.hasCollided(asteroids) as Asteroid;
    const colS = ship.hasCollided(saucers) as SaucerActor;
    if (colA != undefined || colS != undefined) {
      this.gameEngine.playerManager.shipHit();
    }
  }
}
