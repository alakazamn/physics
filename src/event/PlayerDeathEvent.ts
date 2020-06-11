import { PlayerEvent } from "./PlayerEvent";
import { Player } from "../engine/Engine";

export class PlayerDeathEvent extends PlayerEvent {

  constructor(player : Player)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerDeathEvent";
  }
}
