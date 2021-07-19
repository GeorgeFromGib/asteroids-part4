import { AsteroidsGame, Keys } from "../asteroidsGame";

export abstract class GameState {
  constructor(protected gameEngine: AsteroidsGame) {
    this.setup();
  }

  public abstract setup();

  public abstract update(timeDelta: number);

  public abstract handleKeyPress(key: Keys);

  public abstract handleKeyRelease(key: Keys);

  public abstract nextState();
}
