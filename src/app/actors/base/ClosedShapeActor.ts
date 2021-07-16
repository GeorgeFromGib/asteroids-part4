import { AsteroidsGame } from "../../asteroidsGame";
import { Actor } from "./actor";


export class ClosedShapeActor extends Actor {

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawClosedShape(this._transModel);
  }

}
