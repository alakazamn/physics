const uuidv4 = require("uuid/v4")

export default class GameEvent {
  result: EventResult;
  getEventName = ​() : String => {
    return "Event";
  }
  setResult = (result : EventResult) : void => {
    this.result = result;
  }
  getResult = () : EventResult => {
    return this.result;
  }
}

export enum EventResult {
  ALLOW, DEFAULT, DENY
}
