import P5 from "p5";

// Creating the sketch itself
export const sketch = (p5: P5, setupCallBack:(p5:P5)=>void) => {
  // The sketch setup method
  p5.setup = () => {
    setupCallBack(p5);
  };

};

