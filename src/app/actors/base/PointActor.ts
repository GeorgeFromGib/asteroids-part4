import { AsteroidsGame } from "../../asteroidsGame";
import { Actor } from "./actor";


export class PointActor extends Actor {

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawPoint(this.position.x, this.position.y);
  }

}
