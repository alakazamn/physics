import { GameLocation } from "./shared";

export class BoundingBox extends GameLocation {
  public constructor(public x : number, public y: number, public width: number, public height: number) {
    super(x,y,0,0); //TODO CHUNKS
  }
  getX = () : number => {
    return this.x;
  }
  getY = () : number => {
    return this.y;
  }

  setLocation = (location : GameLocation) => {
    this.x = location.x;
    this.y = location.y;
  }
  getLocation = () => {
    return new GameLocation(this.x,this.y, 0,0); //fix chunks
  }

  setX = (x: number) =>{
    this.x = x;
  }
  setY = (y: number) =>{
    this.y = y;
  }
  centerX = () : number =>{
    return (this.width/2) + this.x;
  }
  centerY = () : number => {
    return (this.height/2) + this.y;
  }

  //modifying methods return a new chunk, to be loaded and put onto the server
}
