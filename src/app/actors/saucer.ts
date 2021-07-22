import { VerticedShapeActor } from './base/VerticedShapeActor';


import { ISaucerSize, saucerType } from "../managers/saucerManager";
import { IModel } from "./base/actor";
import { ClosedShapeActor } from "./base/ClosedShapeActor";


export class Saucer extends VerticedShapeActor {
  type:ISaucerSize
  points:number;

  constructor(SaucerModel:IModel,type:ISaucerSize) {
    super(SaucerModel);
    this.type=type;
    this.scale=type.scale;
    this.points=type.points;
  }

}