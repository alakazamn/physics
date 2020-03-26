import Player from "../player";
import GameLocation from "../location";
import GameEvent from "./event";

export default class EntityMoveEvent extends GameEvent {

  constructor(private entityID : string, private from : GameLocation, private to : GameLocation)	 {
    super();
  }
  getEventName = ​() : string => {
    return "EntityMoveEvent";
  }

  getEntityID = () => {
    return this.entityID
  }
  getFrom = ​() : GameLocation => {
    return this.from;
  }
  getTo = ​() : GameLocation => {
    return this.to;
  }
}
