import { GameLocation } from "../Engine";
import { GameEvent } from "../event/Event";

export class EntityMoveEvent extends GameEvent {

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
