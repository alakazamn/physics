import Renderer from "../graphics/Renderer";
import Dispatch from "./dispatch";

import Keyboard from "./keyboard";
import { InputType } from "./input";
import Core from "./core";

import { Player, Force, Surface } from "../Engine";
import { EventResult, PlayerMoveEvent, PlayerStopEvent, PlayerJumpEvent, PhysicsMoveEvent } from "../Events";
import Tile from "../graphics/Tile";
import { TickEvent } from "../event/TickEvent";
import { Chunk, GameLocation, Direction } from "../Engine";

export default class Physics {
  private static instance : Physics;
  public static readonly GRAVITY = 9.8; //m/s
  public static readonly AIR_RESISTANCE = 8; //just a constant

  private constructor() {
    //Dispatch.addPriorityListener("EntityMoveEvent",this.onEntityMove); 
    Dispatch.addPriorityListener("PlayerMoveEvent",this.onPlayerMove);
    Dispatch.addPriorityListener("PhysicsMoveEvent",this.onPhysicsMove);
    Dispatch.addPriorityListener("PlayerJumpEvent", this.onPlayerJump)
    Dispatch.addPriorityListener("TickEvent",this.onTick);

    //Dispatch.addPriorityListener("PlayerStopEvent",this.onPlayerStop);
  }

  public static getInstance() : Physics {
    if(!Physics.instance) {
        Physics.instance = new Physics();
    }
    return Physics.instance;
  }

  /*
  * Stuff to do when game loads
  */
  preload = () => {

  }

  /*
  * Stuff to do when game loads
  */

  load = () => {

  }

  onTick = (e : TickEvent) => {
    for(var i = 0; i<e.getTicks(); i++) {
      this.logic(e.getChunk(), e.getPlayer());
    }
  }

  logic = (c : Chunk, p : Player) => {    
    p.tick(); 
    /*let pixelsPerMeter = Player.HEIGHT / Player.METRIC_HEIGHT;
    let gravity = -9.8; // meters/s
    let gPT = gravity / TickEvent.TPS; //meters per tick
    let gPPT = -1 * gPT * pixelsPerMeter; //gravity pixels per tick*/
    //Dispatch.fire(new PlayerMoveEvent(p, p.getLocation(), p.getLocation().plusY(gPPT)));
    //apply forces
  }
  onPlayerJump = (e : PlayerJumpEvent) => {
    let chunk = Core.getInstance().currentChunk(); 
    if(this.checkCollision(e.getPlayer().getX(), e.getPlayer().getY()+1,chunk)) {
      e.getPlayer().applyImpulse(new Force(Math.PI/2, 2500), 0.4);
      e.getPlayer().setJumping(true);
    } else {
      e.setResult(EventResult.DENY)
    }
  }
  onPlayerMove = (e : PlayerMoveEvent) => {
    let chunk = Core.getInstance().currentChunk(); 

    let xDT = e.getTo().getX() - e.getFrom().getX();
    let yDT = e.getTo().getY() - e.getFrom().getY();

    if(yDT != 0) {
      //apply velocity resistive forces
      //determines the direction of force based on direction of movement
      e.getPlayer().applyForce(new Force(yDT > 0 ? Math.PI / 2 : 3 * Math.PI / 2, Physics.AIR_RESISTANCE*Math.pow(e.getPlayer().getVelocity().getY(),2), true))
    }
    if(xDT != 0) {
      if(this.checkCollision(e.getPlayer().getX(), e.getPlayer().getY()+1,chunk)) { //apply friction
        let bottomX = Math.ceil((e.getPlayer().getX() + Player.WIDTH)/Tile.WIDTH);
        let bottomY = Math.ceil((e.getPlayer().getY() + Player.HEIGHT+1)/Tile.HEIGHT)-1;
        let friction = new Surface(chunk.tiles[bottomX][bottomY]).getFriction();
        let fF = Math.abs(e.getPlayer().normalForce().getMagnitude() * friction);
        e.getPlayer().applyForce(new Force(xDT < 0 ? 0 : Math.PI, fF, true))
      }
      e.getPlayer().applyForce(new Force(xDT < 0 ? 0 : Math.PI, Physics.AIR_RESISTANCE/2*Math.pow(e.getPlayer().getVelocity().getX(),2), true)) //air resistance
    }

    //Collision handling for the player and the ground
    let steps = Math.ceil(Math.max(Math.abs(xDT), Math.abs(yDT)))
    if(steps == 0) return;

    let endX = e.getTo().getX();
    let endY = e.getTo().getY();
    if(endX < 0) {
      xDT = 0;
    };
    if(endY < 0) {
      return;
    };

    var x = e.getFrom().getX();
    var y = e.getFrom().getY();
    for(var a = 0; a < steps; a++) {
      if(xDT != 0 && this.checkCollision(x + (xDT / steps),y,chunk)) {
        xDT = 0;
        e.getPlayer().stopH();
        e.setResult(EventResult.DENY);
        e.getPlayer().setMoving(false);
      }
      if(yDT !=0 && this.checkCollision(x,y + (yDT / steps),chunk)) {
        yDT = 0;
        e.getPlayer().stopV();
        e.getPlayer().setJumping(false);
        e.setResult(EventResult.DENY);
      } 
      if(xDT == 0 && yDT == 0) {
        break;
      }
      x+= xDT / steps;
      y+= yDT / steps;
    }
    
    e.getPlayer().setLocation(new GameLocation(x, y, 0, 0));
    return;
  }
  checkCollision(x : number, y: number, chunk : Chunk) : boolean {
    let topX = Math.floor(x/Tile.WIDTH);
    let topY = Math.floor(y/Tile.HEIGHT);
    let bottomX = Math.ceil((x + Player.WIDTH)/Tile.WIDTH);
    let bottomY = Math.ceil((y + Player.HEIGHT)/Tile.HEIGHT);
    for(var xx = topX; xx < bottomX; xx++) {
      for(var yy = topY; yy < bottomY; yy++) {
         if(chunk.tiles[xx][yy] != -1 && this.collide(x,y,Player.WIDTH, Player.HEIGHT, xx*Tile.WIDTH, yy*Tile.HEIGHT, Tile.WIDTH, Tile.HEIGHT)) return true;
      }
    }
    return false
  }

  //From Mozilla, because I'm lazy... 
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  collide(aX : number, aY : number, aW: number, aH : number, bX : number, bY: number, bW: number, bH: number) {
    return (aX < bX + bW &&
     aX + aW > bX &&
      aY < bY + bH &&
      aY + aH > bY)
  }
  onPhysicsMove = (e : PhysicsMoveEvent) => {
    if(e.getBody() instanceof Player) {
      Dispatch.fire(new PlayerMoveEvent(e.getBody() as Player, e.getFrom(), e.getTo()));
    } else {
      throw new Error("whoops, forgot to implement this")
    }
  }

  onPlayerStop = (e : PlayerStopEvent) => {

  }

}

export enum AXIS {
  X, Y
}
