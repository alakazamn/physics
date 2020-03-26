import PlayerEvent from "./PlayerEvent";
import Player from "../player";

export default class PlayerLoginEvent extends PlayerEvent {

  constructor(player : Player)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerLoginEvent";
  }
}
