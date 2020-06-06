import { PlayerEvent } from "./PlayerEvent";
import { Player } from "../Engine";

export class PlayerStopEvent extends PlayerEvent {

  constructor(player : Player)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerStopEvent";
  }
}
