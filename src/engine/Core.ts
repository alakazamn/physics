import Renderer from "../graphics/Renderer";
import Dispatch from "./Dispatch";
import Physics from "./Physics";
import AudioManager from "./Audio"

import { InputType } from "../input/Input";
import Input from "../input/Input";

import { Player, Chunk } from "./Engine";

/* 
  This file sets up / coordinates all the other processes (i.e. graphics, keyboard input, physics engine)
*/

import { 
  PlayerJumpEvent,
  PlayerStopEvent, 
  GameInputDownEvent,
  ChunkGenerateEvent,
  TickEvent
 } from "../event/Events";

import { Force } from "./Force";
import Tile from "../graphics/Tile";

export default class Core {
  private static instance : Core;
  private active : Boolean = false;

  private player : Player;
  private chunk : Chunk;
  private nextChunk : Chunk;

  private constructor() {
    Dispatch.addEventListener("PlayerStopEvent",this.onPlayerStop);
    Dispatch.addEventListener("GameInputDownEvent",this.onInputDown);
    Dispatch.addEventListener("ChunkGenerateEvent",this.generateChunk);
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

  load = () => {
    this.active = true;
    Dispatch.fire(new ChunkGenerateEvent());
    Renderer.getInstance().initialize();
    Physics.getInstance();
    AudioManager.getInstance();
    Input.getInstance().load();
    this.lastTime = performance.now()
    this.timer = performance.now();
    this.state = GameState.GAME;
    this.tick();
  }

 private lastTime : number;
 private delta = 0
 private timer : number;
 private state : GameState = GameState.LOGIN

  tick = () => {
    var now = performance.now();

    this.delta += (now - this.lastTime) * TickEvent.TPMS;
    this.lastTime = now;

    this.logic(this.delta);
    this.delta = 0;

    if(this.state == GameState.GAME) {
      if(this.chunk)
        Renderer.getInstance().renderChunk(this.chunk, this.player);
    }

    if(performance.now() - this.timer >= 1000) {
        this.timer += 1000;
    }

    if(this.active)
      window.requestAnimationFrame(() => {
        this.tick();
      });
  }

  logic = (delta : number) => {
    this.input(delta)
    Dispatch.fire(new TickEvent(delta, this.chunk, this.player));
  }
  input = (delta : number) => { //putting this in the loop means we have to deal with time. Need better polling
    var p = this.player
    if(!p) return;

    if(Input.getInstance().isDown(InputType.UP)) {
      Dispatch.fire(new PlayerJumpEvent(p));
    }
    if(Input.getInstance().isDown(InputType.DOWN)) {
        //Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(16*delta)));
    }
    if(Input.getInstance().isDown(InputType.LEFT)) {
      p.applyForce(new Force(Math.PI, 400, true));
      p.setMoving(true);
    }
    if(Input.getInstance().isDown(InputType.RIGHT)) {
      p.applyForce(new Force(0, 400, true));
      p.setMoving(true);
      //Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusX(16*delta)));
    }
    if(p.getMoving() && !Input.getInstance().isDown(InputType.LEFT) && !Input.getInstance().isDown(InputType.RIGHT)) {
      Dispatch.fire(new PlayerStopEvent(p));
    }
  }

  onPlayerStop = (e : PlayerStopEvent) => {
    e.getPlayer().setMoving(false);
  }
  
  onInputDown = (e : GameInputDownEvent) => {
    if(e.getInputType()===InputType.DEBUG) {
      Renderer.getInstance().toggleDebug();
    } 
    else if(e.getInputType()===InputType.AUDIO) {
      AudioManager.getInstance().toggleMusic();
    }
  }

  currentChunk = () => {
    return this.chunk;
  }

  generateChunk = (e : ChunkGenerateEvent) => {
    var tiles : boolean[][] = [];
    var x = 0;
    let lastHeight = -1;
    let startY = -1;
    while(x<Chunk.WIDTH) {
      let height = Chunk.HEIGHT - Math.floor(Math.random()*8);
      let width = Math.min(Math.floor(Math.random()*4)+3, Chunk.WIDTH - x);
      
      if(lastHeight != -1 && height < lastHeight && lastHeight - height > 3) continue;
      if(height <= Chunk.HEIGHT-1) 
        width = Math.min(4, width)
      lastHeight = height;

      if(startY == -1) {
        startY = height*Tile.HEIGHT - Player.HEIGHT-50;
      }
      for(var xx = x; xx<x+width; xx++) {
        tiles[xx] = []
        for(var yy = 0; yy < Chunk.HEIGHT; yy++) {
          if(yy < height) {
            tiles[xx][yy] = false;
          } else {
            tiles[xx][yy] = true;
          }
        }
      }
      x+=width;

    }
    console.log(startY);
    if(this.nextChunk) {
      this.chunk = this.nextChunk;
      this.nextChunk = new Chunk(tiles, [], startY);
    } else {
      this.chunk = new Chunk(tiles, [], startY);
    }

    this.player = new Player(100,this.chunk.startY);
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
