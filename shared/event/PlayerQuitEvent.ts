import PlayerEvent from "./PlayerEvent";
import Player from "../player";

export default class PlayerQuitEvent extends PlayerEvent {

  constructor(player : Player, private quitMessage : String)	 {
    super(player);
  }
  getEventName = ​() : String => {
    return "PlayerQuitEvent";
  }

  getMessage = () : String => {
    return this.quitMessage;
  }
}
