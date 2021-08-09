
import { SaucerActor } from '../saucer/saucerActor';
import { SpaceshipActor } from '../player/spaceshipActor';
import { Vector } from "p5";
import { ManagerBase } from "../../shared/managers/base/managerBase";
import { ProjectileActor, ProjectileSource } from './ProjectileActor';

export class ProjectileManager extends ManagerBase {
    projectiles: ProjectileActor[] = [];
  
    public update(timeDelta:number) {
        this._actors = [];
        this.projectiles = this.projectiles.filter(
            (p) => !p.expired && !p.collidedWith
        );
        this._actors.push(...this.projectiles)
        super.update(timeDelta)
    }

    
    public sourceProjectiles(source:ProjectileSource) : ProjectileActor[] {
        return this.projectiles.filter(c=>c.source===source)
    }
    

    public addPlayerProjectile(ship:SpaceshipActor,projVelocity:number,projLife:number) {
        const radius = ship.radius;
        const heading = ship.heading - Math.PI / 2;
        const gunPos = new Vector().set(radius, 0).rotate(heading);
        const startPos = gunPos.add(ship.position);
        const vel = Vector.fromAngle(heading)
            .mult(projVelocity)
            .add(ship.velocity);
        const proj = new ProjectileActor(ProjectileSource.PLAYER, startPos, vel,projLife);
        this.projectiles.push(proj);
    }

    public addSaucerProjectile(saucer:SaucerActor,projVel:number,projLife:number) {
        const radius = saucer.radius;
        const projHeading = this.getRangeAndDirection(
          this.gameEngine.playerManager.ship.position,
          saucer.position,
          saucer.type.fudgeAim
        ).heading;
        const gunPos = new Vector().set(radius, 0).rotate(projHeading);
        const startPos = gunPos.add(saucer.position);
        const vel = Vector.fromAngle(projHeading).mult(projVel);
        const proj = new ProjectileActor(ProjectileSource.SAUCER,startPos, vel, projLife);
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

    // private addProjectile(gunPos:Vector,heading:number,projVelocity:number,projectileLife:number) {

    //     const vel = Vector.fromAngle(heading).mult(projVelocity)
    //     const proj = new ParticleActor(gunPos, vel,projectileLife);
    //     this.projectiles.push(proj);
    // }
}