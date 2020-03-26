import GameEvent from "./event";
import Chunk from "../chunk";

export default class ChunkEvent extends GameEvent {

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
