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
import { GameInputDownEvent } from "../../shared/event/GameInputEvent";
import SocketHandler from "./socket";
import ChunkEvent from "../../shared/event/ChunkEvent";
import PlayerLoginEvent from "../../shared/event/PlayerLoginEvent";
import EntityMoveEvent from "../../shared/event/EntityMoveEvent";
export default class Core {
  private static instance : Core;
  private active : Boolean = false;
  private socket: SocketIOClient.Socket

  private player : Player;
  private chunk : Chunk;

  private constructor() {
    Dispatch.addEventListener("EntityMoveEvent",this.onEntityMove); //can addPriorityListener if looking to do collisions somewhere else
    Dispatch.addEventListener("PlayerMoveEvent",this.onPlayerMove); //can addPriorityListener if looking to do collisions somewhere else
    Dispatch.addEventListener("PlayerJoinEvent",this.onPlayerJoin);
    Dispatch.addEventListener("PlayerQuitEvent",this.onPlayerQuit);
    Dispatch.addEventListener("GameInputDownEvent",this.onInputDown);
    Dispatch.addEventListener("PlayerLoginEvent",this.onLoginEvent);
    Dispatch.addEventListener("ChunkEvent",this.onChunk);

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

    SocketHandler.getInstance().load();

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
 private state : GameState = GameState.LOGIN
  tick = () => {
    var now = performance.now();

    this.delta += (now - this.lastTime) / Core.TPMS;
    this.lastTime = now;

    this.logic(this.delta);
    this.updates += this.delta;
    this.delta = 0;

    if(this.state == GameState.GAME) {
      if(this.chunk)
        Renderer.getInstance().renderChunk(this.chunk, this.player.centerX(), this.player.centerY());
    }
    this.frames++;

    if(performance.now() - this.timer >= 1000) {
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
        Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(-8*delta)));
    }
    if(Input.getInstance().isDown(InputType.DOWN)) {
        Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(8*delta)));
    }
    if(Input.getInstance().isDown(InputType.LEFT)) {
      Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(-8*delta)));
    }
    if(Input.getInstance().isDown(InputType.RIGHT)) {
      Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(8*delta)));
    }
  }
  onEntityMove = (e : EntityMoveEvent) => {
    this.chunk.getEntity(e.getEntityID()).setLocation(e.getTo());
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
    console.log(e.getPlayer().getName() + e.getMessage());
    this.chunk.setEntity(e.getPlayer().getEntityID(), e.getPlayer());
    console.log(this.chunk)
  }

  onPlayerQuit = (e : PlayerQuitEvent) => {
    this.chunk.removeEntity(e.getPlayer().getEntityID());
    console.log(e);
  }

  onInputDown = (e : GameInputDownEvent) => {
    if(e.getInputType()===InputType.FULLSCREEN) {
      Renderer.getInstance().toggleFullScreen();
    }
  }

  onLoginEvent = (e : PlayerLoginEvent) => {
    console.log("Successfully authenticated.")
    this.player = e.getPlayer();
    this.state = GameState.GAME;
  }

  onChunk = (e : ChunkEvent) => {
    this.chunk = e.getChunk();
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

enum GameState {
  LOGIN, GAME
}
