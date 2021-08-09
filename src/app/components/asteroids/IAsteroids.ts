import { IModel } from "../../shared/actors/base/actorBase";
import { IAsteroidSize } from "./IAsteroidSize";

export interface IAsteroids {
  designs: IModel[];
  sizes: IAsteroidSize[];
}
