import BoundingBox from "./boundingbox";
import GameLocation from "./location";

export default class Entity extends BoundingBox {
  constructor(x:number, y:number, width:number, height:number) {
    super(x,y,width,height);
  }

}
