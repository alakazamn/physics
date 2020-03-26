import Renderer from "../graphics/Renderer";
import Input  from "./input";
import { InputType }  from "./input";
import Core from "./core";

export default class Keyboard {
  //modifiable

  private static instance : Keyboard;

  private constructor() {}

  public static getInstance() : Keyboard {
    if(!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  keydown = (event) => {
    Input.getInstance().down(this.map(event.keyCode));
  }

  keyup = (event) => {
    Input.getInstance().up(this.map(event.keyCode));
  }

  map = (key : number) : InputType => {
    //make configurable
    const keyMap = {
      68: InputType.RIGHT,
      65: InputType.LEFT,
      87: InputType.UP,
      83: InputType.DOWN,
      122: InputType.FULLSCREEN
    };
    return keyMap[key]
  }

  /*
  * Stuff to do when game loads
  */
  load = () => {
    window.addEventListener("keydown", this.keydown, false)
    window.addEventListener("keyup", this.keyup, false)
  }

}
