import { Vector } from 'p5';
import { ParticleActor } from '../../shared/actors/particleActor';

export enum ProjectileSource {
    PLAYER,
    SAUCER
}

export class ProjectileActor extends ParticleActor {
    constructor(public source:ProjectileSource,pos: Vector, vel: Vector, lifeTime: number = 1000) {
        super(pos, vel, lifeTime);
    }
}
