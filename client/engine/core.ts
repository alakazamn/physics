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
    this.lastTime = performance.now()
    this.timer = performance.now();
    this.tick();
  }

 private lastTime : number;
 private static TPS = 20.0
 private static TPMS = 1000  / Core.TPS
 private delta = 0
 private timer : number;
 private frames = 0;
 private updates = 0;

  tick = () => {
    var now = performance.now();

    this.delta += (now - this.lastTime) / Core.TPMS;
    this.lastTime = now;

    this.logic(this.delta);
    this.updates += this.delta;
    this.delta = 0;

    if(this.chunk)
      Renderer.getInstance().renderChunk(this.chunk, this.player.centerX(), this.player.centerY());
    this.frames++;

    if(performance.now() - this.timer >= 1000) {
        console.log(this.frames);
        console.log(this.updates);
        console.log("-")
        this.timer += 1000;
        this.frames = 0;
        this.updates = 0;
    }

    if(this.active)
      window.requestAnimationFrame(() => {
        this.tick();
      });
  }
  logic = (delta : number) => {
    this.input(delta)
  }
  input = (delta : number) => { //putting this in the loop means we have to deal with time. Need better polling
    var p = this.player
    if(Input.getInstance().isDown(InputType.UP)) {
        Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(-8*delta)));
    }
    if(Input.getInstance().isDown(InputType.DOWN)) {
        Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(8*delta)));
    }
    if(Input.getInstance().isDown(InputType.LEFT)) {
      Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(-8*delta)));
    }
    if(Input.getInstance().isDown(InputType.RIGHT)) {
      Dispatch.fire("PlayerMoveEvent", new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(8*delta)));
    }
  }

  onPlayerMove = (e : PlayerMoveEvent) => {
    //allow or disallow

    //actually do it
    if(e.getResult() != EventResult.DENY) {
      e.getPlayer().setLocation(e.getTo());
      //send a packet
    }
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
