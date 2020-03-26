import PlayerEvent from "./PlayerEvent";
import Player from "../player";

export default class PlayerQuitEvent extends PlayerEvent {

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
