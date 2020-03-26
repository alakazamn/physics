export default class GameLocation {
  public constructor(readonly x : number, readonly y: number, readonly chunkX, readonly chunkY) {

  }

  getX = () : number => {
    return this.x;
  }
  getY = () : number => {
    return this.y;
  }
  getChunkX = () : number => {
    return this.chunkX;
  }
  getChunkY = () : number => {
    return this.chunkY;
  }

  newX = (x: number) : GameLocation =>{
    return new GameLocation(x, this.y, this.chunkX, this.chunkY);
  }
  plusX = (x: number) : GameLocation =>{
    return new GameLocation(this.x+x, this.y, this.chunkX, this.chunkY);
  }
  newY = (y: number) : GameLocation  =>{
    return new GameLocation(this.x, y, this.chunkX, this.chunkY);
  }
  plusY = (y: number) : GameLocation =>{
    return new GameLocation(this.x, this.y+y, this.chunkX, this.chunkY);
  }

  newChunkX = (x: number) : GameLocation =>{
    return new GameLocation(this.x, this.y, x, this.chunkY);
  }
  newChunkY = (y: number): GameLocation  =>{
    return new GameLocation(this.x, this.y, this.chunkX, y);
  }

  public static fromPacket = (locationPacket : any) : GameLocation => {
      return new GameLocation(locationPacket.x, locationPacket.y, locationPacket.chunkX, locationPacket.chunkY)
  }

  //modifying methods return a new chunk, to be loaded and put onto the server
}
