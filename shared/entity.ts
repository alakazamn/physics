import { Player, BoundingBox } from "./shared";

export class Entity extends BoundingBox {
  constructor(x:number, y:number, width:number, height:number, private entityID : string, private type : EntityType) {
    super(x,y,width,height);
  }
  getEntityID = () => {
    return this.entityID;
  }
  getType = () : EntityType => {
    return this.type;
  }
  public static fromPacket = (entityPacket : any) : Entity => {
      return new Entity(entityPacket.x, entityPacket.y, entityPacket.width,entityPacket.height, entityPacket.entityID, entityPacket.entityType )
  }
}

export enum EntityType {
  PLAYER, ANIMAL
}
