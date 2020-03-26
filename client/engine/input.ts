import Renderer from "../graphics/Renderer";
import Core from "./core";
import Keyboard from "./keyboard";
import Dispatch from "./dispatch";
import GameInputEvent, { GameInputUpEvent, GameInputDownEvent } from "../../shared/event/GameInputEvent";

export default class Input {
  //modifiable
  inputState : Boolean[] = new Array(Object.keys(InputType).filter(k => (k as any) instanceof Boolean).length);


  private static instance : Input;

  private constructor() {}

  public static getInstance() : Input {
    if(!Input.instance) {
      Input.instance = new Input();
    }
    return Input.instance;
  }

  isDown = (i : InputType) : Boolean => {
    return this.inputState[i];
  }

  up = (i : InputType) => {
    this.inputState[i] = false;
    Dispatch.fire(new GameInputUpEvent(i));
  }

  down = (i : InputType) => {
    this.inputState[i] = true;
    Dispatch.fire(new GameInputDownEvent(i));
  }


  /*
  * Stuff to do when game loads
  */
  load = () => {
    Keyboard.getInstance().load();
  }
}


export enum InputType {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  FULLSCREEN
}
