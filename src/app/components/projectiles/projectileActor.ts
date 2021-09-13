import { ParticleActor } from '../../shared/actors/particleActor';
import { Vector2D } from '../../vector2d';

export enum ProjectileSource {
    PLAYER,
    SAUCER
}

export class ProjectileActor extends ParticleActor {
    constructor(public source:ProjectileSource,pos: Vector2D, vel: Vector2D, lifeTime: number = 1000) {
        super(pos, vel, lifeTime);
    }
}