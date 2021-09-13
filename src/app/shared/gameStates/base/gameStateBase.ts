import {AsteroidsGame, Keys} from "../../../asteroidsGame";

export abstract class GameStateBase {

    constructor(protected gameEngine: AsteroidsGame) {
        this.setup();
    }

    protected abstract setup();

    public abstract update(timeDelta: number);

    public handleKeyPress(key: Keys) {
    };

    public handleKeyRelease(key: Keys) {
    };

    public handleKeyMouseClick() {
    }

    public abstract nextState();
}