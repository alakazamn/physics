import { GameEvent } from "./Event";
import { PhysicalObject, Vector } from "../engine/Engine";

export class PhysicsMoveEvent extends GameEvent {

  constructor(private body : PhysicalObject, private from : Vector, private to : Vector)	 {
    super();
  }
  getEventName = ​() : string => {
    return "PhysicsMoveEvent";
  }
  getBody = ​() : PhysicalObject => {
    return this.body;
  }
  getFrom = ​() : Vector => {
    return this.from;
  }
  getTo = ​() : Vector => {
    return this.to;
  }
}
