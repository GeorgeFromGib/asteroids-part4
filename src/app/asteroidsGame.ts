import { PlayerShipManager, ShipTurn } from './managers/playerShipManager';
import P5 from "p5";
import { sketch } from "./p5-sketch";
import * as configData from '../assets/config.json' 
import { Actor, IModel } from "./actors/actor";
import { AsteroidsManager } from './managers/asteroidsManager';

export class ScreenSize {
  width:number;
  height:number;
}

export class AsteroidsGame {
  _screenSize:ScreenSize;
  _prevElapsed = 0; 
  _playerManager:PlayerShipManager;
  _asteroidsManager: AsteroidsManager;
  _ge:P5;

  constructor() {
    new P5((p5) => sketch(p5, this.setup));
  }

  public setup = (p5: P5) => {
    this._ge=p5;
    // Creating canvas
    const scr_reduction = 0.8;
    const canvas = p5.createCanvas(
      p5.windowWidth * scr_reduction,
      p5.windowHeight * scr_reduction
    );
    canvas.parent("app");

    this._prevElapsed = p5.millis();

    // Redirect sketch functions
    p5.draw = () => this.gameLoop();
    p5.keyPressed = () => this.keyPressed(p5);
    p5.keyReleased = () => this.keyReleased(p5);

    this._screenSize=<ScreenSize>{width:p5.width,height:p5.height}
    
    // setup managers
    this._playerManager=new PlayerShipManager(this,configData.spaceship);
    this._playerManager.createShip();
    this._asteroidsManager=new AsteroidsManager(this,configData.asteroids);
    this._asteroidsManager.createAsteroids(10,p5.width,p5.height);
    
  };

  public keyPressed = (p5: P5) => {
    if (p5.keyCode == p5.RIGHT_ARROW) this._playerManager.turn(ShipTurn.RIGHT)
    if (p5.keyCode == p5.LEFT_ARROW) this._playerManager.turn(ShipTurn.LEFT)
    if (p5.keyCode == p5.UP_ARROW) this._playerManager.engine(true);
    if (p5.keyCode == 32) this._playerManager.fire(true);
  };

  public keyReleased = (p5: P5) => {
    if (p5.keyCode == p5.RIGHT_ARROW || p5.keyCode == p5.LEFT_ARROW)
      this._playerManager.turn(ShipTurn.STOP);
    if (p5.keyCode == p5.UP_ARROW) this._playerManager.engine(false);
    if (p5.keyCode == 32) this._playerManager.fire(false);
  };


  public gameLoop = () => {
    let actors:Actor[]=[];
    const timeDelta = this.getTimeDelta();

    this._ge.background(0);
    this._playerManager.update(timeDelta);
    this._asteroidsManager.update(timeDelta);

    actors.push(...this._playerManager.allActors);
    actors.push(...this._asteroidsManager.allActors);

    this._playerManager.checkCollisions(this._asteroidsManager);

    actors.forEach(actor => {
      this._ge.push();
      actor.render(this);
      this._ge.pop();
    });

    this._ge.stroke("white");
    this._ge.textSize(20);
    this._ge.text((1000/timeDelta).toFixed(2).toString(),this._ge.width/2,this._ge.height);

  };

  public drawClosedShape(model:IModel) {
    this._ge.noFill();
    this._ge.beginShape();
    model.vertexes.forEach(v=>{
      this._ge.vertex(v[0],v[1]);
    })
    this._ge.endShape(this._ge.CLOSE);
  }

  public drawVerticedShape(model:IModel) {
    model.vertices.forEach((v) => {
      const vx1 = model.vertexes[v[0]];
      const vx2 = model.vertexes[v[1]];
      this._ge.line(vx1[0], vx1[1], vx2[0], vx2[1]);
    })
  }
  public drawPoint(x:number,y:number) {
    this._ge.strokeWeight(2);
    this._ge.point(x,y);
  }

  private getTimeDelta() {
    const elapsedNow = Math.trunc(this._ge.millis());
    const timeDelta = elapsedNow - this._prevElapsed;
    this._prevElapsed = elapsedNow
    return timeDelta;
  }

  public random(max:number) {
    return this._ge.random(0,max);
  }
}
