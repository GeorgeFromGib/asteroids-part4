import {ActorBase} from "../../actors/base/actorBase";
import {AsteroidsGame, ScreenSize} from "../../../asteroidsGame";

export abstract class ManagerBase {
    protected _actors: ActorBase[] = [];

    constructor(protected gameEngine: AsteroidsGame) {
        this.gameEngine.managers.push(this);
        this.setup();
    }

    public abstract setup();

    public loadSounds() {
    };

    public update(timeDelta: number): void {
        this._actors.forEach((a) => {
            a.update(timeDelta);
            this.edgeWrap(a)
        });
    }

    public edgeWrap(actor: ActorBase) {
        this.wrapTopBottom(actor);
        this.wrapLeftRight(actor)
    };

    protected wrapLeftRight(actor: ActorBase) {
        const screen = this.gameEngine.screenSize;
        if (actor.position.x > screen.width + actor.radius)
            actor.position.x = -actor.radius;
        else if (actor.position.x < -actor.radius)
            actor.position.x = screen.width + actor.radius;
    }

    protected wrapTopBottom(actor: ActorBase) {
        const screen = this.gameEngine.screenSize;
        if (actor.position.y > screen.height + actor.radius)
            actor.position.y = -actor.radius;
        else if (actor.position.y < -actor.radius)
            actor.position.y = screen.height + actor.radius;
    }

    public render() {
        this._actors.forEach((actor) => {
            actor.render(this.gameEngine);
        });
    }

    public get actors(): ActorBase[] {
        return this._actors;
    }
}