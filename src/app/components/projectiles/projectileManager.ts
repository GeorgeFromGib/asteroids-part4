import { SaucerActor } from "../saucer/saucerActor";
import { SpaceshipActor } from "../player/spaceshipActor";
import { Vector } from "p5";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { ProjectileActor, ProjectileSource } from "./ProjectileActor";
import { ActorBase } from "../../shared/actors/base/actorBase";

export class ProjectileManager extends ManagerBase {
    projectiles: ProjectileActor[] = [];

    public setup() {

    }

    public update(timeDelta: number) {
        this._actors = [];
        this.projectiles = this.projectiles.filter(
            (p) => !p.expired && !p.collidedWith
        );
        this._actors.push(...this.projectiles);
        super.update(timeDelta);
    }

    public sourceProjectiles(source: ProjectileSource): ProjectileActor[] {
        return this.projectiles.filter((c) => c.source === source);
    }

    public addPlayerProjectile(
        ship: SpaceshipActor,
        projVelocity: number,
        projLife: number
    ) {
        const heading = ship.heading - Math.PI / 2;
        this.addProjectile(
            ProjectileSource.PLAYER,
            heading,
            ship,
            projVelocity,
            projLife
        );
        this.gameEngine.fireSound.play();
    }

    public addSaucerProjectile(
        saucer: SaucerActor,
        projVel: number,
        projLife: number
    ) {
        const projHeading = this.getRangeAndDirection(
            this.gameEngine.playerManager.ship.position,
            saucer.position,
            saucer.type.fudgeAim
        ).heading;
        this.addProjectile(
            ProjectileSource.SAUCER,
            projHeading,
            saucer,
            projVel,
            projLife
        );
    }

    private addProjectile(
        source: ProjectileSource,
        projHeading: number,
        actor: ActorBase,
        projVel: number,
        projLife: number
    ) {
        const gunPos = new Vector().set(actor.radius, 0).rotate(projHeading);
        const startPos = gunPos.add(actor.position);
        const vel = Vector.fromAngle(projHeading).mult(projVel);
        const proj = new ProjectileActor(source, startPos, vel, projLife);
        this.projectiles.push(proj);
    }

    protected getRangeAndDirection(
        source: Vector,
        target: Vector,
        fudgeAngle: number
    ): { range: number; heading: number } {
        const heading =
            source.copy().sub(target).heading() +
            this.gameEngine.randomRange(-fudgeAngle, fudgeAngle);
        const range = source.dist(target);
        return { range: range, heading: heading };
    }
}
