import { PhysicalObject } from "./Engine";
import _ = require("lodash");

/*
  Represents a piece of the game map, containing the layout of the scenery and any physical objects minus the player.
*/

export class Chunk {
  public static readonly WIDTH = 600;
  public static readonly HEIGHT = 15;

  public constructor(readonly tiles : boolean[][], private objects: PhysicalObject[], public readonly startY) {

  }
  public getObjects = () : PhysicalObject[] => {
    return this.objects;
  }
  //modifying methods return a new chunk, to be loaded and put onto the server
}
