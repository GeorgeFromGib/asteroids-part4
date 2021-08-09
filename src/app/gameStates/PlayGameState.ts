
import { GameTimer, Keys } from "./../asteroidsGame";
import { GameOverState } from "./GameOverState";
import { GameState } from "./GameState";
import { Asteroid } from '../components/asteroids/asteroid';
import { SaucerActor } from '../components/saucer/saucerActor';
import { PlayerShipManager, ShipTurn } from '../components/player/playerShipManager';
import { SpaceshipActor } from '../components/player/spaceshipActor';
import { AsteroidsManager } from "../components/asteroids/asteroidsManager";
import { ProjectileSource } from "../components/projectiles/ProjectileActor";

export class PlayGameState extends GameState {
  player: PlayerShipManager;
  asteroidsMan:AsteroidsManager;
  timer:GameTimer;
  mylevel:number=0;
  dummy:string="Hello";
  saucerTimer: GameTimer;


  public setup() {
    this.asteroidsMan=this.gameEngine.asteroidsManager;
    //this.newLevel(this);
    this.timer=this.gameEngine.createTimer(2000,()=>{this.newLevel()});
    this.player = this.gameEngine.playerManager;
    this.player.placeShipInSafeSpace(this.gameEngine.screenSize.center);
    this.saucerTimer = this.gameEngine.createTimer(4000, () => {
      this.gameEngine.saucerManager.createSaucer();
    });
  }

  public update(timeDelta: number) {
    if (this.gameEngine.scoresManager.lives <= 0)
      this.nextState();
    if(this.asteroidsMan.levelCompleted && !this.gameEngine.saucerManager.saucer && this.timer.expired) {
      this.timer.restart();
    }
    if (this.gameEngine.asteroidsManager.asteroids.length < 4) {
      if (!this.gameEngine.saucerManager.saucer && this.saucerTimer.expired) {
        this.saucerTimer.time = this.gameEngine.randomRange(10000, 15000);
        this.saucerTimer.restart();
      }
    }
    this.checkCollisions();
  }

  public checkCollisions() {
    const asteroids = this.gameEngine.asteroidsManager.actors;
    const saucers = this.gameEngine.saucerManager.actors;
    const ship=this.gameEngine.playerManager.ship;
    const shipProjectiles=this.gameEngine.projectilesManager.sourceProjectiles(ProjectileSource.PLAYER)
    const saucerProjectiles=this.gameEngine.projectilesManager.sourceProjectiles(ProjectileSource.SAUCER)
    if (ship.show) {
      const colA = ship.hasCollided(asteroids) as Asteroid;
      const colS=ship.hasCollided(saucers) as SaucerActor;
      if (colA != undefined || colS !=undefined) {
        this.gameEngine.playerManager.shipHit();
      }
    }
    saucers.forEach(s=>{
      const colA=s.hasCollided(asteroids) as Asteroid;
    })
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
    saucerProjectiles.forEach((p) => {
      const colA = p.hasCollided(asteroids) as Asteroid;
      if(ship && ship.show) {
        const colP=p.hasCollided([ship]) as SpaceshipActor;
        if(colP)
          this.gameEngine.playerManager.shipHit()
        }
      })
    }

  public newLevel(){
    this.mylevel++;
    console.log(this.mylevel);
    this.asteroidsMan.startLevel(this.mylevel);
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
    this.gameEngine.saucerManager.clear();
    this.gameEngine.gameState = new GameOverState(this.gameEngine);
  }
}
