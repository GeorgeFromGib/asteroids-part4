import { Spaceship } from "./spaceship";
import P5, { Vector } from "p5";
import { sketch } from "./p5-sketch";
import * as configData from '../assets/config.json' 
import { Actor } from "./actor";
import { Asteroid } from "./asteroid";



export class AsteroidsGame {
  _rotDelta: number = 0;
  _prevElapsed = 0;
  private _ship: Spaceship;
  _thrusting: boolean = false;
  _actors:Actor[]=[];

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

    this._ship = new Spaceship(configData.spaceship.model);
    this._ship.positionXY(p5.width / 2, p5.height / 2);

    //this.addActor(this._ship);

    for(let i=0;i<=10;i++) {
      const asteroid=new Asteroid(configData.asteroids.designs[0].model);
      asteroid.position=new Vector().set(p5.random(p5.width),p5.random(p5.height));
      asteroid.rotationVel=Math.PI/250
      asteroid.velocity=Vector.random2D().mult(0.5);
      asteroid.scale=4;
      this.addActor(asteroid);
    }
    
  };

  public keyPressed = (p5: P5) => {
    const rotAmnt = p5.PI / 70;
    if (p5.keyCode == p5.RIGHT_ARROW) this._rotDelta = rotAmnt;
    if (p5.keyCode == p5.LEFT_ARROW) this._rotDelta = -rotAmnt;
    if (p5.keyCode == p5.UP_ARROW) this._thrusting = true;
  };

  public keyReleased = (p5: P5) => {
    if (p5.keyCode == p5.RIGHT_ARROW || p5.keyCode == p5.LEFT_ARROW)
      this._rotDelta = 0;
    if (p5.keyCode == p5.UP_ARROW) this._thrusting = false;
  };

  public addActor(actor:Actor) {
    this._actors.push(actor);
  }

  public gameLoop = (p5: P5) => {
    const elapsedNow = p5.millis();
    const timeDelta = elapsedNow - this._prevElapsed;
    this._prevElapsed = p5.millis();

    p5.background(0);
    
    //Draw the spaceship
    if (this._thrusting) this._ship.thrust();
    this._ship.rotateBy(this._rotDelta);

    this._actors.forEach(actor => {
      actor.update(p5,timeDelta);
      actor.render(p5);
    });


    p5.stroke("white");
    p5.textSize(32);
    p5.text((1000/timeDelta).toFixed(2).toString(), 10, 30);

    
  };
}
