import { GameEvent } from "./Event";
import { Player } from "../Engine";

export class PlayerEvent extends GameEvent {

  constructor(private player : Player)	 {
    super();
  }

  getEventName = ​() : string => {
    return "PlayerEvent";
  }

  getPlayer​ = () : Player => {
    return this.player;
  }
}
