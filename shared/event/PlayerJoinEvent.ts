import PlayerEvent from "./PlayerEvent";
import Player from "../player";

export default class PlayerJoinEvent extends PlayerEvent {

  constructor(player : Player, private joinMessage : String)	 {
    super(player);
  }
  getEventName = ​() : String => {
    return "PlayerQuitEvent";
  }

  getMessage = () : String => {
    return this.joinMessage;
  }
}
