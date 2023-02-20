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

  private score : number = 0

  private constructor() {
    Dispatch.addEventListener("PlayerStopEvent",this.onPlayerStop);
    Dispatch.addEventListener("GameInputDownEvent",this.onInputDown);
    Dispatch.addEventListener("ChunkGenerateEvent",this.generateChunk);
    Dispatch.addEventListener("PlayerDeathEvent",this.onDeath);
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

 private wasJumped = false

  //a tick = every 1/20th of a second
  tick = () => {
    var now = performance.now();

    this.delta += (now - this.lastTime) * TickEvent.TPMS;
    this.lastTime = now;

    this.logic(this.delta);
    this.delta = 0;

    if(this.state == GameState.GAME) {
      if(this.chunk)
        Renderer.getInstance().renderChunk(this.chunk, this.player);
    } else {
      Renderer.getInstance().renderChunk(this.chunk, this.player)
      Renderer.getInstance().drawDeath(Math.floor(this.score/100));
    }

    if(performance.now() - this.timer >= 1000) {
        this.timer += 1000;
    }

    if(this.active)
      window.requestAnimationFrame(() => {
         this.tick();
      });
  }

  getScore = () => {
    return this.score;
  }

  logic = (delta : number) => {
    var p = this.player
    if(!p) return;

    this.input(delta)

    p.applyForce(new Force(0, 400, true));
    p.setMoving(true);

    Dispatch.fire(new TickEvent(delta, this.chunk, this.player));
  }
  input = (delta : number) => { //putting this in the loop means we have to deal with time. Need better polling
    var p = this.player
    if(!p) return;

    if(Input.getInstance().isDown(InputType.UP) && !this.wasJumped) {
      Dispatch.fire(new PlayerJumpEvent(p));
      this.wasJumped = true
    }
    if(!Input.getInstance().isDown(InputType.UP) && this.wasJumped) {
      this.wasJumped = false
    }
    if(p.getMoving() && !Input.getInstance().isDown(InputType.LEFT) && !Input.getInstance().isDown(InputType.RIGHT)) {
      Dispatch.fire(new PlayerStopEvent(p));
    }

    //This game moves for you, so this code isn't necessary:
    /*if(Input.getInstance().isDown(InputType.LEFT)) {
      p.applyForce(new Force(Math.PI, 400, true));
      p.setMoving(true);
    }
    if(Input.getInstance().isDown(InputType.RIGHT)) {
     p.applyForce(new Force(0, 400, true));
      p.setMoving(true);
    }*/
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
  currentState = () => {
    return this.state;
  }
  /*
    Random terrain generation
  */
  generateChunk = (e : ChunkGenerateEvent) => {
    var tiles : boolean[][] = [];
    var x = 0;
    let lastHeight = -1;
    let startY = -1;
    let buff = 10; //it should progressively get harder as you go.

    while(x<Chunk.WIDTH) {  //while we have more of the map to fill
      let height = Chunk.HEIGHT - Math.floor(Math.random()*8); //generate a random terrain height

      //and a random width, provided that it's not the first piece generated; otherwise, a width of 20:
      let width = startY == -1 ? 20 : Math.min(Math.floor(Math.random()*4)+3+buff, Chunk.WIDTH - x);

      if(lastHeight == -1 && height == 15) continue; //if it's the first, don't make the player fall into an empty void
      if(lastHeight == 15 && height == 15) continue; //don't place two voids in a row 
      if(lastHeight != -1 && height < lastHeight && lastHeight - height > 3) continue; //make sure all jumps are possible

      if(height >= Chunk.HEIGHT) 
        width = Math.min(4, width) //voids should be at most 4 tiles wide
      else
        buff--; //decrease the safety buffer

      lastHeight = height;

      if(startY == -1) {
        startY = height*Tile.HEIGHT - Player.HEIGHT-50; //determine where to put the player
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
      if(buff<0) buff=0;
    }
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

  onDeath = () => {
    this.score = this.timer
    this.state = GameState.DEATH;
  }
  
     /*
    Check if the player is touching a block
  */
  public checkCollision(x : number, y: number, chunk : Chunk) : boolean {
      let topX = Math.floor(x/Tile.WIDTH);
      let topY = Math.floor(y/Tile.HEIGHT);
      let bottomX = Math.ceil((x + Player.WIDTH)/Tile.WIDTH);
      let bottomY = Math.ceil((y + Player.HEIGHT-7)/Tile.HEIGHT);
      for(var xx = topX; xx < bottomX; xx++) {
        for(var yy = topY; yy < bottomY; yy++) {
           if(chunk.tiles[xx][yy] && this.collide(x,y,Player.WIDTH, Player.HEIGHT, xx*Tile.WIDTH, yy*Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT)) return true;
        }
      }
      return false
    }
  
    //From Mozilla, because I'm lazy... 
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  public collide(aX : number, aY : number, aW: number, aH : number, bX : number, bY: number, bW: number, bH: number) {
      return (aX < bX + bW &&
       aX + aW > bX &&
        aY < bY + bH &&
        aY + aH > bY)
    }
}

export enum GameState {
  LOGIN, GAME, DEATH
}
