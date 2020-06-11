import { Vector } from "./Engine";

/*
    Represents a rectangle with position and two dimensions.
*/

export class BoundingBox {
  private loc : Vector;
  public constructor(x : number, y: number, public width: number, public height: number) {
    this.loc = new Vector(x,y);
  }
  getX = () : number => {
    return this.loc.getX();
  }
  getY = () : number => {
    return this.loc.getY();
  }

  setLocation = (location : Vector) => {
    this.loc = location;
  }
  getLocation = () => {
    return this.loc; //fix chunks
  }
  centerX = () : number =>{
    return (this.width/2) + this.getX();
  }
  centerY = () : number => {
    return (this.height/2) + this.getY();
  }
}
