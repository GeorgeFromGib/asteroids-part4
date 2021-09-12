
import { AsteroidsGame } from '../../asteroidsGame';
import { ActorBase } from '../../shared/actors/base/actorBase';
import { ISpaceship } from "../../shared/interfaces/iConfig";
import { Vector2D } from '../../vector2d';

export enum ShipTurn {
    LEFT = -1,
    RIGHT = 1,
    STOP = 0,
}

export class SpaceshipActor extends ActorBase {
    protected _shipHeading:number=0;
    thrusting:boolean;

    constructor(protected shipData:ISpaceship) {
        super(shipData.model);
        this.scale=shipData.scale;
    }

    public turn(turn:ShipTurn) {
        this.rotationVel = this.shipData.rotationVel * turn;
    }

    public thrust() {
        const force=Vector2D.fromAngle(this.heading- Math.PI/2);
        force.mult(this.shipData.thrustVel);
        this.velocity.add(force);
    }

    public update=(timeDelta:number)=> {
        if(this.thrusting) this.thrust();
        this.velocity.mult(this.shipData.friction);
        super.update(timeDelta);
    }

    public draw(gameEngine: AsteroidsGame): void {
        gameEngine.drawClosedShape(this._transModel);
    }

}