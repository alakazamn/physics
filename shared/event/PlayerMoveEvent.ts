import { PlayerEvent, GameLocation, Player } from "../shared";


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
