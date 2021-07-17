import { ScoresManager } from './managers/scoreManager';
import { TextManager } from './managers/textManager';
import { ExplosionManager } from './managers/explosionManager';
import { PlayerShipManager, ShipTurn } from './managers/playerShipManager';
import P5 from "p5";
import { sketch } from "./p5-sketch";
import * as ConfigData from '../assets/config.json' 
import { Actor, IModel } from "./actors/base/actor";
import { AsteroidsManager } from './managers/asteroidsManager';
import { Manager } from './managers/manager';

export class ScreenSize {
  width:number;
  height:number;
}

export interface ISettings {
  lives:number;
  extraLife:number;
}

export class AsteroidsGame {
  _screenSize:ScreenSize;
  _prevElapsed = 0; 
  _playerManager:PlayerShipManager;
  _asteroidsManager: AsteroidsManager;
  _ge:P5;
  _explosionsManager: ExplosionManager;
  _managers:Manager[]=[];
  _textManager: TextManager;
  _scoresManager:ScoresManager;
  settings:ISettings;
  configData:typeof ConfigData;

  constructor() {
    new P5((p5) => sketch(p5, this.setup));
  }

  public setup = (p5: P5) => {
    this._ge=p5;
    this.settings=ConfigData.settings;
    this.configData=ConfigData;
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
    //p5.frameRate(30);
    this._screenSize=<ScreenSize>{width:p5.width,height:p5.height}
    
    // setup managers
    this._playerManager=new PlayerShipManager(this);
    this._playerManager.createShip();
    this._asteroidsManager=new AsteroidsManager(this);
    this._asteroidsManager.createAsteroids(10);
    this._explosionsManager=new ExplosionManager(this);
    this._textManager=new TextManager(this);
    this._scoresManager=new ScoresManager(this);
    this._managers.push(...[this._playerManager,
      this._asteroidsManager,
      this._explosionsManager, 
      this._textManager,
      this._scoresManager])
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
    const timeDelta = this.getTimeDelta();

    this._ge.background(0);

    this._managers.forEach(manager => {
      manager.update(timeDelta);
      manager.render();
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

  public randomRange(min:number,max:number) {
    return this._ge.random(min,max);
  }
}
