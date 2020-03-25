import Renderer from "../graphics/Renderer";
import { InputType } from "./input";
import Input from "./input";
import Player from "../../shared/player";
import { Direction } from "../../shared/direction";
import * as io from 'socket.io-client';
import Chunk from "../../shared/chunk";
import Identity from "../../shared/social/identity";
import Keyboard from "./keyboard";
import PlayerJoinEvent from "../../shared/event/PlayerJoinEvent";
import Dispatch from "./dispatch";
import GameEvent, { EventResult } from "../../shared/event/event";
import PlayerMoveEvent from "../../shared/event/PlayerMoveEvent";
import PlayerQuitEvent from "../../shared/event/PlayerQuitEvent";

export default class Core {
  private static instance : Core;
  private active : Boolean = false;
  private socket: SocketIOClient.Socket

  private player : Player;
  private chunk : Chunk;

  private constructor() {
    Dispatch.addEventListener("PlayerMoveEvent",this.onPlayerMove); //can addPriorityListener if looking to do collisions somewhere else
    Dispatch.addEventListener("PlayerJoinEvent",this.onPlayerJoin);
    Dispatch.addEventListener("PlayerQuitEvent",this.onPlayerQuit);
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
   this.input()
    if(this.chunk)
      Renderer.getInstance().renderChunk(this.chunk, this.player.centerX(), this.player.centerY());
    if(this.active)
      window.requestAnimationFrame(() => {
        this.tick();
      });
  }
  input = () => {
    var p = this.player
    if(Input.getInstance().isDown(InputType.UP)) {
        Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(-16)));
    }
    if(Input.getInstance().isDown(InputType.DOWN)) {
        Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(16)));
    }
    if(Input.getInstance().isDown(InputType.LEFT)) {
      Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(-16)));
    }
    if(Input.getInstance().isDown(InputType.RIGHT)) {
      Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(16)));
    }
  }

  onPlayerMove = (e : PlayerMoveEvent) => {
    //allow or disallow

    //actually do it
    if(e.getResult() != EventResult.DENY) {
      this.player.setLocation(e.getTo());
      //send a packet
    }
    console.log("moved");
    console.log(e);
  }

  onPlayerJoin = (e : PlayerJoinEvent) => {

  }

  onPlayerQuit = (e : PlayerQuitEvent) => {

  }

  /*
  * Stuff to do when window is closing
  */

  end = () => {
    this.active = false;
    console.log("exited");
    //should remove listeners, the syntax is annoying rn.
  }
}
