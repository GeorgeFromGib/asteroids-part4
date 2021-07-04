import P5 from "p5";
import { AsteroidsGame } from "./asteroidsGame";

// Creating the sketch itself
export const sketch = (p5: P5, setupCallBack:(p5:P5)=>void, drawCallBack:(p5:P5)=>void) => {
  // The sketch setup method
  p5.setup = () => {
    setupCallBack(p5);
  };

  // The sketch draw method
  p5.draw = () => {
    drawCallBack(p5);
  
  };
};

new AsteroidsGame()