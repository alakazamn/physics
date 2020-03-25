import BoundingBox from "./boundingbox";

export default class Entity extends BoundingBox {
  constructor(x:number, y:number, width:number, height:number) {
    super(x,y,width,height);
  }
}
