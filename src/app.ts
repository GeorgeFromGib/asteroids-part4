import P5 from "p5";
import { AsteroidsGame } from "./asteroidsGame";

// Creating the sketch itself
export const sketch = (p5: P5, windowWidth: number, windowHeight: number, drawCallBack:(p5:P5)=>void) => {
  // The sketch setup method
  p5.setup = () => {
    // Creating and positioning the canvas
    const canvas = p5.createCanvas(windowWidth, windowHeight);
    canvas.parent("app");

    // Configuring the canvas
    p5.background("black");
  };

  // The sketch draw method
  p5.draw = () => {
    drawCallBack(p5);
    
  };
};

new AsteroidsGame()