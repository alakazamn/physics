const uuidv4 = require("uuid/v4")

export default class GameEvent {
  result: EventResult;
  getEventName = ​() : string => {
    return "Event";
  }
  setResult = (result : EventResult) : void => {
    this.result = result;
  }
  getResult = () : EventResult => {
    return this.result;
  }
  packet = () : any => {
    let event : any = this;
    event.name = this.getEventName();
    return event;
  }
}

export enum EventResult {
  ALLOW, DEFAULT, DENY
}
