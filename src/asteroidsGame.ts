import P5 from "p5";
import { sketch } from "./app";
import { Spaceship } from "./spaceship";

export class AsteroidsGame {
  spaceShip: Spaceship;

  constructor() {
    this.spaceShip = new Spaceship();
    new P5((p5) => sketch(p5, p5.windowWidth, p5.windowHeight, this.gameLoop));
  }

  public gameLoop(p5: P5) {
    this.spaceShip.scale(p5, 2);
    this.spaceShip.translate(p5, p5.createVector(p5.width / 2, p5.height / 2));
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
