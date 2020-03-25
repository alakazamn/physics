import Renderer from "../graphics/Renderer";
import Input  from "./input";
import { InputType }  from "./input";
import Core from "./core";

export default class Keyboard {
  //modifiable
  keyMap = {
    68: InputType.RIGHT,
    65: InputType.LEFT,
    87: InputType.UP,
    83: InputType.DOWN
  };

  private static instance : Keyboard;

  private constructor() {}

  public static getInstance() : Keyboard {
    if(!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }
    return Keyboard.instance;
  }

  keydown = (event) => {
    var key = this.keyMap[event.keyCode]
    Input.getInstance().down(key);
  }

  keyup = (event) => {
    var key = this.keyMap[event.keyCode]
    Input.getInstance().up(key);
  }

  /*
  * Stuff to do when game loads
  */
  load = () => {
    window.addEventListener("keydown", this.keydown, false)
    window.addEventListener("keyup", this.keyup, false)
  }

}
