import Renderer from "../graphics/Renderer";
import { Input } from "./input";
import Player from "../../shared/player";
import { Direction } from "../../shared/direction";
import * as io from 'socket.io-client';
import Chunk from "../../shared/chunk";
import Identity from "../../shared/social/identity";
import Keyboard from "./keyboard";

export default class Core {
  private static instance : Core;
  private active : Boolean = false;
  private socket: SocketIOClient.Socket

  private player : Player;
  private chunk : Chunk;

  private constructor() {

  }

  public static getInstance() : Core {
    if(!Core.instance) {
      Core.instance = new Core();
    }
    return Core.instance;
  }

  /*
  * Stuff to do when game loads
  */
  preload = () => {

    this.socket = io();

    console.log("preloaded");

    this.socket.emit('login');
    this.socket.on('login', (player: any) => {
      //get and set player
    });

    //var name = prompt("What's your name?");
    this.player = new Player(0,0, new Identity(""));

    this.socket.on('chunk', (chunk: any) => {
      if(Array.isArray(chunk.tiles)) { //TODO better check
        console.log("Setting");
        this.chunk = new Chunk(chunk.tiles, Array.isArray(chunk.entities) ? chunk.entites : []);
        console.log(this.chunk);
      }
    });
  }

  /*
  * Stuff to do when game loads
  */

  load = () => {
    this.active = true;
    Renderer.getInstance().initialize();
    Keyboard.getInstance().load();
    this.tick();
  }

  tick = () => {
    if(this.chunk)
      Renderer.getInstance().renderChunk(this.chunk, this.player.centerX(), this.player.centerY());
    if(this.active)
      window.requestAnimationFrame(() => {
        this.tick();
      });
  }

  public inputUp(i : Input) {
  }

  inputDown = (i : Input) => {
    if(i == Input.UP) {
      this.player.walk(Direction.UP);
    } else if(i == Input.DOWN) {
      this.player.walk(Direction.DOWN);
    } else if(i == Input.LEFT) {
      this.player.walk(Direction.LEFT);
    } else if(i == Input.RIGHT) {
      this.player.walk(Direction.RIGHT);
    }
    console.log(i);
    //update chunks somehow
  }
  /*
  * Stuff to do when window is closing
  */

  end = () => {
    this.active = false;
    console.log("exited");
  }
}
