import { VerticedShapeActor } from './base/VerticedShapeActor';


import { ISaucerType, SaucerTypes } from "../managers/saucerManager";
import { IModel } from "./base/actor";
import { ClosedShapeActor } from "./base/ClosedShapeActor";


export class Saucer extends VerticedShapeActor {
  type:ISaucerType
  points:number;

  constructor(SaucerModel:IModel,type:ISaucerType) {
    super(SaucerModel);
    this.type=type;
    this.scale=type.scale;
    this.points=type.points;
  }

}