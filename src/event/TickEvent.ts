import { GameEvent } from "../event/Event";
import { Chunk, Player } from "../Engine";

export class TickEvent extends GameEvent {
  public static readonly TPS = 20.0
  public static readonly TPMS = TickEvent.TPS / 1000
  
  constructor(private ticks : number, private chunk : Chunk, private player : Player)	 {
    super();
  }
  getEventName = ​() : string => {
    return "TickEvent";
  }

  getTicks = () => {
    return this.ticks
  }
  getPlayer​ = () : Player => {
    return this.player;
  }
  getChunk = () : Chunk => {
    return this.chunk;
  }
}
