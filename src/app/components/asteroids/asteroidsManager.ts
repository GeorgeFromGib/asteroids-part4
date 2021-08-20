import { GameTimer } from './../../gameTimer';
import { Vector } from "p5";
import { Asteroid, SizeTypes } from "./asteroid";
import { AsteroidsGame } from "../../asteroidsGame";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { IAsteroids } from "../../shared/interfaces/iConfig";
import { SoundEffect } from "../../soundEffect";

export class AsteroidsManager extends ManagerBase {
  asteroids: Asteroid[] = [];
  asteroidModels: IAsteroids;
  levelCompleted: boolean = true;
  level: number = 1;
  explosionSounds: Map<SizeTypes,SoundEffect>
  levelBeatSound: SoundEffect;
  beatSoundTimer:GameTimer;
  beatDelays:number[]=[1000,500,300];
  increaseBeatTimer:GameTimer
  increaseBeatIndex:number=0;

  constructor(gameEngine: AsteroidsGame) {
    super(gameEngine);
    this.asteroidModels = gameEngine.configData.asteroids;
  }

  public setup() {
    this.beatSoundTimer=this.gameEngine.createTimer(500,()=>{
      this.levelBeatSound.play();
      this.beatSoundTimer.restart();
    })
    this.increaseBeatTimer=this.gameEngine.createTimer(15000,()=>{
      this.increaseBeatIndex=Math.min(this.beatDelays.length-1,this.increaseBeatIndex+1)
      this.beatSoundTimer.time=this.beatDelays[this.increaseBeatIndex]
    })
  }

  public loadSounds() {
    this.explosionSounds=new Map([
      [SizeTypes.SMALL,this.gameEngine.soundEffects.get('bangSmall')],
      [SizeTypes.MEDIUM,this.gameEngine.soundEffects.get('bangMedium')],
      [SizeTypes.LARGE,this.gameEngine.soundEffects.get('bangLarge')],
    ])
    this.levelBeatSound=this.gameEngine.soundEffects.get('beat1')
  }

  public update(timeDelta: number) {
    this._actors = [];
    if(this.hasLevelEnded()) {
      this.levelCompleted = true;
      this.beatSoundTimer.reset();
    }
    

    this.asteroids.forEach((a) => {
      if (a.collidedWith !== undefined) this.hit(a);
    });

    this.asteroids = this.asteroids.filter(
      (a) => a.collidedWith == undefined
    );

    this._actors.push(...this.asteroids);
   
    super.update(timeDelta);
  }

  public startLevel(level: number) {
    this.levelCompleted = false;
    this.level = level;
    this.createAsteroids(6);
    this.increaseBeatIndex=0;
    this.beatSoundTimer.time=this.beatDelays[0];
    this.beatSoundTimer.restart();
    this.increaseBeatTimer.restart();
  }

  public createAsteroid(pos: Vector, size: SizeTypes) {
    const aSize = this.asteroidModels.sizes.find((s) => s.size == size);
    const designIndex = Math.floor(
      this.gameEngine.random(this.asteroidModels.designs.length)
    );
    const asteroid = new Asteroid(this.asteroidModels.designs[designIndex]);
    const minSpeed = 30 * (1 + this.level / 100);
    const maxSpeed = 80 * aSize.speed
    const vel = this.gameEngine.randomRange(minSpeed, maxSpeed);
    asteroid.position = pos.copy();
    asteroid.velocity = Vector.random2D().mult(vel / 1000);
    asteroid.size = aSize.size as SizeTypes;
    asteroid.points = aSize.points;
    asteroid.scale = aSize.scale;
    this.asteroids.push(asteroid);
  }

  public createAsteroids(noOfAsteroids: number) {
    const screen = this.gameEngine.screenSize;
    const noGoRadius = screen.width / 4;
    const scrCntr = this.gameEngine.screenSize.center;
    for (let i = 0; i <= noOfAsteroids; i++) {
      let outside = false;
      let randPos: Vector;
      while (!outside) {
        randPos = new Vector().set(this.gameEngine.getRandomScreenPosition(1));
        outside = Vector.dist(randPos, scrCntr) > noGoRadius;
      }
      const position = new Vector().set(randPos);
      this.createAsteroid(position, SizeTypes.LARGE);
    }
  }

  public clear() {
    this.asteroids = [];
    this.beatSoundTimer.reset();
  }

  public hit(hitAsteroid: Asteroid) {
    this.explosionSounds.get(hitAsteroid.size).play();

    if (hitAsteroid.size === SizeTypes.SMALL) {
      this.gameEngine.explosionsManager.createExplosion(hitAsteroid.position);
      return;
    }
    const nextSize =
      hitAsteroid.size === SizeTypes.LARGE ? SizeTypes.MEDIUM : SizeTypes.SMALL;
    const posOffset=Vector.random2D().mult(1.5);
    const pos = hitAsteroid.position.add(posOffset);
    this.createAsteroid(pos, nextSize);
    this.createAsteroid(pos, nextSize);
  }

  private hasLevelEnded() {
    return (this.asteroids.length == 0 &&
    !this.gameEngine.saucerManager.saucer)
  }
}
