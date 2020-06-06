import Renderer from "../graphics/Renderer";
import Dispatch from "./dispatch";
import PhysicsHandler from "./physics";

import { InputType } from "./input";
import Input from "./input";

import { Player, Chunk } from "../Engine";

import { 
  EventResult,
  EntityMoveEvent, 
  PlayerJumpEvent,
  PlayerMoveEvent, 
  PlayerStopEvent, 
  GameInputDownEvent,
  ChunkEvent, 
  ChunkGenerateEvent,
  TickEvent
 } from "../Events";
import { Force } from "../engine/Force";

export default class Core {
  private static instance : Core;
  private active : Boolean = false;

  private player : Player;
  private chunk : Chunk;
  private nextChunk : Chunk;

  private constructor() {
    Dispatch.addEventListener("EntityMoveEvent",this.onEntityMove);
    Dispatch.addEventListener("PlayerMoveEvent",this.onPlayerMove); 
    Dispatch.addEventListener("PlayerStopEvent",this.onPlayerStop);
    Dispatch.addEventListener("GameInputDownEvent",this.onInputDown);
    Dispatch.addEventListener("ChunkEvent",this.onChunk);
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
  preload = () => {
    PhysicsHandler.getInstance().load();
  }

  /*
  * Stuff to do when game loads
  */

  load = () => {
    this.active = true;
    Dispatch.fire(new ChunkGenerateEvent());
    Renderer.getInstance().initialize();
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
  onEntityMove = (e : EntityMoveEvent) => {
    this.chunk.getEntity(e.getEntityID()).setLocation(e.getTo());
    this.chunk.getEntity(e.getEntityID()).setMoving(true);
  }
  onPlayerMove = (e : PlayerMoveEvent) => {
    //allow or disallow
  }

  onPlayerStop = (e : PlayerStopEvent) => {
    e.getPlayer().setMoving(false);
  }
  
  onInputDown = (e : GameInputDownEvent) => {
    if(e.getInputType()===InputType.FULLSCREEN) {
      Renderer.getInstance().toggleFullScreen();
    }
  }

  onChunk = (e : ChunkEvent) => {
    this.chunk = e.getChunk();
    console.log(this.chunk);
  }
  currentChunk = () => {
    return this.chunk;
  }
  generateChunk = (e : ChunkGenerateEvent) => {
    var tiles : number[][] = [];
    var x = 0;
    var biomes = [];
    while(x<Chunk.WIDTH) {
  
      let biome = Math.floor(Math.random() * 8);
      if(
        ((biome == 1 || biome == 6) && (biomes[biomes.length-1] == 2 || biomes[biomes.length-1] == 7)) ||
         ((biome == 2 || biome == 7) && (biomes[biomes.length-1] == 1 || biomes[biomes.length-1] == 6)) ||
         ((biome == 3 ) && (biomes[biomes.length-1] == 4)) ||
         ((biome == 4) && (biomes[biomes.length-1] == 2 || biomes[biomes.length-1] == 7)) ||
         ((biome == 2 || biome == 7) && (biomes[biomes.length-1] == 4))) {
         continue;
       }
      biomes.push(biome);
      if(biome != 3 && biome != 4)
        biomes.push(biome); //TODO: FIX, wasting mem because lazy and who cares

      const biomeWidth = biome == 3 || biome == 4 ? 16 : 32;
      let topBlock = biome;
      let bottomBlock = -1;
      let startingHeight = 10;
  
      if(biome == 3 || biome == 4) {
        startingHeight+=1;
      }
  
      if(biome >= 0 && biome < 3) {
        bottomBlock = 8;
      } else if(biome == 3) {
        bottomBlock = 10;
      } else if(biome == 4) {
        bottomBlock = 11;
      } else if(biome >= 5) {
        bottomBlock = 9;
      }
  
      for(var w = x; w<x+biomeWidth; w++) {
        tiles[w] = [];
        for(var y = 0; y<startingHeight; y++) {
          tiles[w][y] = -1;
        }
        tiles[w][startingHeight] = topBlock;
        for(var y = startingHeight+1; y<Chunk.HEIGHT; y++) {
          tiles[w][y] = bottomBlock;
        }
      }
      x += biomeWidth;
    }
    if(this.nextChunk) {
      this.chunk = this.nextChunk;
      this.nextChunk = new Chunk(tiles, [], biomes);
    } else {
      this.chunk = new Chunk(tiles, [], biomes);
    }

    this.player = new Player(100,100);
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
