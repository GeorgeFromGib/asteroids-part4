import { Actor } from "../actors/base/actor";
import { AsteroidsGame, ScreenSize } from "../../asteroidsGame";

export abstract class Manager{
  protected _actors: Actor[] = [];

  constructor(protected gameEngine: AsteroidsGame) {
  }

  public update(timeDelta: number): void {
    this._actors.forEach((a) => {
      a.update(timeDelta);
      this.edgeWrap(a)
    });
  }

  public edgeWrap(actor:Actor)  {
    const screen=this.gameEngine.screenSize;
    if (actor.position.x > screen.width + actor.radius)
      actor.position.x = -actor.radius;
    else if (actor.position.x < -actor.radius)
      actor.position.x = screen.width + actor.radius;

    if (actor.position.y > screen.height + actor.radius)
      actor.position.y = -actor.radius;
    else if (actor.position.y < -actor.radius)
      actor.position.y = screen.height + actor.radius;
  };

  public render() {
    this._actors.forEach((actor) => {
      actor.render(this.gameEngine);
    });
  }

  public get allActors(): Actor[] {
    return this._actors;
  }
}
