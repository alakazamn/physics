import { Entity, EntityType } from "../Engine";
import _ = require("lodash");

export class Chunk {
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 15;

  public constructor(readonly tiles : number[][], private entity: Entity[], readonly biomes : number[]) {

  }
  public getEntities = () : Entity[] => {
    return this.entity;
  }
  public getEntity = (id : string) : Entity => {
    let index = _.findIndex(this.entity, (a) => { return a.getEntityID() === id})
    if(index === -1) return null;
    else return this.entity[index];
  }
  public setEntity = (id : string, e : Entity) => {
    let index = _.findIndex(this.entity, (a) => { return a.getEntityID() === id})
    if(index === -1) {
      this.entity.push(e);
      return;
    }

    this.entity[index] = e;
  }
  public removeEntity = (id : string) => {
    let index = _.findIndex(this.entity, (a) => { return a.getEntityID() === id})
    if(index === -1) return null;
    else this.entity.splice(index,1);
  }
  //modifying methods return a new chunk, to be loaded and put onto the server
}
