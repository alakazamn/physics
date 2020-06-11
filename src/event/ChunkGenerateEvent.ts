import { Chunk } from "../engine/Engine";
import { GameEvent } from "./Event";

export class ChunkGenerateEvent extends GameEvent {

  constructor()	 {
    super();
  }

 getEventName = ​() : string => {
    return "ChunkGenerateEvent";
  }
}
