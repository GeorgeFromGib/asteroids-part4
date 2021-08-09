import { IModel } from "../../shared/actors/base/actorBase";
import { ISaucerTypeProfile } from "./ISaucerTypeProfile";


export interface ISaucer {
  model: IModel;
  profiles: ISaucerTypeProfile[];
  projectileVel: number;
  projectileLife: number;
  rateOfFire: number;
}
