import { AsteroidsGame } from "../../../asteroidsGame";
import { Vector2D } from "../../../vector2d";
import { IModel } from "../../interfaces/iConfig";

export abstract class ActorBase {
    protected _transModel: IModel;
    public position: Vector2D = new Vector2D(0, 0);
    public heading: number = 0.0;
    public scale: number = 1.0;
    public velocity: Vector2D = new Vector2D(0, 0);
    public rotationVel: number = 0.0;
    public collidedWith: ActorBase = undefined;
    public radius: number = 0;
    public show: boolean = true;

    protected constructor(public model: IModel) {
        this._transModel = {
            vertexes: [],
            vertices: this.model.vertices,
            radius: this.model.radius,
        };
        this.radius = this._transModel.radius;
    }

    public update(timeDelta: number) {
        this.radius = this.model.radius * this.scale;
        this.position.add(this.velocity.copy().mult(timeDelta));
        this.heading += this.rotationVel * timeDelta;
        this._transModel.vertexes = [];
        this.model.vertexes.forEach((av) => {
            let v = new Vector2D(av[0], av[1]);
            v.mult(this.scale);
            v.rotate(this.heading);
            v.add(this.position);
            this._transModel.vertexes.push([v.x, v.y]);
        });
    }

    public hasCollided(otherActors: ActorBase[]): ActorBase {
        this.collidedWith = undefined;
        otherActors.forEach((actor) => {
            if (
                this.position.dist(actor.position) <
                actor.radius + this.radius
            ) {
                if (this != actor && !actor.collidedWith) {
                    this.collidedWith = actor;
                    actor.collidedWith = this;
                    return;
                }
            }
        });
        return this.collidedWith;
    }

    public render(gameEngine: AsteroidsGame) {
        if (!this.show) return;
        this.draw(gameEngine);
    }

    public abstract draw(gameEngine: AsteroidsGame);
}
