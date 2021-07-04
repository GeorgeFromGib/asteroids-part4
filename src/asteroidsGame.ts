import { Spaceship } from './spaceship';
import P5 from "p5";
import { sketch } from "./app";

export class AsteroidsGame {
  spaceShip: Spaceship;

  constructor() {
    new P5((p) => sketch(p, this.setup, this.gameLoop));
  }

  public setup=(p5: P5)=> {
    // Creating and positioning the canvas
    const canvas = p5.createCanvas(p5.windowWidth*0.8, p5.windowHeight*0.8);
    canvas.parent("app");

    // Configuring the canvas
    p5.background("black");
    this.spaceShip = new Spaceship();
    this.spaceShip.setPosition(p5.createVector(p5.width / 2, p5.height / 2))
    this.spaceShip.setScale(2);
    this.spaceShip.setRotation(p5.PI)
  }

  public gameLoop=(p5: P5)=> {
    this.spaceShip.update(p5);
    p5.noFill();
    p5.stroke('white');
    this.spaceShip.render(p5);
    //Draw the spaceship
    //   p5.translate(p5.width / 2, p5.height / 2);
    //   //p5.strokeWeight(0.5);
    //   p5.noFill();
    //   p5.stroke('white');

    //     //p5.scale(2);

    //   p5.beginShape();
    //   p5.vertex(0, -10);
    //   p5.vertex(8, 10);
    //   p5.vertex(0, 2);
    //   p5.vertex(-8, 10);
    //   p5.endShape(p5.CLOSE);
  }
}
