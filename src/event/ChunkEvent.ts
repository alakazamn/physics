import { Chunk } from "../Engine";
import { GameEvent } from "./Event";

export class ChunkEvent extends GameEvent {

  constructor(private chunk : Chunk)	 {
    super();
  }

 getEventName = ​() : string => {
    return "ChunkEvent";
  }

  getChunk = () : Chunk => {
    return this.chunk;
  }
}
