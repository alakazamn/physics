import Entity from "./entity";

export default class Chunk {
  public constructor(readonly tiles : number[][], readonly entity: Entity[]) {

  }

  public rows = () : number => {
    return this.tiles.length;
  }
  public columns = () : number => {
    return this.tiles[0].length;
  }

  //modifying methods return a new chunk, to be loaded and put onto the server
}
