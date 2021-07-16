import { AsteroidsGame } from "../../asteroidsGame";
import { Actor } from "./actor";


export class VerticedShapeActor extends Actor {

  public draw(gameEngine: AsteroidsGame): void {
    gameEngine.drawVerticedShape(this._transModel);
  }

}
