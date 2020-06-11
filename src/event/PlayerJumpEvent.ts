import { PlayerEvent } from "./PlayerEvent";
import { Player } from "../engine/Engine";

export class PlayerJumpEvent extends PlayerEvent {

  constructor(player : Player)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerJumpEvent";
  }
}
