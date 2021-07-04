import P5, { Vector } from "p5";

export class Spaceship {
  vertices: number[][] = [
    [0, -10],
    [8, 10],
    [4, 6],
    [-4, 6],
    [-8, 10],
  ];

  _transVectors: Vector[];
  _position: Vector;
  _rotationAngle: number;
  _scale: number;

  public setPosition = (pos: Vector) => {
    this._position = pos;
  };

  public setRotation = (angle: number) => {
    this._rotationAngle = angle;
  };

  public setScale = (scale: number) => {
    this._scale = scale;
  };

  public update(p5: P5) {
    this._transVectors = [];
    this.vertices.forEach((av) => {
      let v = p5.createVector(av[0], av[1]);
      v.mult(this._scale);
      v.rotate(this._rotationAngle);
      v.add(this._position);
      this._transVectors.push(v);
    });
  }

  public render(p5: P5) {
    p5.push();
    p5.beginShape();
    this._transVectors.forEach((v) => {
      p5.vertex(v.x, v.y);
    });
    p5.endShape(p5.CLOSE);
    p5.pop();
  }
}
