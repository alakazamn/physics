import { Chunk, GameEvent } from "../shared";

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
