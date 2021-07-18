import P5 from 'p5';

import { ScoresManager } from './managers/scoreManager';
import { TextManager } from './managers/textManager';
import { ExplosionManager } from './managers/explosionManager';
import { PlayerShipManager, ShipTurn } from './managers/playerShipManager';
import { sketch } from "./p5-sketch";
import * as ConfigData from '../assets/config.json' 
import { IModel } from "./actors/base/actor";
import { AsteroidsManager } from './managers/asteroidsManager';
import { Manager } from './managers/manager';
import { GameState, InitialGameState } from './gameStates/gameState';

export class ScreenSize {
  width:number;
  height:number;
}

export interface ISettings {
  lives:number;
  extraLife:number;
}

export enum Keys {
  RIGHT_ARROW,
  LEFT_ARROW,
  UP_ARROW,
  SPACE,
}

export class AsteroidsGame {
  screenSize:ScreenSize;
  playerManager:PlayerShipManager;
  asteroidsManager: AsteroidsManager;
  explosionsManager: ExplosionManager;
  managers:Manager[]=[];
  textManager: TextManager;
  scoresManager:ScoresManager;
  settings:ISettings;
  configData:typeof ConfigData;
  elapsedTime:number=0;
  gameState:GameState



  private _ge:P5;
  private _prevElapsed = 0; 
  private _keyMapper:Map<number,Keys>=new Map();

  constructor() {
    new P5((p5) => sketch(p5, this.setup));
  }

  public setup = (p5: P5) => {
    this._ge=p5;
    this.configData=ConfigData;
    // Creating canvas
    const scr_reduction = 0.8;
    const canvas = p5.createCanvas(
      p5.windowWidth * scr_reduction,
      p5.windowHeight * scr_reduction
    );
    canvas.parent("app");

    this._keyMapper=new Map([
      [p5.LEFT_ARROW,Keys.LEFT_ARROW],
      [p5.RIGHT_ARROW,Keys.RIGHT_ARROW],
      [p5.UP_ARROW,Keys.UP_ARROW],
      [32,Keys.SPACE]
    ]);

    this._prevElapsed = p5.millis();

    // Redirect sketch functions
    p5.draw = () => this.gameLoop();
    p5.keyPressed = () => this.keyPressed(p5);
    p5.keyReleased = () => this.keyReleased(p5);

    this.screenSize=<ScreenSize>{width:p5.width,height:p5.height}
    
    // setup managers
    this.playerManager=new PlayerShipManager(this);
    //this.playerManager.createShip();
    this.asteroidsManager=new AsteroidsManager(this);
    //this.asteroidsManager.createAsteroids(10);
    this.explosionsManager=new ExplosionManager(this);
    this.textManager=new TextManager(this);
    this.scoresManager=new ScoresManager(this);
    this.managers.push(...[this.playerManager,
      this.asteroidsManager,
      this.explosionsManager, 
      this.textManager,
      this.scoresManager])

    this.gameState=new InitialGameState(this);
  };

  public keyPressed = (p5: P5) => {
    const key=this._keyMapper.get(p5.keyCode);
    this.gameState.handleKeyPress(key)
  };

  public keyReleased = (p5: P5) => {
    const key=this._keyMapper.get(p5.keyCode);
    this.gameState.handleKeyRelease(key)
  };


  public gameLoop = () => {
    const timeDelta = this.getTimeDelta();

    this._ge.background(0);

    this.gameState.update(timeDelta);

    this.managers.forEach(manager => {
      manager.update(timeDelta);
      this._ge.push();
      manager.render();
      this._ge.pop();
    });

    this._ge.stroke("white");
    this._ge.textSize(20);
    //this._ge.text((1000/timeDelta).toFixed(2).toString(),this._ge.width/2,this._ge.height);

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
    this.elapsedTime=Math.trunc(this._ge.millis());
    const timeDelta = this.elapsedTime - this._prevElapsed;
    this._prevElapsed = this.elapsedTime
    return timeDelta;
  }

  public random(max:number) {
    return this._ge.random(0,max);
  }

  public randomRange(min:number,max:number) {
    return this._ge.random(min,max);
  }
}
