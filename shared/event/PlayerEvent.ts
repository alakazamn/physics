import Player from "../player";
import GameEvent from "./event";

export default class PlayerEvent extends GameEvent {

  constructor(private player : Player)	 {
    super();
  }

 getEventName = ​() : String => {
    return "PlayerMoveEvent";
  }

  getPlayer​ = () : Player => {
    return this.player;
  }
}
