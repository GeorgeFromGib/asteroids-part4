import P5 from "p5";

// Creating the sketch itself
const sketch = (p5: P5, windowWidth: number, windowHeight: number) => {
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
    //Draw the spaceship
    p5.translate(p5.width / 2, p5.height / 2);
	p5.scale(2);
	p5.noFill();
	p5.stroke('white');
	
    p5.beginShape();
    p5.vertex(0, -5);
    p5.vertex(4, 5);
    p5.vertex(0, 1);
    p5.vertex(-4, 5);
    p5.endShape(p5.CLOSE);
  };
};

new P5((p5) => sketch(p5, 400, 400));
