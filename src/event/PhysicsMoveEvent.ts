import { GameEvent } from "./Event";
import { PhysicalObject, GameLocation } from "../Engine";

export class PhysicsMoveEvent extends GameEvent {

  constructor(private body : PhysicalObject, private from : GameLocation, private to : GameLocation)	 {
    super();
  }
  getEventName = ​() : string => {
    return "PhysicsMoveEvent";
  }
  getBody = ​() : PhysicalObject => {
    return this.body;
  }
  getFrom = ​() : GameLocation => {
    return this.from;
  }
  getTo = ​() : GameLocation => {
    return this.to;
  }
}
