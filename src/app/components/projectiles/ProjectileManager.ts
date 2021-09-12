
import {ManagerBase} from "../../shared/managers/base/managerBase";
import {ProjectileActor, ProjectileSource} from "./ProjectileActor";
import {ActorBase} from "../../shared/actors/base/actorBase";
import {Vector2D} from '../../vector2d';

export class ProjectileManager extends ManagerBase {
    protected projectiles: ProjectileActor[] = [];

    public setup() {
    }

    public loadSounds() {
    }

    public update(timeDelta: number) {
        this._actors = [];
        this.projectiles = this.filterProjectiles();
        this._actors.push(...this.projectiles);
        super.update(timeDelta);
    }

    public sourceProjectiles(source: ProjectileSource): ProjectileActor[] {
        return this.projectiles.filter((c) => c.source === source);
    }

    public addPlayerProjectile(
        ship: ActorBase,
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
    }

    private addProjectile(
        source: ProjectileSource,
        projHeading: number,
        actor: ActorBase,
        projVel: number,
        projLife: number
    ) {
        const gunPos = new Vector2D(actor.radius, 0).rotate(projHeading);
        const startPos = gunPos.add(actor.position);
        const vel = Vector2D.fromAngle(projHeading).mult(projVel);
        const proj = new ProjectileActor(source, startPos, vel, projLife);
        this.projectiles.push(proj);
    }

    private filterProjectiles() {
        return this.projectiles.filter(
            (p) => !p.expired && !p.collidedWith);
    }

}