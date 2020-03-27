import { Player, PlayerEvent } from "../shared";

export class PlayerJoinEvent extends PlayerEvent {

  constructor(player : Player, private joinMessage : string)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerJoinEvent";
  }

  getMessage = () : string => {
    return this.joinMessage;
  }
}
