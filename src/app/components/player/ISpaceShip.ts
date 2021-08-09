import { IModel } from "../../shared/actors/base/actorBase";


export interface ISpaceShip {
    ship: IModel;
    thrust: IModel;
    rotationVel: number;
    thrustVel: number;
    friction: number;
    projectileVel: number;
    rateOfFire: number;
    projectileLife: number;
}
