import Entity from "./entity";
import _ = require("lodash");

export default class Chunk {
  public constructor(readonly tiles : number[][][], private entity: Entity[]) {

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
    if(index == -1) {
      this.entity.push(e);
      return;
    }

    this.entity[index] = e;
  }
  public removeEntity(id : string) {
    let index = _.findIndex(this.entity, (a) => { return a.getEntityID() === id})
    if(index == -1) return null;
    else delete this.entity[index];
  }
  public rows = () : number => {
    return this.tiles.length;
  }
  public columns = () : number => {
    return this.tiles[0].length;
  }
  public layers = () : number => {
    return this.tiles[0][0].length;
  }
  public static fromPacket = (chunkPacket : any) : Chunk => {
      console.log(chunkPacket);
      var e : Entity[] = []
      for(const entityPacket of chunkPacket.entity) {
        e.push(Entity.fromPacket(entityPacket));
      }
      return new Chunk(chunkPacket.tiles, e)
  }
  //modifying methods return a new chunk, to be loaded and put onto the server
}
