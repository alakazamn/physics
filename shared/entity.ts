import BoundingBox from "./boundingbox";
import GameLocation from "./location";

export default class Entity extends BoundingBox {
  constructor(x:number, y:number, width:number, height:number, private entityID : string) {
    super(x,y,width,height);
  }
  getEntityID = () => {
    return this.entityID;
  }
  public static fromPacket = (entityPacket : any) : Entity => {
      return new Entity(entityPacket.x, entityPacket.y, entityPacket.width,entityPacket.height, entityPacket.entityID )
  }
}
