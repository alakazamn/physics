import PlayerEvent from "./PlayerEvent";
import Player from "../player";

export default class PlayerJoinEvent extends PlayerEvent {

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
