import Dispatch from "./dispatch";
import Keyboard from "./keyboard";
import { GameInputUpEvent, GameInputDownEvent } from "../Events";


export default class Input {
  //modifiable
  readonly keys = Object.keys(InputType).filter(k => (k as any) instanceof Boolean);
  inputState : Boolean[] = new Array(this.keys.length);


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

  onblur = () => {
    for(var i = 0; i< this.inputState.length; i++) {
        if(this.inputState[i]) {
          this.up(i);
        }
    }
  }
  /*
  * Stuff to do when game loads
  */
  load = () => {
    Keyboard.getInstance().load();
    window.addEventListener("blur", this.onblur, false)
  }
}


export enum InputType {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  FULLSCREEN
}
