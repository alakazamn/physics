import { GameLocation } from "../Engine";

export class BoundingBox {
  private loc : GameLocation;
  public constructor(x : number, y: number, public width: number, public height: number) {
    this.loc = new GameLocation(x,y,0,0);
  }
  getX = () : number => {
    return this.loc.getX();
  }
  getY = () : number => {
    return this.loc.getY();
  }

  setLocation = (location : GameLocation) => {
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

  //modifying methods return a new chunk, to be loaded and put onto the server
}
