import { PlayerEvent } from "./PlayerEvent";
import { Player, Vector } from "../engine/Engine";

export class PlayerMoveEvent extends PlayerEvent {

  constructor(player : Player, private from : Vector, private to : Vector)	 {
    super(player);
  }
  getEventName = ​() : string => {
    return "PlayerMoveEvent";
  }

  getFrom = ​() : Vector => {
    return this.from;
  }
  getTo = ​() : Vector => {
    return this.to;
  }
}
