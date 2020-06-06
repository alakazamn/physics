import { Vector } from "../Engine";

export class GameLocation extends Vector {

  public constructor(x : number, y: number, readonly chunkX: number, readonly chunkY: number) {
    super(x, y);
  }

  getChunkX = () : number => {
    return this.chunkX;
  }
  getChunkY = () : number => {
    return this.chunkY;
  }

  public plusVec = (vec: Vector) : GameLocation =>{
    return new GameLocation(this.getX()+vec.getX(), this.getY() + vec.getY(), this.chunkX, this.chunkY);
  }

  setX = (x: number) : GameLocation =>{
    return new GameLocation(x, this.getY(), this.chunkX, this.chunkY);
  }
  plusX = (x: number) : GameLocation =>{
    return new GameLocation(this.getX()+x, this.getY(), this.chunkX, this.chunkY);
  }
  setY = (y: number) : GameLocation  =>{
    return new GameLocation(this.getX(), y, this.chunkX, this.chunkY);
  }
  plusY = (y: number) : GameLocation =>{
    return new GameLocation(this.getX(), this.getY()+y, this.chunkX, this.chunkY);
  }

  newChunkX = (x: number) : GameLocation =>{
    return new GameLocation(this.getX(), this.getY(), x, this.chunkY);
  }
  newChunkY = (y: number): GameLocation  =>{
    return new GameLocation(this.getX(), this.getY(), this.chunkX, y);
  }

  //modifying methods return a new chunk, to be loaded and put onto the server
}
