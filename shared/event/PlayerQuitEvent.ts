import { PlayerEvent, Player } from "../shared";

export class PlayerQuitEvent extends PlayerEvent {

  constructor(player : Player, private quitMessage : string)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerQuitEvent";
  }

  getMessage = () : string => {
    return this.quitMessage;
  }
}
