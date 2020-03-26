import GameEvent from "./event";
import Input, { InputType } from "../../client/engine/input";

export default class GameInputEvent extends GameEvent {

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
}
export class GameInputDownEvent extends GameInputEvent {
  constructor(inputType : InputType)	 {
    super(inputType);
  }
}
