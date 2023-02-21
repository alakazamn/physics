
import Input  from "./Input";
import { InputType }  from "./Input";

/* 
  This file handles the lower-level input information 
  (converting raw keyboard signals into InputTypes that input.ts can understand, this just makes it easier to change which key does what later on)
*/

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
    let map = this.map(event.keyCode);
    Input.getInstance().down(map);
    if(map === InputType.DEBUG) {
      event.preventDefault();
    }
  }

  keyup = (event) => {
    Input.getInstance().up(this.map(event.keyCode));
  }

  map = (key : number) : InputType => {
    //make configurable
    const keyMap = {
      68: InputType.RIGHT,
      65: InputType.LEFT,
      76: InputType.AUDIO,
      87: InputType.UP,
      83: InputType.DOWN,
      114: InputType.DEBUG,
      82: InputType.RESET
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
