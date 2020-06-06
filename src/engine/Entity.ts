import { Direction, PhysicalObject } from "../Engine";

export class Entity extends PhysicalObject {
  constructor(x:number, y:number, width:number, height:number, mass:number, private entityID : string, private type : EntityType, private facing : Direction = Direction.RIGHT, private moving = false) {
    super(x,y,width,height, mass);
  }
  setDirection = (facing : Direction) => {
    this.facing = facing;
  }
  getDirection = () => {
    return this.facing;
  }
  setMoving = (moving : boolean) => {
    this.moving = moving;
  }
  getMoving = () => {
    return this.moving;
  }
  getEntityID = () => {
    return this.entityID;
  }
  getType = () : EntityType => {
    return this.type;
  }
}
export enum EntityType {
  PLAYER, ANIMAL
}
