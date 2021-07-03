import P5, { Vector } from "p5";

export interface AVector {
  x: number;
  y: number;
}

export class Spaceship {
  vectors: AVector[] = [
    { x: 0, y: -10 },
    { x: 8, y: 10 },
    { x: 0, y: 2 },
    { x: -8, y: 10 },
  ];
  transVectors: Vector[];

  public scale(p5: P5, scale: number) {
    this.transVectors = [];
    this.vectors.forEach((av) => {
      let v = p5.createVector(av.x, av.y);
      v = v.mult(scale);
      this.transVectors.push(v);
    });
  }

  public render(p5: P5) {
    p5.push();

    p5.pop();
  }
}
