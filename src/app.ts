import P5 from "p5";


// Creating the sketch itself
const sketch = (p5: P5) => {

	// The sketch setup method 
	p5.setup = () => {
		// Creating and positioning the canvas
		const canvas = p5.createCanvas(200, 200);
		canvas.parent("app");

		// Configuring the canvas
		p5.background("black");

	};

	// The sketch draw method
	p5.draw = () => {
		// DEMO: Let the circle instances draw themselves
        p5.fill(255);
        p5.rect(100, 100, 50, 50);
	};
};

new P5(sketch);