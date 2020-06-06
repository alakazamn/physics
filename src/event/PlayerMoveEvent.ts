import { PlayerEvent } from "./PlayerEvent";
import { Player, GameLocation } from "../Engine";

export class PlayerMoveEvent extends PlayerEvent {

  constructor(player : Player, private from : GameLocation, private to : GameLocation)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerMoveEvent";
  }

  getFrom = ​() : GameLocation => {
    return this.from;
  }
  getTo = ​() : GameLocation => {
    return this.to;
  }
}
