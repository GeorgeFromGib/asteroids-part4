import { PlayerShipManager, ShipTurn } from './managers/playerShipManager';
import { Spaceship } from "./spaceship";
import P5, { Vector } from "p5";
import { sketch } from "./p5-sketch";
import * as configData from '../assets/config.json' 
import { Actor } from "./actors/actor";
import { AsteroidsManager } from './managers/asteroidsManager';
import { Asteroid } from './actors/asteroid';
import { Manager } from './managers/manager';

export class ScreenSize {
  width:number;
  height:number;
}

export class AsteroidsGame {
  _screenSize:ScreenSize;
  _prevElapsed = 0; 
  _playerManager:PlayerShipManager;
  _asteroidsManager: AsteroidsManager;

  constructor() {
    new P5((p5) => sketch(p5, this.setup));
  }

  public setup = (p5: P5) => {

    // Creating canvas
    const scr_reduction = 0.8;
    const canvas = p5.createCanvas(
      p5.windowWidth * scr_reduction,
      p5.windowHeight * scr_reduction
    );
    canvas.parent("app");

    this._prevElapsed = p5.millis();

    // Redirect sketch functions
    p5.draw = () => this.gameLoop(p5);
    p5.keyPressed = () => this.keyPressed(p5);
    p5.keyReleased = () => this.keyReleased(p5);

    this._screenSize=<ScreenSize>{width:p5.width,height:p5.height}
    
    // setup managers
    this._playerManager=new PlayerShipManager(this,configData.spaceship.model);
    this._playerManager.createShip(p5);
    this._asteroidsManager=new AsteroidsManager(this,configData.asteroids);
    this._asteroidsManager.createAsteroids(10,p5.width,p5.height);
    
  };

  public keyPressed = (p5: P5) => {
    if (p5.keyCode == p5.RIGHT_ARROW) this._playerManager.turn(ShipTurn.RIGHT)
    if (p5.keyCode == p5.LEFT_ARROW) this._playerManager.turn(ShipTurn.LEFT)
    if (p5.keyCode == p5.UP_ARROW) this._playerManager.thrust(true);
    if (p5.keyCode == 32) this._playerManager.fire(true);
  };

  public keyReleased = (p5: P5) => {
    if (p5.keyCode == p5.RIGHT_ARROW || p5.keyCode == p5.LEFT_ARROW)
      this._playerManager.turn(ShipTurn.STOP);
    if (p5.keyCode == p5.UP_ARROW) this._playerManager.thrust(false);
    if (p5.keyCode == 32) this._playerManager.fire(false);
  };


  public gameLoop = (p5: P5) => {
    let actors:Actor[]=[];
    const timeDelta = this.getTimeDelta(p5);

    p5.background(0);
    this._playerManager.update(timeDelta);
    this._asteroidsManager.update(timeDelta);

    actors.push(...this._playerManager.allActors);
    actors.push(...this._asteroidsManager.allActors);

    this._playerManager.checkCollisions(this._asteroidsManager);

    actors.forEach(actor => {
      p5.push();
      actor.render(p5);
      p5.pop();
    });

    
    
    // const collided=this._ship.hasCollided(this._asteroids);
    // if(collided)
    //   console.log(collided)

    p5.stroke("white");
    p5.textSize(20);
    p5.text((1000/timeDelta).toFixed(2).toString(),p5.width/2,p5.height);

  };

  private getTimeDelta(p5: P5) {
    const elapsedNow = Math.trunc(p5.millis());
    const timeDelta = elapsedNow - this._prevElapsed;
    this._prevElapsed = elapsedNow
    return timeDelta;
  }

  public static random(max:number) {
    return Math.floor(Math.random() * max);
  }
}
