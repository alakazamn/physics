import Renderer from "../graphics/Renderer";
import { Input } from "./input";
import Core from "./core";

export default class Keyboard {
  //modifiable
  keyMap = {
    68: Input.RIGHT,
    65: Input.LEFT,
    87: Input.UP,
    83: Input.DOWN
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
    Core.getInstance().inputDown(key);
  }

  keyup = (event) => {
    var key = this.keyMap[event.keyCode]
    Core.getInstance().inputUp(key);
  }

  /*
  * Stuff to do when game loads
  */
  load = () => {
    window.addEventListener("keydown", this.keydown, false)
    window.addEventListener("keyup", this.keyup, false)
  }

}
