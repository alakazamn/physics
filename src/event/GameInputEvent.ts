import Input, { InputType } from "../input/Input";
import { GameEvent } from "./Event";

export class GameInputEvent extends GameEvent {

  constructor(private inputType : InputType)	 {
    super();
  }

  getInputType = () : InputType => {
    return this.inputType;
  }
}

export class GameInputUpEvent extends GameInputEvent {
  constructor(inputType : InputType)	 {
    super(inputType);
  }
  getEventName = ​() : string => {
    return "GameInputUpEvent";
  }
}
export class GameInputDownEvent extends GameInputEvent {
  constructor(inputType : InputType)	 {
    super(inputType);
  }
  getEventName = ​() : string => {
    return "GameInputDownEvent";
  }
}
