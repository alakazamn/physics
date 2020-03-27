import { Player, PlayerEvent } from "../shared";

export class PlayerLoginEvent extends PlayerEvent {

  constructor(player : Player)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerLoginEvent";
  }
}
