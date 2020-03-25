import Player from "../player";
import GameLocation from "../location";
import PlayerEvent from "./PlayerEvent";

export default class PlayerMoveEvent extends PlayerEvent {

  constructor(player : Player, private from : GameLocation, private to : GameLocation)	 {
    super(player);
  }
  getEventName = ​() : String => {
    return "PlayerMoveEvent";
  }

  getFrom = ​() : GameLocation => {
    return this.from;
  }
  getTo = ​() : GameLocation => {
    return this.to;
  }
}
