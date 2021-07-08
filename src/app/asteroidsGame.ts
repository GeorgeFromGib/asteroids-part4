import { Spaceship } from './spaceship';
import P5 from "p5";
import { sketch } from "./p5-sketch";

export class AsteroidsGame {
  _rotDelta:number=0;
  _prevElapsed=0;
  private _ship: Spaceship;
  _thrusting:boolean=false;

  constructor() {
    new P5((p5) => sketch(p5, this.setup));
  }

  public setup = (p5: P5) => {
    // Creating and positioning the canvas
    const scr_reduction = 0.8;
    const canvas = p5.createCanvas(
      p5.windowWidth * scr_reduction,
      p5.windowHeight * scr_reduction
    );
    canvas.parent("app");

    this._prevElapsed=p5.millis();

    p5.draw = () => this.gameLoop(p5);
    p5.keyPressed = () => this.keyPressed(p5);
    p5.keyReleased=()=>this.keyReleased(p5);

    this._ship=new Spaceship();
    this._ship.setPositionXY(p5.width / 2, p5.height / 2)
  };

  public keyPressed = (p5: P5) => {
    const rotAmnt=p5.PI / 70;
    if (p5.keyCode == p5.RIGHT_ARROW) this._rotDelta= rotAmnt;
    if (p5.keyCode == p5.LEFT_ARROW) this._rotDelta = -rotAmnt;
    if (p5.keyCode == p5.UP_ARROW) this._thrusting=true;
  };

  public keyReleased=(p5:P5)=> {
    if(p5.keyCode==p5.RIGHT_ARROW || p5.keyCode==p5.LEFT_ARROW )
      this._rotDelta=0;
    if(p5.keyCode == p5.UP_ARROW)
      this._thrusting=false;
  }

  public gameLoop = (p5: P5) => {
    const elapsedNow=p5.millis();
    const timeDelta=elapsedNow-this._prevElapsed

    p5.background(0);

    //advance rotation angle
    //this._shipHeading += this._rotDelta;

    //Draw the spaceship
    if(this._thrusting)
      this._ship.thrust();
    this._ship.setRotateBy(this._rotDelta);
    this._ship.update(p5,timeDelta);
    this._ship.render(p5);
 
    p5.stroke("white");
    p5.textSize(32);
    p5.text(timeDelta.toString(), 10, 30);
    
    this._prevElapsed=p5.millis();
  };
}
